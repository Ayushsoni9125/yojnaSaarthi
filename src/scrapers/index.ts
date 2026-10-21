import { runMySchemeLoop } from "@/services/scrapers/myscheme";
import { runFlagshipScraperLoop } from "@/services/scrapers/flagship";
import { createScraperJob } from "@/services/scraperJob.service";

export async function scrapeAllSources() {
  const job = await createScraperJob("All");
  const jobId = job._id.toString();

  await runFlagshipScraperLoop(jobId);
  await runMySchemeLoop(jobId);

  return { success: true, jobId };
}