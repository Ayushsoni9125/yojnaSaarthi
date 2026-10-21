import { fetchSchemes } from "./client";
import { mapMyScheme } from "./mapper";
import { bulkUpsertSchemes } from "@/services/scheme.service";
import { updateScraperJob } from "@/services/scraperJob.service";
import { connectDB } from "@/lib/db/mongoose";
import ScraperJob from "@/models/ScraperJob";
import Scheme from "@/models/Scheme";
import Bookmark from "@/models/Bookmark";

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
  const scrapedSlugs = new Set<string>();

  console.log(`[Scraper] Starting MyScheme scrape for job ${jobId}`);

  try {
    await connectDB();

    // 1. Fetch first page to get live total count from government API
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

    // Check if stopped before first write
    const initialCheck = await ScraperJob.findById(jobId).select("status").lean();
    if (initialCheck?.status === "Stopped") {
      console.log(`[Scraper] Job ${jobId} was stopped before processing.`);
      return;
    }

    // Upsert first page & track slugs
    const firstSchemes = firstItems.map(mapMyScheme);
    for (const s of firstSchemes) {
      if (s.slug) scrapedSlugs.add(s.slug);
    }
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
      // Check if job was stopped by admin
      const statusCheck = await ScraperJob.findById(jobId).select("status").lean();
      if (statusCheck?.status === "Stopped") {
        console.log(`[Scraper] Scraper job ${jobId} was stopped by user.`);
        return;
      }

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
          const mapped = mapMyScheme(item);
          batchSchemes.push(mapped);
          if (mapped.slug) scrapedSlugs.add(mapped.slug);
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

    const finalJob = await ScraperJob.findById(jobId).select("status").lean();
    if (finalJob?.status === "Stopped") {
      return;
    }

    // 3. Reconcile: delete schemes that were removed from the official portal
    if (scrapedSlugs.size > 0 && from >= total) {
      console.log(`[Scraper] Reconciling: comparing database against ${scrapedSlugs.size} active schemes...`);
      const obsoleteSchemes = await Scheme.find(
        {
          "sources.name": "MyScheme",
          slug: { $nin: Array.from(scrapedSlugs) },
        },
        "_id slug"
      ).lean();

      if (obsoleteSchemes.length > 0) {
        const obsoleteIds = obsoleteSchemes.map((s: any) => s._id);
        await Promise.all([
          Scheme.deleteMany({ _id: { $in: obsoleteIds } }),
          Bookmark.deleteMany({ schemeId: { $in: obsoleteIds } }),
        ]);
        console.log(`[Scraper] Removed ${obsoleteIds.length} obsolete schemes no longer present on MyScheme.`);
      }
    }

    await updateScraperJob(jobId, {
      status: "Completed",
      finishedAt: new Date(),
    });

    console.log(`[Scraper] Completed job ${jobId}: ${imported}/${total} schemes`);
  } catch (err: any) {
    console.error(`[Scraper] Job ${jobId} failed:`, err);
    const finalJob = await ScraperJob.findById(jobId).select("status").lean();
    if (finalJob?.status === "Stopped") {
      return;
    }
    await updateScraperJob(jobId, {
      status: "Failed",
      finishedAt: new Date(),
      error: err?.message ?? "Unknown error",
    });
    throw err;
  }
}