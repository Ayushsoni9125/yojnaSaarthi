import ScraperJob from "@/models/ScraperJob";

export async function getLatestScraperStats() {
    const latestJob = await ScraperJob.findOne()
        .sort({ createdAt: -1 })
        .lean();

    if (!latestJob) {
        return {
            status: "Idle",
            source: "MyScheme",
            lastRun: null,
            importedSchemes: 0,
            failedSchemes: 0,
            totalSchemes: 0,
            currentOffset: 0,
            error: null,
        };
    }

    const lastRunDate = latestJob.finishedAt ?? latestJob.startedAt ?? (latestJob as any).createdAt;

    return {
        status: latestJob.status,
        source: latestJob.source || "MyScheme",
        lastRun: lastRunDate ? new Date(lastRunDate).toISOString() : null,
        importedSchemes: latestJob.importedSchemes ?? 0,
        failedSchemes: latestJob.failedSchemes ?? 0,
        totalSchemes: latestJob.totalSchemes ?? 0,
        currentOffset: latestJob.currentOffset ?? 0,
        error: latestJob.error ?? null,
    };
}