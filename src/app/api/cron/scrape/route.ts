import { NextResponse } from "next/server";
import { runScraper } from "@/services/scraper.service";

export async function GET() {
    try {
        await runScraper();

        return NextResponse.json({
            success: true,
            message: "Cron scraper completed successfully.",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Cron scraper failed.",
            },
            { status: 500 }
        );
    }
}