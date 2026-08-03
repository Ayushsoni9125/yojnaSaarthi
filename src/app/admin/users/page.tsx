import { connectDB } from "@/lib/db/mongoose";
import { getUsers } from "@/services/user.service";
import UserToolbar from "@/components/admin/Users/UserToolbar";
import Pagination from "@/components/admin/Schemes/Pagination";
type Props = {
    searchParams: Promise<{
        page?: string;
        search?: string;
        role?: "user" | "admin";
    }>;
};

export default async function UsersPage({
    searchParams,
}: Props) {
    await connectDB();

    const params = await searchParams;

    const { users, pagination } = await getUsers({
        page: Number(params.page ?? 1),
        limit: 10,
        search: params.search,
        role: params.role,
    });

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Users
                </h1>

                <p className="mt-2 text-slate-500">
                    Manage all registered users from one place.
                </p>
            </div>
            <UserToolbar />
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-left">Name</th>
                            <th className="px-6 py-4 text-left">Email</th>
                            <th className="px-6 py-4 text-left">Provider</th>
                            <th className="px-6 py-4 text-left">Role</th>
                            <th className="px-6 py-4 text-left">Joined</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length > 0 ? (
                            users.map((user: any) => (
                                <tr
                                    key={user._id.toString()}
                                    className="border-t"
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {user.name}
                                    </td>

                                    <td className="px-6 py-4">
                                        {user.email}
                                    </td>

                                    <td className="px-6 py-4 capitalize">
                                        {user.provider}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${user.role === "admin"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-slate-100 text-slate-700"
                                                }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-16 text-center"
                                >
                                    <h3 className="text-lg font-semibold text-slate-700">
                                        No users found
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-500">
                                        There are no registered users yet.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex items-center justify-between rounded-lg border bg-white p-4">
                    <p className="text-sm text-slate-600">
                        Showing{" "}
                        <span className="font-semibold">
                            {users.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold">
                            {pagination.total}
                        </span>{" "}
                        users
                    </p>

                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        basePath="/admin/users"
                    />
                </div>
            </div>
        </div>
    );
}