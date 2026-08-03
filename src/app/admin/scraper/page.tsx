import { connectDB } from "@/lib/db/mongoose";
import { getLatestScraperStats } from "@/services/scraperDashboard.service";
import ScraperControls from "@/components/admin/ScraperControls";

export default async function ScraperPage() {
    await connectDB();

    const stats = await getLatestScraperStats();

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Scraper Management
                </h1>

                <p className="mt-2 text-slate-500">
                    Monitor and manage the government scheme scraper.
                </p>
            </div>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Status</p>

                    <p
                        className={`mt-2 text-2xl font-bold ${
                            stats.status === "Completed"
                                ? "text-green-600"
                                : stats.status === "Running"
                                ? "text-yellow-600"
                                : stats.status === "Failed"
                                ? "text-red-600"
                                : "text-slate-600"
                        }`}
                    >
                        {stats.status}
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Last Run</p>

                    <p className="mt-2 text-lg font-semibold">
                        {stats.lastRun
                            ? new Date(stats.lastRun).toLocaleString()
                            : "Never"}
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Imported Schemes
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {stats.importedSchemes}
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Failed Schemes
                    </p>

                    <p className="mt-2 text-2xl font-bold text-red-600">
                        {stats.failedSchemes}
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Total Schemes
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {stats.totalSchemes}
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Current Offset
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {stats.currentOffset}
                    </p>
                </div>

                <div className="lg:col-span-2 xl:col-span-2">
                    <ScraperControls />
                </div>
            </div>
        </div>
    );
}