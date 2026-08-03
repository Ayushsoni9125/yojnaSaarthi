import { connectDB } from "@/lib/db/mongoose";
import RunScraperButton from "@/components/admin/Scraper/RunScraperButton";

export default async function ScraperPage() {
    await connectDB();

    return (
        <div className="space-y-6 p-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Scraper Management
                </h1>

                <p className="mt-2 text-slate-500">
                    Monitor and manage the government scheme scraper.
                </p>
            </div>

            {/* Status Cards */}
            <div className="grid gap-6 lg:grid-cols-4">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Status
                    </p>

                    <p className="mt-2 text-2xl font-bold text-yellow-600">
                        Idle
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Last Run
                    </p>

                    <p className="mt-2 text-lg font-semibold">
                        Never
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Schemes Scraped
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        0
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Next Schedule
                    </p>

                    <p className="mt-2 text-lg font-semibold">
                        Manual
                    </p>
                </div>
            </div>

            {/* Scraper Controls */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">
                    Scraper Controls
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    Manually control the government scheme scraper.
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                    <RunScraperButton />
                    <button className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700">
                        Stop Scraper
                    </button>

                    <button className="rounded-lg border px-5 py-2.5 font-medium transition hover:bg-slate-100">
                        View Logs
                    </button>
                </div>
            </div>
        </div>
    );
}