import Activity from "@/models/Activity";

type LogActivityParams = {
  action: "CREATE" | "UPDATE" | "DELETE";
  resource: string;
  resourceId: string;
  description: string;
  performedBy?: string;
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