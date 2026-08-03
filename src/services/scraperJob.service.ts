import ScraperJob from "@/models/ScraperJob";

export async function createScraperJob(source: string) {
    return await ScraperJob.create({
        source,
        status: "Running",
    });
}

export async function updateScraperJob(
    id: string,
    data: Record<string, any>
) {
    const job = await ScraperJob.findById(id);

    if (!job) return null;

    if (data.failedSchemes) {
        data.failedSchemes =
            (job.failedSchemes || 0) + data.failedSchemes;
    }

    return await ScraperJob.findByIdAndUpdate(
        id,
        data,
        {
            returnDocument: "after",
        }
    );
}

export async function getLatestScraperJob(source: string) {
    return await ScraperJob.findOne({
        source,
    }).sort({
        createdAt: -1,
    });
}