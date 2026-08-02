import { connectDB } from "@/lib/db/mongoose";
import Activity from "@/models/Activity";

export default async function ActivityPage() {
  await connectDB();

  const activities = await Activity.find()
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">
          Recent Activity
        </h1>

        <p className="mt-2 text-slate-500">
          Track every admin action performed in the system.
        </p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-4 text-left">
                Action
              </th>

              <th className="px-6 py-4 text-left">
                Description
              </th>

              <th className="px-6 py-4 text-left">
                Performed By
              </th>

              <th className="px-6 py-4 text-left">
                Time
              </th>
            </tr>
          </thead>

          <tbody>
            {activities.map((activity: any) => (
              <tr
                key={activity._id.toString()}
                className="border-t"
              >
                <td className="px-6 py-4 font-semibold">
                  {activity.action}
                </td>

                <td className="px-6 py-4">
                  {activity.description}
                </td>

                <td className="px-6 py-4">
                  {activity.performedBy}
                </td>

                <td className="px-6 py-4">
                  {new Date(
                    activity.createdAt
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}