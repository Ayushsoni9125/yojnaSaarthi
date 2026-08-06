import { Suspense } from "react";
import { connectDB } from "@/lib/db/mongoose";
import Scheme from "@/models/Scheme";
import SchemesListClient from "@/components/schemes/SchemesListClient";
import SchemeSkeleton from "@/components/schemes/SchemeSkeleton";
import { escapeRegex } from "@/utils/escapeRegex";

type Props = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    state?: string;
    status?: string;
    page?: string;
  }>;
};

function SchemesLoadingFallback() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
      <div className="h-10 bg-slate-200 rounded-xl w-1/3 animate-pulse" />
      <div className="h-12 bg-slate-200 rounded-2xl w-full animate-pulse" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <SchemeSkeleton key={idx} />
        ))}
      </div>
    </main>
  );
}

export default async function SchemesPage({ searchParams }: Props) {
  await connectDB();

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 12;

  const query: any = {};
  if (params.search?.trim()) {
    const escaped = escapeRegex(params.search.trim());
    query.$or = [
      { title: { $regex: escaped, $options: "i" } },
      { shortDescription: { $regex: escaped, $options: "i" } },
      { ministry: { $regex: escaped, $options: "i" } },
    ];
  }
  if (params.category) query.category = params.category;
  if (params.state) query.states = params.state;
  if (params.status) query.status = params.status;

  const total = await Scheme.countDocuments(query);
  const totalPages = Math.ceil(total / limit) || 1;

  const schemes = await Scheme.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const serializedSchemes = schemes.map((scheme: any) => ({
    _id: scheme._id.toString(),
    slug: scheme.slug,
    title: scheme.title,
    shortDescription: scheme.shortDescription,
    category: scheme.category,
    ministry: scheme.ministry,
    status: scheme.status,
  }));

  const initialPagination = {
    page,
    limit,
    total,
    totalPages,
  };

  return (
    <Suspense fallback={<SchemesLoadingFallback />}>
      <SchemesListClient
        initialSchemes={serializedSchemes}
        initialPagination={initialPagination}
      />
    </Suspense>
  );
}
