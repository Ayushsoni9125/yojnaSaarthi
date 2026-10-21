"use client";

import { useEffect, useState, useCallback } from "react";

type ScraperStats = {
    status: string;
    lastRun: string | null;
    importedSchemes: number;
    failedSchemes: number;
    totalSchemes: number;
    currentOffset: number;
    error?: string | null;
};

function formatIndianTime(dateStr: string | null | undefined): string {
    if (!dateStr) return "Never";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Never";
    return (
        d.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        }) + " IST"
    );
}

export default function ScraperControls() {
    const [stats, setStats] = useState<ScraperStats | null>(null);
    const [starting, setStarting] = useState(false);
    const [stopping, setStopping] = useState(false);

    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch("/api/scraper/status", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch {
            // ignore polling errors
        }
    }, []);

    // Poll every 2 seconds
    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 2000);
        return () => clearInterval(interval);
    }, [fetchStatus]);

    async function handleRunScraper() {
        try {
            setStarting(true);
            const res = await fetch("/api/scraper/run", { method: "POST" });
            const data = await res.json();
            if (!data.success) {
                alert(data.message ?? "Failed to start scraper");
            }
            // Immediately re-fetch status
            await fetchStatus();
        } catch {
            alert("Failed to start scraper");
        } finally {
            setStarting(false);
        }
    }

    async function handleStopScraper() {
        try {
            setStopping(true);
            const res = await fetch("/api/scraper/stop", { method: "POST" });
            const data = await res.json();
            if (!data.success) {
                alert(data.message ?? "Failed to stop scraper");
            }
            // Immediately re-fetch status
            await fetchStatus();
        } catch {
            alert("Failed to stop scraper");
        } finally {
            setStopping(false);
        }
    }

    const isRunning = stats?.status === "Running";
    const progress =
        stats && stats.totalSchemes > 0
            ? Math.round((stats.importedSchemes / stats.totalSchemes) * 100)
            : 0;

    const statusColor =
        stats?.status === "Completed"
            ? "text-green-600"
            : stats?.status === "Running"
            ? "text-yellow-600"
            : stats?.status === "Failed"
            ? "text-red-600"
            : stats?.status === "Stopped"
            ? "text-orange-600"
            : "text-slate-500";

    return (
        <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                {/* Status */}
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Status</p>
                    <p className={`mt-1 text-2xl font-bold ${statusColor}`}>
                        {stats ? stats.status : "—"}
                        {isRunning && (
                            <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
                        )}
                    </p>
                </div>

                {/* Last Run */}
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Last Run (IST)</p>
                    <p className="mt-1 text-base font-semibold">
                        {stats?.lastRun ? formatIndianTime(stats.lastRun) : "Never"}
                    </p>
                </div>

                {/* Imported */}
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Imported Schemes</p>
                    <p className="mt-1 text-2xl font-bold text-green-600">
                        {stats?.importedSchemes ?? 0}
                        {stats && stats.totalSchemes > 0 && (
                            <span className="ml-1 text-sm font-normal text-slate-400">
                                / {stats.totalSchemes}
                            </span>
                        )}
                    </p>
                </div>

                {/* Failed */}
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Failed Schemes</p>
                    <p className="mt-1 text-2xl font-bold text-red-600">
                        {stats?.failedSchemes ?? 0}
                    </p>
                </div>

                {/* Total */}
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Total Schemes</p>
                    <p className="mt-1 text-2xl font-bold">
                        {stats?.totalSchemes ?? 0}
                    </p>
                </div>

                {/* Offset */}
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Current Offset</p>
                    <p className="mt-1 text-2xl font-bold">
                        {stats?.currentOffset ?? 0}
                    </p>
                </div>
            </div>

            {/* Progress bar — visible while running */}
            {isRunning && stats.totalSchemes > 0 && (
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <div className="flex justify-between text-sm text-slate-500 mb-2">
                        <span>Progress</span>
                        <span>{progress}% ({stats.importedSchemes} / {stats.totalSchemes})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Stopped alert */}
            {stats?.status === "Stopped" && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
                    <p className="text-sm font-semibold text-orange-700 mb-1">⏹ Scraper Stopped</p>
                    <p className="text-sm text-orange-600">The scraper was stopped by an administrator.</p>
                </div>
            )}

            {/* Error box — visible when Failed */}
            {stats?.status === "Failed" && stats.error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                    <p className="text-sm font-semibold text-red-700 mb-1">❌ Scraper Error</p>
                    <p className="text-sm text-red-600 font-mono break-all">{stats.error}</p>
                </div>
            )}

            {/* Controls */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Scraper Controls</h2>
                <p className="mt-2 text-slate-500">
                    Manually control the government scheme scraper.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        onClick={handleRunScraper}
                        disabled={starting || isRunning}
                        className="rounded-lg bg-green-600 px-5 py-2.5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition"
                    >
                        {starting
                            ? "Starting..."
                            : isRunning
                            ? "Running..."
                            : "Run Scraper"}
                    </button>

                    <button
                        onClick={handleStopScraper}
                        disabled={stopping || !isRunning}
                        className="rounded-lg bg-red-600 px-5 py-2.5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition"
                    >
                        {stopping ? "Stopping..." : "Stop Scraper"}
                    </button>

                    <a
                        href="/admin/activity"
                        className="inline-flex items-center rounded-lg border px-5 py-2.5 text-slate-700 hover:bg-slate-50 transition"
                    >
                        View Logs
                    </a>
                </div>
            </div>
        </div>
    );
}