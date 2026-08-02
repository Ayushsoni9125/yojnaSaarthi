import SchemeForm from "@/components/admin/Schemes/SchemeForm";

export default function NewSchemePage() {
    return (
        <div className="space-y-6 p-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Add New Scheme
                </h1>

                <p className="mt-2 text-slate-500">
                    Create a new government scheme.
                </p>
            </div>

            <SchemeForm />
        </div>
    );
}