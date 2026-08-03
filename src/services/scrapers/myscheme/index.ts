import { fetchSchemes } from "./client";
import { mapMyScheme } from "./mapper";
import { bulkUpsertSchemes } from "@/services/scheme.service";
import {
    createScraperJob,
    updateScraperJob,
    getLatestScraperJob,
} from "@/services/scraperJob.service";
import { retry } from "@/utils/retry";

const PAGE_SIZE = 100;

export async function scrapeMyScheme() {
    console.log("🚀 Starting MyScheme scraper...");

    const previousJob = await getLatestScraperJob("MyScheme");

    const job = await createScraperJob("MyScheme");

    try {
        let from =
            previousJob?.status === "Failed"
                ? previousJob.currentOffset
                : 0;

        let total = 0;
        let imported = 0;

        const savedSchemes = [];

        while (true) {
            const response = await retry(() =>
                fetchSchemes({
                    from,
                    size: PAGE_SIZE,
                })
            );

            const items = response.data.hits.items;
            const page = response.data.hits.page;

            if (total === 0) {
                total = page.total;
                console.log(`📦 Total schemes to import: ${total}`);
            }

            if (!items.length) {
                break;
            }

            const schemes = items.map(mapMyScheme);

            try {
                await bulkUpsertSchemes(schemes);

                imported += schemes.length;

                savedSchemes.push(...schemes);
            } catch (error) {
                console.error(
                    `❌ Bulk import failed at offset ${from}:`,
                    error
                );

                await updateScraperJob(job._id.toString(), {
                    failedSchemes: schemes.length,
                });
            }

            console.log(`✅ Imported ${imported}/${total}`);

            await updateScraperJob(job._id.toString(), {
                importedSchemes: imported,
                totalSchemes: total,
                currentOffset: from + PAGE_SIZE,
            });

            from += PAGE_SIZE;

            if (from >= total) {
                break;
            }
        }

        console.log("🎉 MyScheme import completed!");
        console.log(`✅ Total imported: ${imported}`);

        await updateScraperJob(job._id.toString(), {
            status: "Completed",
            finishedAt: new Date(),
            currentOffset: 0,
        });

        return savedSchemes;
    } catch (error) {
        console.error("❌ Scraper failed:", error);

        await updateScraperJob(job._id.toString(), {
            status: "Failed",
            finishedAt: new Date(),
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown Error",
        });

        throw error;
    }
}