"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, safeJsonParse } from "@/lib/apiClient";

type BookmarkedScheme = {
    _id: string;
    schemeId: {
        _id: string;
        title: string;
        slug: string;
        shortDescription: string;
        category: string;
        ministry: string;
        status: "Active" | "Upcoming" | "Expired";
    };
    createdAt: string;
};

const categoryEmoji: Record<string, string> = {
    Agriculture: "🌾", Education: "📚", Health: "🏥", Housing: "🏠",
    Employment: "💼", "Women Empowerment": "👩", Children: "👶",
    "Senior Citizens": "👴", Business: "🏢", Finance: "💰",
    "Skill Development": "🛠️", "Social Welfare": "🤝", "Minority Welfare": "🕌",
    "SC/ST Welfare": "🫂", Environment: "🌿", "Digital India": "💻",
    Startup: "🚀", "Rural Development": "🌄", "Urban Development": "🏙️",
    Insurance: "🛡️", Scholarship: "🎓",
};

const statusColor: Record<string, string> = {
    Active: "#22c55e",
    Upcoming: "#f59e0b",
    Expired: "#ef4444",
};

const statusBg: Record<string, string> = {
    Active: "#f0fdf4",
    Upcoming: "#fffbeb",
    Expired: "#fef2f2",
};



export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [bookmarks, setBookmarks] = useState<BookmarkedScheme[]>([]);
    const [loadingBookmarks, setLoadingBookmarks] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [recentSchemes, setRecentSchemes] = useState<any[]>([]);
    const [userImage, setUserImage] = useState("");
    const [recommendedSchemes, setRecommendedSchemes] = useState<any[]>([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(true);
    const [notificationCount, setNotificationCount] = useState(0);

    const fetchBookmarks = async () => {
        try {
            setLoadingBookmarks(true);
            const res = await apiFetch("/api/bookmarks");
            const data = await safeJsonParse(res);
            if (data.success && Array.isArray(data.data)) {
                setBookmarks(data.data);
                const ids = data.data
                    .map((b: any) => (typeof b.schemeId === "object" ? b.schemeId?._id : b.schemeId))
                    .filter(Boolean);
                localStorage.setItem("userBookmarks", JSON.stringify(ids));
                window.dispatchEvent(new Event("bookmarks-updated"));
            }
        } catch (error) {
            console.error("Failed to fetch bookmarks:", error);
        } finally {
            setLoadingBookmarks(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const res = await apiFetch("/api/user/profile");
            const data = await safeJsonParse(res);
            if (data.success && data.data?.image) {
                setUserImage(data.data.image);
            }
        } catch {
            // silently fail
        }
    };

    const fetchRecentSchemes = async () => {
        try {
            const res = await apiFetch("/api/recently-viewed");
            const data = await safeJsonParse(res);
            if (data.success && Array.isArray(data.data)) {
                setRecentSchemes(data.data);
            }
        } catch {
            // silently fail
        }
    };

    const fetchNotificationsCount = async () => {
        try {
            const res = await apiFetch("/api/notifications");
            const data = await safeJsonParse(res);
            if (data.success && Array.isArray(data.data)) {
                const unread = data.data.filter((n: any) => !n.isRead).length;
                setNotificationCount(unread);
            }
        } catch {
            // silently fail
        }
    };

    const fetchRecommendations = async () => {
        try {
            setLoadingRecommendations(true);

            const res = await apiFetch("/api/recommendations");
            const data = await safeJsonParse(res);

            if (data.success && Array.isArray(data.data)) {
                setRecommendedSchemes(data.data);
            }
        } catch {
            // silently fail
        } finally {
            setLoadingRecommendations(false);
        }
    };

    // Redirect to login if not authenticated, or to admin panel if user is admin
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && (session?.user as any)?.role === "admin") {
            router.push("/admin");
        }
    }, [status, session, router]);

    // Fetch bookmarks, profile details, recently viewed & notifications in parallel
    useEffect(() => {
        if (status !== "authenticated") return;
        Promise.allSettled([
            fetchBookmarks(),
            fetchUserProfile(),
            fetchRecentSchemes(),
            fetchRecommendations(),
            fetchNotificationsCount(),
        ]);
    }, [status]);

    const handleRemoveBookmark = async (bookmarkId: string) => {
        setRemovingId(bookmarkId);
        try {
            const targetBookmark = bookmarks.find((b) => b._id === bookmarkId);
            const res = await apiFetch(`/api/bookmarks/${bookmarkId}`, { method: "DELETE" });
            if (res.ok) {
                setBookmarks((prev) => prev.filter((b) => b._id !== bookmarkId));
                const schemeId = targetBookmark?.schemeId?._id;
                if (schemeId) {
                    try {
                        const raw = localStorage.getItem("userBookmarks");
                        if (raw) {
                            const ids = JSON.parse(raw);
                            const next = ids.filter((id: string) => id !== schemeId);
                            localStorage.setItem("userBookmarks", JSON.stringify(next));
                            window.dispatchEvent(new Event("bookmarks-updated"));
                        }
                    } catch {
                        // ignore
                    }
                }
            }
        } catch {
            // silently fail
        } finally {
            setRemovingId(null);
        }
    };

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                    <p className="text-slate-500 text-sm">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") return null;

    const user = session?.user;
    const firstName = user?.name?.split(" ")[0] ?? "there";
    const initials = user?.name
        ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    return (
        <main className="mx-auto max-w-7xl px-6 py-10 space-y-10">
                {/* ── Hero greeting ── */}
                <section
                    className="rounded-2xl p-8 relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #059669 100%)",
                    }}
                >
                    {/* Decorative blobs */}
                    <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10"
                        style={{ background: "radial-gradient(circle, #6ee7b7, transparent)" }} />
                    <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full opacity-5"
                        style={{ background: "radial-gradient(circle, #ffffff, transparent)" }} />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <Link href="/profile" className="flex items-center gap-4 group cursor-pointer" title="Click to Edit Profile">
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 border-2 border-emerald-300 group-hover:border-white transition-all overflow-hidden shadow-md"
                                style={{ background: "linear-gradient(135deg, #064e3b, #059669)" }}
                            >
                                {userImage || user?.image ? (
                                    <img src={userImage || user?.image || ""} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                ) : (
                                    initials
                                )}
                            </div>
                            <div>
                                <p className="text-emerald-300 text-xs font-medium mb-0.5">{greeting} 👋</p>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-emerald-200 transition-colors flex items-center gap-2">
                                    <span>{user?.name || firstName}</span>
                                    <span className="text-xs bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-2.5 py-1 rounded-full font-semibold">
                                        ✏️ Edit Profile
                                    </span>
                                </h1>
                                <p className="mt-1 text-emerald-200 text-xs sm:text-sm max-w-md">
                                    Welcome to your personal scheme dashboard. Manage your profile & saved schemes.
                                </p>
                            </div>
                        </Link>

                        <div className="flex gap-3 flex-wrap items-center">
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:bg-white/20"
                                style={{ background: "rgba(255,255,255,0.18)", color: "#fff", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}
                            >
                                ✏️ Edit Profile
                            </Link>
                            <Link
                                href="/assistant"
                                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all"
                                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
                            >
                                🤖 Try AI Assistant
                            </Link>
                            <Link
                                href="/schemes"
                                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold bg-white text-emerald-800 transition-all hover:bg-emerald-50"
                            >
                                🔍 Browse Schemes
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all bg-red-500/80 hover:bg-red-600 text-white backdrop-blur-md border border-red-400/30 cursor-pointer shadow-sm"
                            >
                                🚪 Log Out
                            </button>
                        </div>
                    </div>
                </section>

                {/* ── Stats row ── */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        {
                            label: "Bookmarked Schemes",
                            value: loadingBookmarks ? "—" : bookmarks.length,
                            icon: "📌",
                            color: "#064e3b",
                            bg: "#f0fdf4",
                            border: "#bbf7d0",
                        },
                        {
                            label: "Active Bookmarks",
                            value: loadingBookmarks ? "—" : bookmarks.filter((b) => b.schemeId?.status === "Active").length,
                            icon: "✅",
                            color: "#15803d",
                            bg: "#dcfce7",
                            border: "#86efac",
                        },
                        {
                            label: "AI Recommended",
                            value: loadingRecommendations ? "—" : recommendedSchemes.length,
                            icon: "🤖",
                            color: "#7c3aed",
                            bg: "#f5f3ff",
                            border: "#ddd6fe",
                        },
                        {
                            label: "Notifications",
                            value: notificationCount,
                            icon: "🔔",
                            color: "#d97706",
                            bg: "#fffbeb",
                            border: "#fde68a",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl p-5 flex flex-col gap-3"
                            style={{
                                background: "#fff",
                                border: `1px solid ${stat.border}`,
                                boxShadow: `0 2px 12px rgba(0,0,0,0.04)`,
                            }}
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                                style={{ background: stat.bg }}
                            >
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-2xl font-bold" style={{ color: stat.color }}>
                                    {stat.value}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </section>

                <div className="space-y-8">
                    {/* ── Bookmarks ── */}
                    <section id="bookmarks" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">📌 Saved Schemes</h2>
                            <Link href="/schemes" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                                + Add more
                            </Link>
                        </div>

                        {loadingBookmarks ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="rounded-2xl bg-white border border-slate-100 p-5 animate-pulse">
                                        <div className="h-4 bg-slate-100 rounded w-3/4 mb-3" />
                                        <div className="h-3 bg-slate-100 rounded w-1/2 mb-2" />
                                        <div className="h-3 bg-slate-100 rounded w-2/3" />
                                    </div>
                                ))}
                            </div>
                        ) : bookmarks.length === 0 ? (
                            <div
                                className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-16 text-center"
                                style={{ borderColor: "#bbf7d0", background: "#f8fffe" }}
                            >
                                <div className="text-5xl mb-4">📭</div>
                                <p className="font-semibold text-slate-700">No bookmarks yet</p>
                                <p className="text-sm text-slate-400 mt-1 max-w-xs">
                                    Browse schemes and click the ❤️ button to save them here.
                                </p>
                                <Link
                                    href="/schemes"
                                    className="mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all"
                                    style={{ background: "linear-gradient(135deg, #064e3b, #059669)", boxShadow: "0 4px 12px rgba(5,150,105,0.3)" }}
                                >
                                    Browse Schemes
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {bookmarks.map((bookmark) => {
                                    const scheme = bookmark.schemeId;
                                    if (!scheme) return null;
                                    return (
                                        <div
                                            key={bookmark._id}
                                            className="group rounded-2xl bg-white border border-slate-100 p-5 hover:border-emerald-200 hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                                    {/* Category emoji avatar */}
                                                    <div
                                                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                                        style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                                                    >
                                                        {categoryEmoji[scheme.category] ?? "📋"}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                                            <span
                                                                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                                                style={{
                                                                    background: statusBg[scheme.status] ?? "#f8fafc",
                                                                    color: statusColor[scheme.status] ?? "#64748b",
                                                                }}
                                                            >
                                                                {scheme.status}
                                                            </span>
                                                            <span className="text-xs text-slate-400">{scheme.category}</span>
                                                        </div>

                                                        <Link href={`/schemes/${scheme.slug}`}>
                                                            <h3 className="font-semibold text-slate-800 text-sm line-clamp-1 hover:text-emerald-700 transition-colors">
                                                                {scheme.title}
                                                            </h3>
                                                        </Link>
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{scheme.shortDescription}</p>
                                                        <p className="text-xs text-slate-400 mt-2">{scheme.ministry}</p>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                                    <Link
                                                        href={`/schemes/${scheme.slug}`}
                                                        className="text-xs text-emerald-600 font-semibold hover:underline"
                                                    >
                                                        View →
                                                    </Link>
                                                    <button
                                                        onClick={() => handleRemoveBookmark(bookmark._id)}
                                                        disabled={removingId === bookmark._id}
                                                        className="text-xs text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                                    >
                                                        {removingId === bookmark._id ? "..." : "Remove"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* ── Recently Viewed ── */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-800">👀 Recently Viewed</h2>


                        {recentSchemes.length === 0 ? (
                            <div
                                className="rounded-2xl border flex flex-col items-center justify-center py-10 text-center"
                                style={{ background: "#fff", borderColor: "#e2e8f0" }}
                            >
                                <div className="text-4xl mb-3">🕐</div>
                                <p className="text-sm font-semibold text-slate-600">No recently viewed schemes</p>
                                <p className="text-xs text-slate-400 mt-1">Schemes you open will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentSchemes.map((scheme) => (
                                    <Link
                                        key={scheme._id}
                                        href={`/schemes/${scheme.slug}`}
                                        className="flex items-start gap-4 rounded-2xl bg-white border border-slate-100 p-4 hover:border-emerald-200 hover:shadow-md transition-all duration-200 group"
                                    >
                                        {/* Category emoji */}
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                            style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                                        >
                                            {categoryEmoji[scheme.category] ?? "📋"}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span
                                                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                                    style={{
                                                        background: statusBg[scheme.status] ?? "#f8fafc",
                                                        color: statusColor[scheme.status] ?? "#64748b",
                                                    }}
                                                >
                                                    {scheme.status}
                                                </span>
                                                <span className="text-xs text-slate-400">{scheme.category}</span>
                                            </div>
                                            <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                                                {scheme.title}
                                            </h3>
                                            <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                                                {scheme.shortDescription}
                                            </p>
                                        </div>

                                        <span className="text-xs text-emerald-600 font-semibold flex-shrink-0 mt-0.5 group-hover:underline">
                                            View →
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
    );
}
