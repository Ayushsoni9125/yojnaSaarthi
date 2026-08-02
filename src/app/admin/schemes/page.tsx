import { connectDB } from "@/lib/db/mongoose";
import { getSchemes } from "@/services/scheme.service";
import SchemeTable from "@/components/admin/Schemes/SchemeTable";
import SchemeToolbar from "@/components/admin/Schemes/SchemeToolbar";

export default async function SchemesPage() {
    await connectDB();

    const { schemes } = await getSchemes({
        page: 1,
        limit: 10,
        sort: "latest",
    });

    return (
        <div className="space-y-6 p-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Schemes
                </h1>

                <p className="mt-2 text-slate-500">
                    Manage all government schemes from one place.
                </p>
            </div>

            <SchemeToolbar />

            <SchemeTable schemes={schemes} />
        </div>
    );
}