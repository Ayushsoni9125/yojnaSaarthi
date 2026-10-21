import { NextResponse } from "next/server";
import { startScraper } from "@/services/scraper.service";

export async function POST() {
    // Awaited — creates the ScraperJob in DB before responding.
    // The loop runs in background after we return.
    const { jobId } = await startScraper();

    return NextResponse.json({
        success: true,
        message: "Scraper started successfully.",
        jobId,
    });
}