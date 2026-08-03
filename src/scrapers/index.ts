import { scrapeMyScheme } from "@/services/scrapers/myscheme";

export async function scrapeAllSources() {
  const myScheme = await scrapeMyScheme();

  return myScheme;
}