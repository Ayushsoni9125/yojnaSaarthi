import { connectDB } from "@/lib/db/mongoose";
import { getActivities } from "@/services/activity.service";
import ActivityToolbar from "@/components/admin/Activity/ActivityToolbar";
import Pagination from "@/components/admin/Schemes/Pagination";
type Props = {
    searchParams: Promise<{
        page?: string;
        search?: string;
        action?: "CREATE" | "UPDATE" | "DELETE";
    }>;
};

export default async function ActivityPage({
    searchParams,
}: Props) {
    await connectDB();
    const params = await searchParams;

    const { activities, pagination } = await getActivities({
        page: Number(params.page ?? 1),
        limit: 10,
        search: params.search,
        action: params.action,
    });

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Activity Logs
                </h1>

                <p className="mt-2 text-slate-500">
                    View and monitor all administrative actions across the platform.
                </p>
            </div>
            <ActivityToolbar />

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
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
                        {activities.length > 0 ? (
                            activities.map((activity: any) => (
                                <tr
                                    key={activity._id.toString()}
                                    className="border-t"
                                >
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${activity.action === "CREATE"
                                                ? "bg-green-100 text-green-700"
                                                : activity.action === "UPDATE"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {activity.action}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        {activity.description}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
                                                {activity.performedBy?.charAt(0)}
                                            </div>

                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {activity.performedBy}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    Administrator
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {new Date(activity.createdAt).toLocaleDateString()}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {new Date(activity.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-6 py-16 text-center"
                                >
                                    <h3 className="text-lg font-semibold text-slate-700">
                                        No activities found
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Try changing your search or filter.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col gap-3 items-start rounded-lg border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                    Showing{" "}
                    <span className="font-semibold">
                        {activities.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold">
                        {pagination.total}
                    </span>{" "}
                    activities
                </p>
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    basePath="/admin/activity"
                />
            </div>
        </div>
    );
}