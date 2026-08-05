import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { getSchemeBySlug } from "@/services/schemeQuery.service";
import Header from "@/components/layout/Header";
import SchemeDetailsClient from "@/components/schemes/SchemeDetailsClient";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SchemeDetailsPage({ params }: Props) {
  await connectDB();

  const { slug } = await params;

  const scheme = await getSchemeBySlug(slug);

  if (!scheme) {
    notFound();
  }

  const serializedScheme = {
    _id: scheme._id.toString(),
    title: scheme.title,
    slug: scheme.slug,
    shortDescription: scheme.shortDescription,
    description: scheme.description,
    benefits: scheme.benefits || [],
    documents: scheme.documents || [],
    tags: scheme.tags || [],
    states: scheme.states || [],
    category: scheme.category,
    ministry: scheme.ministry,
    officialUrl: scheme.officialUrl,
    status: scheme.status,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <SchemeDetailsClient scheme={serializedScheme} />
    </div>
  );
}