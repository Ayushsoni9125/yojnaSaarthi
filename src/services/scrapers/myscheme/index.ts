import { fetchSchemes } from "./client";
import { mapMyScheme } from "./mapper";
import { bulkUpsertSchemes } from "@/services/scheme.service";
import { updateScraperJob } from "@/services/scraperJob.service";
import { connectDB } from "@/lib/db/mongoose";

const PAGE_SIZE = 100;
const CONCURRENCY = 4;

/**
 * Runs the MyScheme scrape loop for an ALREADY-CREATED job.
 * The job must be created before calling this so the DB record
 * exists before the API route responds.
 */
export async function runMySchemeLoop(jobId: string) {
  let from = 0;
  let total = 0;
  let imported = 0;

  console.log(`[Scraper] Starting MyScheme scrape for job ${jobId}`);

  try {
    await connectDB();

    // 1. Fetch first page to get total count
    const firstPageRes = await fetchSchemes({ from: 0, size: PAGE_SIZE });
    const firstHits = (firstPageRes as any)?.data?.hits || (firstPageRes as any)?.hits;
    const firstItems = firstHits?.items ?? [];
    total = firstHits?.page?.total ?? firstItems.length;

    if (!firstItems.length) {
      throw new Error(
        "No schemes returned from MyScheme API. Status: " +
          (firstPageRes?.status ?? "unknown")
      );
    }

    // Upsert first page
    const firstSchemes = firstItems.map(mapMyScheme);
    await bulkUpsertSchemes(firstSchemes);
    imported += firstSchemes.length;
    from += PAGE_SIZE;

    await updateScraperJob(jobId, {
      importedSchemes: imported,
      totalSchemes: total,
      currentOffset: from,
    });

    console.log(`[Scraper] First page imported: ${imported}/${total}`);

    // 2. Fetch remaining pages in concurrent batches of CONCURRENCY
    while (from < total) {
      const offsets: number[] = [];
      for (let i = 0; i < CONCURRENCY && from + i * PAGE_SIZE < total; i++) {
        offsets.push(from + i * PAGE_SIZE);
      }

      const results = await Promise.all(
        offsets.map((offset) => fetchSchemes({ from: offset, size: PAGE_SIZE }))
      );

      const batchSchemes: any[] = [];
      for (const res of results) {
        const hits = (res as any)?.data?.hits || (res as any)?.hits;
        const items = hits?.items ?? [];
        for (const item of items) {
          batchSchemes.push(mapMyScheme(item));
        }
      }

      if (batchSchemes.length > 0) {
        await bulkUpsertSchemes(batchSchemes);
        imported += batchSchemes.length;
      }

      from += offsets.length * PAGE_SIZE;

      await updateScraperJob(jobId, {
        importedSchemes: imported,
        totalSchemes: total,
        currentOffset: from,
      });

      console.log(`[Scraper] Progress: imported ${imported}/${total}`);
    }

    await updateScraperJob(jobId, {
      status: "Completed",
      finishedAt: new Date(),
    });

    console.log(`[Scraper] Completed job ${jobId}: ${imported}/${total} schemes`);
  } catch (err: any) {
    console.error(`[Scraper] Job ${jobId} failed:`, err);
    await updateScraperJob(jobId, {
      status: "Failed",
      finishedAt: new Date(),
      error: err?.message ?? "Unknown error",
    });
    throw err;
  }
}