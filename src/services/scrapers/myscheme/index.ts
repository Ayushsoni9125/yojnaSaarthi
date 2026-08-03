import { fetchSchemes } from "./client";
import { mapMyScheme } from "./mapper";
import { upsertScheme } from "@/services/scheme.service";

export async function scrapeMyScheme() {
  console.log("✅ NEW MyScheme scraper is running");

  const response = await fetchSchemes({
    from: 0,
    size: 10,
  });

  const items = response.data.hits.items;

  const schemes = items.map(mapMyScheme);

  const savedSchemes = [];

  for (const scheme of schemes) {
    const saved = await upsertScheme(scheme);
    savedSchemes.push(saved);
  }

  console.log(`✅ Saved ${savedSchemes.length} schemes`);

  return savedSchemes;
}