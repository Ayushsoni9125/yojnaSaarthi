import { NextRequest, NextResponse } from "next/server";
import { startScraper } from "@/services/scraper.service";


export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get("token");

    if (token !== process.env.CRON_SECRET) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        await startScraper();


        return NextResponse.json({
            success: true,
            message: "Scraper completed successfully.",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Scraper failed.",
            },
            { status: 500 }
        );
    }
}