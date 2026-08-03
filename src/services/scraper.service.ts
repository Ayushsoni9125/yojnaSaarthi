import { scrapeAllSources } from "@/scrapers";

export async function runScraper() {
  console.log("Starting scraper...");

  const schemes = await scrapeAllSources();

  return {
    success: true,
    message: "Scraper executed successfully.",
    scraped: schemes.length,
  };
}