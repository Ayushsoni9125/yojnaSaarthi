import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
interface Props {
    schemes: any[];
}

export default function SchemeTable({
    schemes,
}: Props) {
    return (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <table className="min-w-full">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                            Title
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold">
                            Category
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold">
                            Status
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold">
                            State
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {schemes.map((scheme) => (
                        <tr
                            key={scheme._id}
                            className="border-t hover:bg-slate-50"
                        >
                            <td className="px-6 py-4 font-medium">
                                {scheme.title}
                            </td>

                            <td className="px-6 py-4">
                                {scheme.category}
                            </td>

                            <td className="px-6 py-4">
                                {scheme.status}
                            </td>

                            <td className="px-6 py-4">
                                {scheme.state}
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    <button className="rounded bg-sky-500 p-2 text-white hover:bg-sky-600">
                                        <Eye size={16} />
                                    </button>

                                    <Link
                                        href={`/admin/schemes/${scheme.slug}/edit`}
                                        className="rounded bg-green-600 p-2 text-white hover:bg-green-700 transition"
                                    >
                                        <Pencil size={16} />
                                    </Link>

                                    <button className="rounded bg-red-600 p-2 text-white hover:bg-red-700">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}