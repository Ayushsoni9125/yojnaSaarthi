import { runMySchemeLoop } from "@/services/scrapers/myscheme";
import { createScraperJob } from "@/services/scraperJob.service";

export async function scrapeAllSources() {
  const job = await createScraperJob("MyScheme");
  const schemes = await runMySchemeLoop(job._id.toString());
  return schemes;
}