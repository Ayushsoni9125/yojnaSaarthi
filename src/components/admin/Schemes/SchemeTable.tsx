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

                                    <button
                                        onClick={() => {
                                            setSelectedScheme(scheme);
                                            setOpen(true);
                                        }}
                                        className="rounded bg-red-600 p-2 text-white hover:bg-red-700"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
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