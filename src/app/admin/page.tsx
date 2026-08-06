import Link from "next/link";
import {
    FileText,
    Users,
    CheckCircle,
    Clock,
    TrendingUp,
    ArrowUpRight,
    Activity,
} from "lucide-react";

import { connectDB } from "@/lib/db/mongoose";
import { getDashboardStats } from "@/services/dashboard.service";

export default async function AdminPage() {
    await connectDB();

    const dashboard = await getDashboardStats();

    const stats = [
        {
            title: "Total Schemes",
            value: dashboard.totalSchemes,
            icon: FileText,
            change: "Updated recently",
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
            glow: "rgba(22,163,74,0.12)",
        },
        {
            title: "Active Schemes",
            value: dashboard.activeSchemes,
            icon: CheckCircle,
            change: "Live & running",
            color: "#15803d",
            bg: "#dcfce7",
            border: "#86efac",
            glow: "rgba(21,128,61,0.12)",
        },
        {
            title: "Total Users",
            value: dashboard.totalUsers,
            icon: Users,
            change: "Registered users",
            color: "#166534",
            bg: "#f0fdf4",
            border: "#bbf7d0",
            glow: "rgba(22,101,52,0.12)",
        },
        {
            title: "Pending Updates",
            value: dashboard.pendingUpdates,
            icon: Clock,
            change: "Needs attention",
            color: "#ca8a04",
            bg: "#fefce8",
            border: "#fde047",
            glow: "rgba(202,138,4,0.12)",
        },
    ];

    return (
        <main className="mx-auto max-w-7xl px-6 py-10">
            {/* Header */}
            <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                            <Activity className="w-3 h-3 text-emerald-600" />
                            Live Overview
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 text-slate-900">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-base text-slate-600">
                        Welcome back! Here's a real-time overview of YojanaSaarthi.
                    </p>
                </div>

                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
                    >
                        🌐 ← Back to Main Website
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-10">
                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 bg-white border border-slate-200 shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                    style={{
                                        background: `linear-gradient(135deg, ${item.bg}, ${item.border}40)`,
                                        border: `1px solid ${item.border}`,
                                    }}
                                >
                                    <Icon
                                        className="w-5 h-5"
                                        style={{ color: item.color }}
                                    />
                                </div>

                                <ArrowUpRight
                                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    style={{ color: item.color }}
                                />
                            </div>

                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                {item.value}
                            </h2>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                                {item.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                {item.change}
                            </p>

                            <div
                                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    background: `linear-gradient(90deg, ${item.color}, transparent)`,
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl p-8 bg-white border border-slate-200 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-50 border border-emerald-200">
                            <TrendingUp className="w-4 h-4 text-emerald-700" />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Recent Activity
                            </h2>

                            <p className="text-xs text-slate-500">
                                Latest platform updates
                            </p>
                        </div>
                    </div>

                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {dashboard.recentActivities.length} Recent
                    </span>
                </div>

                {dashboard.recentActivities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 rounded-xl bg-slate-50 border border-dashed border-slate-200">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-emerald-100">
                            <Activity className="w-6 h-6 text-emerald-700" />
                        </div>

                        <p className="text-sm font-semibold text-slate-700">
                            No activity yet
                        </p>

                        <p className="text-xs mt-1 text-center max-w-xs text-slate-400">
                            Recently added or updated schemes will appear here once data is available.
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
                                    <p className="font-semibold text-slate-800 text-sm">
                                        {activity.action}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {activity.description}
                                    </p>
                                </div>

                                <p className="text-xs font-medium text-slate-400">
                                    {new Date(activity.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}