import { scrapeAllSources } from "@/scrapers";
import { connectDB } from "@/lib/db/mongoose";

export async function runScraper() {
  await connectDB();
  const schemes = await scrapeAllSources();

  return {
    success: true,
    message: "Scraper executed successfully.",
    scraped: schemes.length,
  };
}