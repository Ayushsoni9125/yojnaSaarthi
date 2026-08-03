import axios from "axios";
import { ScrapedScheme } from "@/types/scraper";

export async function scrapeMyScheme(): Promise<ScrapedScheme[]> {
    console.log("Scraping MyScheme...");

    try {
        const response = await axios.get("https://www.myscheme.gov.in");

        console.log(
            "MyScheme homepage fetched:",
            response.status
        );

        return [];
    } catch (error) {
        console.error("MyScheme scraper failed:", error);

        return [];
    }
}