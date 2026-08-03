import { NextResponse } from "next/server";
import { runScraper } from "@/services/scraper.service";

export async function POST() {
    try {
        const result = await runScraper();

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to run scraper.",
            },
            {
                status: 500,
            }
        );
    }
}