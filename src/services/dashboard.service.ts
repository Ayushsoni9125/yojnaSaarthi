import Scheme from "@/models/Scheme";
import User from "@/models/User";

export async function getDashboardStats() {
  const [
    totalSchemes,
    activeSchemes,
    totalUsers,
    pendingUpdates,
  ] = await Promise.all([
    Scheme.countDocuments(),

    Scheme.countDocuments({
      status: "Active",
    }),

    User.countDocuments(),

    Scheme.countDocuments({
      status: "Upcoming",
    }),
  ]);

  return {
    totalSchemes,
    activeSchemes,
    totalUsers,
    pendingUpdates,
  };
}