import { fetchSchemes } from "./client";
import { mapMyScheme } from "./mapper";
import { bulkUpsertSchemes } from "@/services/scheme.service";
import { updateScraperJob } from "@/services/scraperJob.service";

const PAGE_SIZE = 100;

/**
 * Runs the MyScheme scrape loop for an ALREADY-CREATED job.
 * The job must be created before calling this so the DB record
 * exists before the API route responds.
 */
export async function runMySchemeLoop(jobId: string) {
  let from = 0;
  let total = 0;
  let imported = 0;

  const savedSchemes: any[] = [];

  console.log(`[Scraper] Starting MyScheme loop for job ${jobId}`);

  try {
    while (true) {
      const response = await fetchSchemes({
        from,
        size: PAGE_SIZE,
      });

      const items = response.hits.items;
      const page = response.hits.page;

      if (total === 0) {
        total = page.total;
      }

      if (!items.length) break;

      const schemes = items.map(mapMyScheme);

      await bulkUpsertSchemes(schemes);

      imported += schemes.length;

      savedSchemes.push(...schemes);

      await updateScraperJob(jobId, {
        importedSchemes: imported,
        totalSchemes: total,
        currentOffset: from,
      });

      console.log(`[Scraper] Page ${from / PAGE_SIZE + 1}: imported ${imported}/${total}`);

      from += PAGE_SIZE;

      if (from >= total) break;
    }

    await updateScraperJob(jobId, {
      status: "Completed",
      finishedAt: new Date(),
    });
  } catch (err: any) {
    await updateScraperJob(jobId, {
      status: "Failed",
      finishedAt: new Date(),
      error: err?.message ?? "Unknown error",
    });
    throw err;
  }

  return savedSchemes;
}