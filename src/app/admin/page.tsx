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
        <div
            className="min-h-screen p-8"
            style={{
                background:
                    "linear-gradient(135deg, #f8fffe 0%, #f0fdf4 50%, #ffffff 100%)",
            }}
        >
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-1">
                    <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                        style={{
                            background: "#dcfce7",
                            color: "#15803d",
                            border: "1px solid #86efac",
                        }}
                    >
                        <Activity className="w-3 h-3" />
                        Live
                    </span>
                </div>

                <h1
                    className="text-4xl font-bold tracking-tight mt-2"
                    style={{ color: "#052e16" }}
                >
                    Admin Dashboard
                </h1>

                <p className="mt-2 text-base" style={{ color: "#6b7280" }}>
                    Welcome back! Here's a real-time overview of YojanaSaarthi.
                </p>

                <div
                    className="mt-6 h-0.5 w-24 rounded-full"
                    style={{
                        background: "linear-gradient(90deg, #16a34a, #86efac)",
                    }}
                />
            </div>

            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-10">
                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                            style={{
                                background: "#ffffff",
                                border: `1px solid ${item.border}`,
                                boxShadow: `0 4px 24px ${item.glow}, 0 1px 4px rgba(0,0,0,0.04)`,
                            }}
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

                            <h2
                                className="text-3xl font-bold tracking-tight"
                                style={{ color: "#052e16" }}
                            >
                                {item.value}
                            </h2>

                            <p
                                className="mt-1 text-sm font-medium"
                                style={{ color: "#374151" }}
                            >
                                {item.title}
                            </p>

                            <p
                                className="mt-1 text-xs"
                                style={{ color: "#9ca3af" }}
                            >
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
            <div
                className="rounded-2xl p-8"
                style={{
                    background: "#ffffff",
                    border: "1px solid #bbf7d0",
                    boxShadow:
                        "0 4px 24px rgba(22,163,74,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{
                                background: "#dcfce7",
                                border: "1px solid #86efac",
                            }}
                        >
                            <TrendingUp
                                className="w-4 h-4"
                                style={{ color: "#15803d" }}
                            />
                        </div>

                        <div>
                            <h2
                                className="text-lg font-bold"
                                style={{ color: "#052e16" }}
                            >
                                Recent Activity
                            </h2>

                            <p
                                className="text-xs"
                                style={{ color: "#9ca3af" }}
                            >
                                Latest platform updates
                            </p>
                        </div>
                    </div>

                    <span
                        className="text-xs font-medium px-3 py-1.5 rounded-full"
                        style={{
                            background: "#f0fdf4",
                            color: "#16a34a",
                            border: "1px solid #bbf7d0",
                        }}
                    >
                        {dashboard.recentActivities.length} Recent
                    </span>
                </div>

                {dashboard.recentActivities.length === 0 ? (
                    <div
                        className="flex flex-col items-center justify-center py-14 rounded-xl"
                        style={{
                            background: "#f8fffe",
                            border: "1px dashed #86efac",
                        }}
                    >
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                            style={{ background: "#dcfce7" }}
                        >
                            <Activity
                                className="w-6 h-6"
                                style={{ color: "#16a34a" }}
                            />
                        </div>

                        <p
                            className="text-sm font-semibold"
                            style={{ color: "#374151" }}
                        >
                            No activity yet
                        </p>

                        <p
                            className="text-xs mt-1 text-center max-w-xs"
                            style={{ color: "#9ca3af" }}
                        >
                            Recently added or updated schemes will appear here once data is
                            available.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {dashboard.recentActivities.map((activity: any) => (
                            <div
                                key={activity._id}
                                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition"
                            >
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        {activity.action}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {activity.description}
                                    </p>
                                </div>

                                <p className="text-xs text-slate-400">
                                    {new Date(activity.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}