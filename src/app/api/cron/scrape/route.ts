import { NextRequest, NextResponse, after } from "next/server";
import { startScraper } from "@/services/scraper.service";
import { runMySchemeLoop } from "@/services/scrapers/myscheme";
import { runFlagshipScraperLoop } from "@/services/scrapers/flagship";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get("token");
    const cronSecret = process.env.CRON_SECRET;

    // Check authorization: Support token query param, Bearer auth header, or Vercel cron
    const authHeader = request.headers.get("authorization");
    const isVercelCron = request.headers.get("x-vercel-cron") === "1";

    const isAuthorized =
        isVercelCron ||
        Boolean(cronSecret && token === cronSecret) ||
        Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`);

    if (!isAuthorized) {
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized. Ensure CRON_SECRET is configured in Vercel environment variables and matches the token parameter.",
            },
            { status: 401 }
        );
    }

    const source = request.nextUrl.searchParams.get("source") || "All";

    try {
        const { jobId } = await startScraper(source);

        // Keep background scrape alive asynchronously without timing out the HTTP connection
        after(async () => {
            try {
                if (source === "NationalFlagship") {
                    await runFlagshipScraperLoop(jobId);
                } else if (source === "MyScheme") {
                    await runMySchemeLoop(jobId);
                } else {
                    // All: Flagship portals + comprehensive MyScheme sync
                    await runFlagshipScraperLoop(jobId);
                    await runMySchemeLoop(jobId);
                }
            } catch (err) {
                console.error("[Cron Scraper] Background execution failed:", err);
            }
        });

        return NextResponse.json({
            success: true,
            message: `Daily scraper initiated successfully for source: ${source}.`,
            jobId,
            source,
        });
    } catch (error: any) {
        console.error("[Cron Scraper] Failed to start:", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to initiate scraper.",
            },
            { status: 500 }
        );
    }
}