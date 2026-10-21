import { connectDB } from "@/lib/db/mongoose";
import { createScraperJob } from "@/services/scraperJob.service";

/**
 * Creates the ScraperJob in the DB (synchronous, awaited before this returns).
 *
 * This ensures the job record exists in the DB before the API route responds,
 * so that polling / refresh on the client sees the new job immediately.
 */
export async function startScraper(source: string = "MyScheme") {
  await connectDB();

  // Create the job synchronously — DB record exists before we return
  const job = await createScraperJob(source);
  const jobId = job._id.toString();

  return { jobId };
}