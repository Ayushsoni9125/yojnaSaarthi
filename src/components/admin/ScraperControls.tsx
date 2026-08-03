"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ScraperControls() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 5000);

        return () => clearInterval(interval);
    }, [router]);

    async function runScraper() {
        try {
            setLoading(true);

            const res = await fetch("/api/scraper/run", {
                method: "POST",
            });

            const data = await res.json();

            alert(data.message);

            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to run scraper");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
                Scraper Controls
            </h2>

            <p className="mt-2 text-slate-500">
                Manually control the government scheme scraper.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
                <button
                    onClick={runScraper}
                    disabled={loading}
                    className="rounded-lg bg-green-600 px-5 py-2.5 text-white disabled:opacity-50"
                >
                    {loading ? "Running..." : "Run Scraper"}
                </button>

                <button
                    className="rounded-lg bg-red-600 px-5 py-2.5 text-white"
                >
                    Stop Scraper
                </button>

                <button
                    className="rounded-lg border px-5 py-2.5"
                >
                    View Logs
                </button>
            </div>
        </div>
    );
}