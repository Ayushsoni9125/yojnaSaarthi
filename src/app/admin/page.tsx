import Link from "next/link";
import {
    FileText,
    Users,
    CheckCircle,
    TrendingUp,
    ArrowUpRight,
    Activity,
    CalendarPlus,
    AlertTriangle,
    Trash2,
} from "lucide-react";

import { connectDB } from "@/lib/db/mongoose";
import { getDashboardStats } from "@/services/dashboard.service";
import DailySchemeTracker from "@/components/admin/DailySchemeTracker";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    await connectDB();

    const dashboard = await getDashboardStats();

    const stats = [
        {
            title: "Total Schemes",
            value: dashboard.totalSchemes,
            icon: FileText,
            change: "Government catalog",
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
            href: "/admin/schemes",
        },
        {
            title: "Added Today",
            value: dashboard.addedToday,
            icon: CalendarPlus,
            change: dashboard.addedToday > 0 ? "Freshly scraped today" : "No new schemes today",
            color: "#059669",
            bg: "#ecfdf5",
            border: "#a7f3d0",
            href: "/admin/schemes?timeFrame=today",
            highlight: dashboard.addedToday > 0,
        },
        {
            title: "Expired Schemes",
            value: dashboard.expiredSchemes,
            icon: AlertTriangle,
            change: "Deadlines closed",
            color: "#d97706",
            bg: "#fffbeb",
            border: "#fde68a",
            href: "/admin/schemes?status=Expired",
        },
        {
            title: "Deleted / Reconciled",
            value: dashboard.deletedTotal,
            icon: Trash2,
            change: `${dashboard.deletedToday} delisted today`,
            color: "#e11d48",
            bg: "#fff1f2",
            border: "#fecdd3",
            href: "#daily-tracker",
        },
        {
            title: "Active Schemes",
            value: dashboard.activeSchemes,
            icon: CheckCircle,
            change: "Live & accessible",
            color: "#15803d",
            bg: "#dcfce7",
            border: "#86efac",
            href: "/admin/schemes?status=Active",
        },
        {
            title: "Registered Users",
            value: dashboard.totalUsers,
            icon: Users,
            change: "Citizens onboarded",
            color: "#0284c7",
            bg: "#f0f9ff",
            border: "#bae6fd",
            href: "/admin/users",
        },
    ];

    return (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                            <Activity className="w-3 h-3 text-emerald-600" />
                            Live System Status
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 text-slate-900">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-sm sm:text-base text-slate-600">
                        Real-time overview of scheme ingestions, expiration audits, and system health.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Link
                        href="/admin/scraper"
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition-colors"
                    >
                        ⚙️ Scraper Controls
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
                    >
                        🌐 Main Website
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="group relative rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 bg-white border border-slate-200 shadow-sm hover:shadow-md block"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                    style={{
                                        background: `linear-gradient(135deg, ${item.bg}, ${item.border}50)`,
                                        border: `1px solid ${item.border}`,
                                    }}
                                >
                                    <Icon
                                        className="w-4 h-4 sm:w-5 sm:h-5"
                                        style={{ color: item.color }}
                                    />
                                </div>

                                <ArrowUpRight
                                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-slate-400 group-hover:text-slate-600"
                                />
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                {item.value}
                            </h2>

                            <p className="mt-1 text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                                {item.title}
                            </p>

                            <p className="mt-1 text-[11px] text-slate-500 font-medium line-clamp-1">
                                {item.change}
                            </p>

                            <div
                                className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    background: `linear-gradient(90deg, ${item.color}, transparent)`,
                                }}
                            />
                        </Link>
                    );
                })}
            </div>

            {/* Daily Scheme Tracker Section */}
            <div id="daily-tracker">
                <DailySchemeTracker
                    addedToday={dashboard.addedTodayList}
                    expiredSchemes={dashboard.expiredList}
                    deletedSchemes={dashboard.deletedList}
                    totalAddedToday={dashboard.addedToday}
                    totalExpired={dashboard.expiredSchemes}
                    totalDeleted={dashboard.deletedTotal}
                    deletedTodayCount={dashboard.deletedToday}
                    scraperStats={dashboard.latestScraper}
                />
            </div>

            {/* Recent Platform Activity */}
            <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-50 border border-emerald-200">
                            <TrendingUp className="w-4 h-4 text-emerald-700" />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Recent Activity Logs
                            </h2>

                            <p className="text-xs text-slate-500">
                                Real-time modifications, scraper imports, and deletion records
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/admin/activity"
                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors w-fit"
                    >
                        View Full Activity ({dashboard.recentActivities.length} Recent) →
                    </Link>
                </div>

                {dashboard.recentActivities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 rounded-xl bg-slate-50 border border-dashed border-slate-200">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 bg-emerald-100">
                            <Activity className="w-5 h-5 text-emerald-700" />
                        </div>

                        <p className="text-sm font-semibold text-slate-700">
                            No activity recorded yet
                        </p>

                        <p className="text-xs mt-1 text-center max-w-xs text-slate-400">
                            Recently added or updated schemes will appear here once actions are performed.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {dashboard.recentActivities.map((activity: any) => (
                            <div
                                key={activity._id}
                                className="flex flex-col gap-2 rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                activity.action === "DELETE" || activity.action === "RECONCILE_DELETE"
                                                    ? "bg-rose-100 text-rose-800"
                                                    : activity.action === "IMPORT" || activity.action === "CREATE"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}
                                        >
                                            {activity.action}
                                        </span>
                                        <p className="font-semibold text-slate-800 text-sm">
                                            {activity.description}
                                        </p>
                                    </div>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Triggered by: {activity.performedBy || "System"} • Resource: {activity.resource}
                                    </p>
                                </div>

                                <p className="text-xs font-medium text-slate-400 whitespace-nowrap">
                                    {new Date(activity.createdAt).toLocaleString("en-IN", {
                                        timeZone: "Asia/Kolkata",
                                        day: "2-digit",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })} IST
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}