import { fetchSchemes } from "./client";
import { mapMyScheme } from "./mapper";
import { bulkUpsertSchemes } from "@/services/scheme.service";
import {
  createScraperJob,
  updateScraperJob,
} from "@/services/scraperJob.service";

const PAGE_SIZE = 100;

export async function scrapeMyScheme() {
  const job = await createScraperJob("MyScheme");

  let from = 0;
  let total = 0;
  let imported = 0;

  const savedSchemes = [];

  try {
    while (true) {
      const response = await fetchSchemes({
        from,
        size: PAGE_SIZE,
      });

      const items = response.data.hits.items;
      const page = response.data.hits.page;

      if (total === 0) {
        total = page.total;
      }

      if (!items.length) break;

      const schemes = items.map(mapMyScheme);

      await bulkUpsertSchemes(schemes);

      imported += schemes.length;

      savedSchemes.push(...schemes);

      await updateScraperJob(job._id.toString(), {
        importedSchemes: imported,
        totalSchemes: total,
        currentOffset: from,
      });

      from += PAGE_SIZE;

      if (from >= total) break;
    }

    await updateScraperJob(job._id.toString(), {
      status: "Completed",
      finishedAt: new Date(),
    });
  } catch (err: any) {
    await updateScraperJob(job._id.toString(), {
      status: "Failed",
      finishedAt: new Date(),
      error: err?.message ?? "Unknown error",
    });
    throw err;
  }

  return savedSchemes;
}