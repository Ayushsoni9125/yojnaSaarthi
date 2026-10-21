import { NextResponse, after } from "next/server";
import { startScraper } from "@/services/scraper.service";
import { runMySchemeLoop } from "@/services/scrapers/myscheme";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST() {
    // Awaited — creates the ScraperJob in DB before responding.
    const { jobId } = await startScraper();

    // Use Next.js after() to keep serverless execution alive for the background scrape loop
    after(async () => {
        try {
            await runMySchemeLoop(jobId);
        } catch (err) {
            console.error("Background scraper loop failed:", err);
        }
    });

    return NextResponse.json({
        success: true,
        message: "Scraper started successfully.",
        jobId,
    });
}