import DeletedScheme from "@/models/DeletedScheme";

export async function archiveDeletedScheme(
  scheme: any,
  reason = "Manual deletion by admin",
  deletedBy = "Admin"
) {
  if (!scheme) return null;

  try {
    return await DeletedScheme.create({
      title: scheme.title || "Untitled Scheme",
      slug: scheme.slug || `deleted-${Date.now()}`,
      category: scheme.category,
      ministry: scheme.ministry,
      shortDescription: scheme.shortDescription || "",
      officialUrl: scheme.officialUrl || "",
      sources: scheme.sources || [],
      reason,
      deletedBy,
      deletedAt: new Date(),
      originalCreatedAt: scheme.createdAt,
    });
  } catch (err) {
    console.error("Failed to archive deleted scheme:", err);
    return null;
  }
}

export async function archiveBulkDeletedSchemes(
  schemes: any[],
  reason = "Automated portal reconciliation",
  deletedBy = "Government Scraper"
) {
  if (!schemes || !schemes.length) return [];

  try {
    const docs = schemes.map((scheme) => ({
      title: scheme.title || "Untitled Scheme",
      slug: scheme.slug || `deleted-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: scheme.category,
      ministry: scheme.ministry,
      shortDescription: scheme.shortDescription || "",
      officialUrl: scheme.officialUrl || "",
      sources: scheme.sources || [],
      reason,
      deletedBy,
      deletedAt: new Date(),
      originalCreatedAt: scheme.createdAt,
    }));

    return await DeletedScheme.insertMany(docs);
  } catch (err) {
    console.error("Failed to archive bulk deleted schemes:", err);
    return [];
  }
}

const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

export async function cleanupExpiredDeletedSchemes() {
  try {
    const cutoff = new Date(Date.now() - TEN_DAYS_MS);
    const result = await DeletedScheme.deleteMany({ deletedAt: { $lt: cutoff } });
    if (result.deletedCount > 0) {
      console.log(`[DeletedScheme] Purged ${result.deletedCount} archived schemes older than 10 days.`);
    }
    return result;
  } catch (err) {
    console.error("Failed to cleanup deleted schemes older than 10 days:", err);
  }
}

export async function getRecentDeletedSchemes(limit = 20) {
  const cutoff = new Date(Date.now() - TEN_DAYS_MS);
  return await DeletedScheme.find({ deletedAt: { $gte: cutoff } })
    .sort({ deletedAt: -1 })
    .limit(limit)
    .lean();
}
