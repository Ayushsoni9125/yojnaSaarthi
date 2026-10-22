"use client";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { apiFetch, safeJsonParse } from "@/lib/apiClient";
interface Props {
    schemes: any[];
}

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import DeleteSchemeModal from "./DeleteSchemeModal";
export default function SchemeTable({
    schemes,
}: Props) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectedScheme, setSelectedScheme] =
        useState<any>(null);
    const handleDelete = async () => {
        if (!selectedScheme) return;

        try {
            setLoading(true);

            const res = await apiFetch(
                `/api/schemes/${selectedScheme.slug}`,
                {
                    method: "DELETE",
                }
            );

            const result = await safeJsonParse(res);

            if (!res.ok || !result.success) {
                if (res.status !== 429) {
                    toast.error(result.message || "Delete failed");
                }
                return;
            }

            toast.success("Scheme deleted successfully!");

            setOpen(false);

            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="overflow-hidden bg-white shadow-sm">
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
                    {schemes.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="py-12 text-center text-slate-500 text-sm">
                                No schemes found matching the selected filter or criteria.
                            </td>
                        </tr>
                    ) : (
                        schemes.map((scheme) => (
                            <tr
                                key={scheme._id}
                                className="border-t hover:bg-slate-50 transition-colors"
                            >
                                <td className="px-6 py-4 font-medium text-slate-900 max-w-sm">
                                    <span className="line-clamp-2">{scheme.title}</span>
                                    <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                                        slug: {scheme.slug}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-slate-600">
                                    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                                        {scheme.category}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                            scheme.status === "Active"
                                                ? "bg-emerald-100 text-emerald-800"
                                                : scheme.status === "Expired"
                                                ? "bg-amber-100 text-amber-800"
                                                : "bg-blue-100 text-blue-800"
                                        }`}
                                    >
                                        {scheme.status}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    {scheme.state || scheme.states?.[0] || "All India"}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/schemes/${scheme.slug}`}
                                            target="_blank"
                                            title="View live scheme"
                                            className="rounded bg-sky-500 p-2 text-white hover:bg-sky-600 transition"
                                        >
                                            <Eye size={16} />
                                        </Link>

                                        <Link
                                            href={`/admin/schemes/${scheme.slug}/edit`}
                                            title="Edit scheme"
                                            className="rounded bg-emerald-600 p-2 text-white hover:bg-emerald-700 transition"
                                        >
                                            <Pencil size={16} />
                                        </Link>

                                        <button
                                            onClick={() => {
                                                setSelectedScheme(scheme);
                                                setOpen(true);
                                            }}
                                            title="Delete scheme"
                                            className="rounded bg-rose-600 p-2 text-white hover:bg-rose-700 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <DeleteSchemeModal
                open={open}
                loading={loading}
                schemeTitle={selectedScheme?.title}
                onClose={() => setOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}