import { notFound } from "next/navigation";

import { connectDB } from "@/lib/db/mongoose";
import { getSchemeBySlug } from "@/services/scheme.service";

import SchemeForm from "@/components/admin/Schemes/SchemeForm";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditSchemePage({
  params,
}: Props) {
  await connectDB();

  const { slug } = await params;

  const scheme = await getSchemeBySlug(slug);

  if (!scheme) {
    notFound();
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">
          Edit Scheme
        </h1>

        <p className="mt-2 text-slate-500">
          Update scheme information.
        </p>
      </div>

      <SchemeForm
        initialData={scheme}
        isEdit
      />
    </div>
  );
}