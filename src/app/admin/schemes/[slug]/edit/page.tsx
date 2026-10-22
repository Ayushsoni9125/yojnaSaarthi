import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { getSchemeBySlug } from "@/services/scheme.service";
import SchemeForm from "@/components/admin/Schemes/SchemeForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function EditSchemePage({ params }: Props) {
    await connectDB();
    const { slug } = await params;

    const scheme = await getSchemeBySlug(slug);

    if (!scheme) {
        notFound();
    }

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/schemes"
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Edit Scheme
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Update details, criteria, or status (Active, Upcoming, Expired) for this scheme.
                    </p>
                </div>
            </div>

            <SchemeForm initialData={scheme as any} isEdit={true} />
        </div>
    );
}
