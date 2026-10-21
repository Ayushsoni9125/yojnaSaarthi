import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { getLatestScraperStats } from "@/services/scraperDashboard.service";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDB();
        const stats = await getLatestScraperStats();
        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch scraper status" },
            { status: 500 }
        );
    }
}
