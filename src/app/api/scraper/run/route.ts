import { NextRequest, NextResponse, after } from "next/server";
import { startScraper } from "@/services/scraper.service";
import { runMySchemeLoop } from "@/services/scrapers/myscheme";
import { runFlagshipScraperLoop } from "@/services/scrapers/flagship";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    let source = "MyScheme";
    try {
        const body = await req.json();
        if (body?.source) {
            source = body.source;
        }
    } catch {
        // No body provided, default to MyScheme
    }

    // Awaited — creates the ScraperJob in DB before responding.
    const { jobId } = await startScraper(source);

    // Use Next.js after() to keep serverless execution alive for the background scrape loop
    after(async () => {
        try {
            if (source === "NationalFlagship") {
                await runFlagshipScraperLoop(jobId);
            } else if (source === "All") {
                await runFlagshipScraperLoop(jobId);
                await runMySchemeLoop(jobId);
            } else {
                await runMySchemeLoop(jobId);
            }
        } catch (err) {
            console.error("Background scraper loop failed:", err);
        }
    });

    return NextResponse.json({
        success: true,
        message: `Scraper started successfully for ${source}.`,
        jobId,
        source,
    });
}