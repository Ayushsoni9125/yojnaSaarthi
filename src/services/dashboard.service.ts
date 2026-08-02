import Scheme from "@/models/Scheme";
import User from "@/models/User";
import Activity from "@/models/Activity";

export async function getDashboardStats() {
  const [
    totalSchemes,
    activeSchemes,
    totalUsers,
    pendingUpdates,
    recentActivities,
  ] = await Promise.all([
    Scheme.countDocuments(),

    Scheme.countDocuments({
      status: "Active",
    }),

    User.countDocuments(),

    Scheme.countDocuments({
      status: "Upcoming",
    }),

    Activity.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  return {
    totalSchemes,
    activeSchemes,
    totalUsers,
    pendingUpdates,
    recentActivities: recentActivities.map((activity) => ({
      ...activity,
      _id: activity._id.toString(),
    })),
  };
}