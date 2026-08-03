import { NextResponse } from "next/server";
import { runScraper } from "@/services/scraper.service";

export async function POST() {
    // Fire-and-forget
    runScraper().catch((err) => {
        console.error("Scraper failed:", err);
    });

    return NextResponse.json({
        success: true,
        message: "Scraper started successfully.",
    });
}