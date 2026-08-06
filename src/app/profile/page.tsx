"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

type FieldErrors = Partial<Record<"name" | "image", string[]>>;

type ProfileData = {
    name: string;
    email: string;
    image: string;
    role: string;
    provider: string;
};

export default function ProfilePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const [bookmarkCount, setBookmarkCount] = useState(0);


    // Profile data from database
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [fetchingProfile, setFetchingProfile] = useState(true);

    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [recentCount, setRecentCount] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            toast.error("Profile picture must be under 1MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
            setFieldErrors((prev) => ({ ...prev, image: undefined }));
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // Fetch bookmarks & profile details from DB
    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const res = await fetch("/api/bookmarks");
                if (!res.ok) return;

                const text = await res.text();
                if (!text) return;

                const data = JSON.parse(text);
                if (data.success) {
                    setBookmarkCount(data.data.length);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchRecentlyViewed = async () => {
            try {
                const res = await fetch("/api/recently-viewed");
                const data = await res.json();

                if (data.success) {
                    setRecentCount(data.data.length);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchProfile = async () => {
            try {
                setFetchingProfile(true);
                const res = await fetch("/api/user/profile");
                const data = await res.json();
                if (data.success) {
                    setProfileData(data.data);
                    setName(data.data.name);
                    setImage(data.data.image);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setFetchingProfile(false);
            }
        };

        if (status === "authenticated") {
            fetchBookmarks();
            fetchProfile();
            fetchRecentlyViewed();

        }
    }, [status]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, image }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors?.fieldErrors) {
                    setFieldErrors(data.errors.fieldErrors);
                    return;
                }
                toast.error(data.message || "Failed to update profile.");
                return;
            }

            // Update local profile state
            setProfileData((prev) => prev ? { ...prev, name, image } : null);

            // Refresh session (NextAuth will call jwt callback to sync user name)
            await update({ name });

            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || (status === "authenticated" && fetchingProfile)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
                    <p className="text-slate-500 text-sm font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!session || !profileData) return null;

    const initials = profileData.name
        ? profileData.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    return (
        <main className="mx-auto max-w-7xl px-6 py-10 space-y-6">

                {/* Back Link */}
                <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Profile Card */}
                <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                    {/* Decorative Top Bar */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 to-teal-500" />

                    <div className="flex flex-col sm:flex-row items-center gap-6 mt-2">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full flex-shrink-0 flex items-center justify-center text-white text-3xl font-bold bg-gradient-to-br from-emerald-600 to-teal-500 shadow-inner overflow-hidden border-2 border-slate-100">
                            {profileData.image ? (
                                <img src={profileData.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                initials
                            )}
                        </div>

                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-3xl font-bold text-slate-800">
                                {profileData.name}
                            </h1>
                            <p className="text-slate-500 mt-1">{profileData.email}</p>

                            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                Active Account
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <button
                                onClick={() => {
                                    setName(profileData.name);
                                    setImage(profileData.image);
                                    setIsEditing(true);
                                }}
                                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-all flex items-center gap-2"
                            >
                                ✏️ Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid gap-6 sm:grid-cols-2">
                    {[
                        { label: "Account Status", value: "Active", sub: "Verified profile", color: "text-emerald-600", bg: "bg-emerald-50/50" },
                        { label: "Login Method", value: profileData.provider === "google" ? "Google OAuth" : "Credentials", sub: "Authentication source", color: "text-slate-800", bg: "bg-slate-50/50" },
                        { label: "Saved Schemes", value: bookmarkCount, sub: "Bookmarked for later", color: "text-emerald-700", bg: "bg-emerald-50/50" },
                        { label: "Recently Viewed", value: recentCount, sub: "Schemes viewed recently", color: "text-blue-600", bg: "bg-blue-50/50" },
                    ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-slate-100 p-6 bg-white shadow-sm flex flex-col justify-between">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                            <div className="mt-4">
                                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                                <p className="text-xs text-slate-400 mt-1">{item.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Edit Profile Modal */}
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-100 flex flex-col gap-6 transform transition-all scale-100">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
                                <p className="text-xs text-slate-500 mt-1">Update your basic account information.</p>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            setFieldErrors((prev) => ({ ...prev, name: undefined }));
                                        }}
                                        placeholder="Enter your name"
                                        required
                                        disabled={loading}
                                        className={`w-full rounded-xl border px-4 py-3 text-sm bg-white text-slate-900 outline-none transition-all
                      focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                      disabled:bg-slate-50 disabled:text-slate-400
                      ${fieldErrors.name ? "border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50" : "border-slate-200"}`}
                                    />
                                    {fieldErrors.name && (
                                        <p className="mt-1 text-xs text-red-500">{fieldErrors.name[0]}</p>
                                    )}
                                </div>

                                {/* Profile Picture Upload */}
                                <div className="flex flex-col items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <span className="block text-sm font-medium text-slate-700 w-full text-left">
                                        Profile Picture
                                    </span>

                                    <div className="flex items-center gap-4 w-full">
                                        {/* Avatar Preview */}
                                        <div className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br from-emerald-600 to-teal-500 shadow-inner overflow-hidden border-2 border-white">
                                            {image ? (
                                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                initials
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <label
                                                    htmlFor="avatar-upload"
                                                    className="cursor-pointer rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-100"
                                                >
                                                    Upload Photo
                                                </label>
                                                <input
                                                    id="avatar-upload"
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/webp"
                                                    disabled={loading}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                {image && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setImage("")}
                                                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors border border-red-100"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-slate-400">
                                                Supports PNG, JPG or WEBP (Max 1MB)
                                            </p>
                                        </div>
                                    </div>
                                    {fieldErrors.image && (
                                        <p className="w-full text-xs text-red-500 text-left">{fieldErrors.image[0]}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        disabled={loading}
                                        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center gap-2"
                                    >
                                        {loading && (
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                        )}
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
        </main>
    );
}