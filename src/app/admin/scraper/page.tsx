import ScraperControls from "@/components/admin/ScraperControls";

export const dynamic = "force-dynamic";

export default function ScraperPage() {
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

            <ScraperControls />
        </div>
    );
}