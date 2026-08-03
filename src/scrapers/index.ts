import { scrapeMyScheme } from "./myscheme.scraper";

export async function scrapeAllSources() {
  const myScheme = await scrapeMyScheme();

  return [
    ...myScheme,
  ];
}