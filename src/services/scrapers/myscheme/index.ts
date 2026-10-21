import { fetchSchemes } from "./client";
import { mapMyScheme } from "./mapper";
import { bulkUpsertSchemes } from "@/services/scheme.service";
import { updateScraperJob } from "@/services/scraperJob.service";

import { connectDB } from "@/lib/db/mongoose";

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
    await connectDB();

    while (true) {
      const response = await fetchSchemes({
        from,
        size: PAGE_SIZE,
      });

      const hits = (response as any)?.data?.hits || (response as any)?.hits;
      const items = hits?.items ?? [];
      const page = hits?.page;

      if (total === 0 && page?.total) {
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

      console.log(`[Scraper] Page ${Math.floor(from / PAGE_SIZE) + 1}: imported ${imported}/${total}`);

      from += PAGE_SIZE;

      if (total > 0 && from >= total) break;
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