import Scheme from "@/models/Scheme";
import User from "@/models/User";
import Activity from "@/models/Activity";
import DeletedScheme from "@/models/DeletedScheme";
import { getLatestScraperStats } from "@/services/scraperDashboard.service";

export function getStartOfTodayIST(): Date {
  const now = new Date();
  const istFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const istDateString = istFormatter.format(now); // "YYYY-MM-DD"
  return new Date(`${istDateString}T00:00:00+05:30`);
}

export async function getDashboardStats() {
  const startOfDay = getStartOfTodayIST();

  const [
    totalSchemes,
    activeSchemes,
    expiredSchemes,
    addedToday,
    totalUsers,
    pendingUpdates,
    deletedTotal,
    deletedToday,
    recentActivities,
    addedTodayRaw,
    expiredRaw,
    deletedRaw,
    latestScraper,
  ] = await Promise.all([
    Scheme.countDocuments(),
    Scheme.countDocuments({ status: "Active" }),
    Scheme.countDocuments({ status: "Expired" }),
    Scheme.countDocuments({ createdAt: { $gte: startOfDay } }),
    User.countDocuments(),
    Scheme.countDocuments({ status: "Upcoming" }),
    DeletedScheme.countDocuments(),
    DeletedScheme.countDocuments({ deletedAt: { $gte: startOfDay } }),
    Activity.find().sort({ createdAt: -1 }).limit(6).lean(),
    Scheme.find({ createdAt: { $gte: startOfDay } })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
    Scheme.find({ status: "Expired" })
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean(),
    DeletedScheme.find()
      .sort({ deletedAt: -1 })
      .limit(20)
      .lean(),
    getLatestScraperStats(),
  ]);

  return {
    totalSchemes,
    activeSchemes,
    expiredSchemes,
    addedToday,
    totalUsers,
    pendingUpdates,
    deletedTotal,
    deletedToday,
    latestScraper,
    recentActivities: recentActivities.map((activity: any) => ({
      ...activity,
      _id: activity._id.toString(),
      createdAt: activity.createdAt?.toISOString?.() ?? new Date().toISOString(),
    })),
    addedTodayList: addedTodayRaw.map((scheme: any) => ({
      _id: scheme._id.toString(),
      title: scheme.title,
      slug: scheme.slug,
      category: scheme.category,
      ministry: scheme.ministry,
      status: scheme.status,
      sources: (scheme.sources || []).map((s: any) => ({
        name: s.name,
        url: s.url,
      })),
      createdAt: scheme.createdAt?.toISOString?.() ?? null,
      officialUrl: scheme.officialUrl,
    })),
    expiredList: expiredRaw.map((scheme: any) => ({
      _id: scheme._id.toString(),
      title: scheme.title,
      slug: scheme.slug,
      category: scheme.category,
      ministry: scheme.ministry,
      status: scheme.status,
      sources: (scheme.sources || []).map((s: any) => ({
        name: s.name,
        url: s.url,
      })),
      updatedAt: scheme.updatedAt?.toISOString?.() ?? null,
      createdAt: scheme.createdAt?.toISOString?.() ?? null,
      officialUrl: scheme.officialUrl,
    })),
    deletedList: deletedRaw.map((scheme: any) => ({
      _id: scheme._id.toString(),
      title: scheme.title,
      slug: scheme.slug,
      category: scheme.category,
      ministry: scheme.ministry,
      reason: scheme.reason,
      deletedBy: scheme.deletedBy,
      deletedAt: scheme.deletedAt?.toISOString?.() ?? null,
      originalCreatedAt: scheme.originalCreatedAt?.toISOString?.() ?? null,
      sources: (scheme.sources || []).map((s: any) => ({
        name: s.name,
        url: s.url,
      })),
      officialUrl: scheme.officialUrl,
    })),
  };
}