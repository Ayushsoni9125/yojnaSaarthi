import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { stopScraperJobs } from "@/services/scraperJob.service";

export const dynamic = "force-dynamic";

export async function POST() {
    try {
        await connectDB();
        await stopScraperJobs();

        return NextResponse.json({
            success: true,
            message: "Scraper stopped successfully.",
        });
    } catch (error: any) {
        console.error("Error stopping scraper:", error);
        return NextResponse.json(
            { success: false, message: error?.message || "Failed to stop scraper." },
            { status: 500 }
        );
    }
}
