import axios from "axios";
import { ScrapedScheme } from "@/types/scraper";

export async function scrapeMyScheme(): Promise<ScrapedScheme[]> {
    try {
        await axios.get("https://www.myscheme.gov.in");

        return [];
    } catch (error) {
        console.error("MyScheme scraper failed:", error);

        return [];
    }
}