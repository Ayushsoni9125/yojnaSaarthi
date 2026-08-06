import Activity from "@/models/Activity";
import { escapeRegex } from "@/utils/escapeRegex";

type LogActivityParams = {
  action: "CREATE" | "UPDATE" | "DELETE";
  resource: string;
  resourceId: string;
  description: string;
  performedBy?: string;
};

type GetActivitiesParams = {
  page?: number;
  limit?: number;
  search?: string;
  action?: "CREATE" | "UPDATE" | "DELETE";
};

export async function logActivity({
  action,
  resource,
  resourceId,
  description,
  performedBy = "Admin",
}: LogActivityParams) {
  return await Activity.create({
    action,
    resource,
    resourceId,
    description,
    performedBy,
  });
}

export async function getActivities({
  page = 1,
  limit = 10,
  search,
  action,
}: GetActivitiesParams) {
  const skip = (page - 1) * limit;

  const filter: any = {};

  if (action) {
    filter.action = action;
  }

  if (search) {
    const escaped = escapeRegex(search);
    filter.$or = [
      {
        description: {
          $regex: escaped,
          $options: "i",
        },
      },
      {
        performedBy: {
          $regex: escaped,
          $options: "i",
        },
      },
    ];
  }

  const [activities, total] = await Promise.all([
    Activity.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Activity.countDocuments(filter),
  ]);

  return {
    activities,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}