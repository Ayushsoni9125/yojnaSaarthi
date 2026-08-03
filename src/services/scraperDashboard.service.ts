import ScraperJob from "@/models/ScraperJob";

export async function getLatestScraperStats() {
    const latestJob = await ScraperJob.findOne()
        .sort({ createdAt: -1 })
        .lean();

    if (!latestJob) {
        return {
            status: "Idle",
            lastRun: null,
            importedSchemes: 0,
            failedSchemes: 0,
            totalSchemes: 0,
            currentOffset: 0,
        };
    }

    return {
        status: latestJob.status,
        lastRun: latestJob.finishedAt,
        importedSchemes: latestJob.importedSchemes,
        failedSchemes: latestJob.failedSchemes,
        totalSchemes: latestJob.totalSchemes,
        currentOffset: latestJob.currentOffset,
    };
}