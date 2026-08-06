import { connectDB } from "@/lib/db/mongoose";
import Scheme from "@/models/Scheme";
import SchemesListClient from "@/components/schemes/SchemesListClient";

type Props = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    state?: string;
    status?: string;
    page?: string;
  }>;
};

export default async function SchemesPage({ searchParams }: Props) {
  await connectDB();

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 12;

  const query: any = {};
  if (params.search?.trim()) {
    query.$or = [
      { title: { $regex: params.search.trim(), $options: "i" } },
      { shortDescription: { $regex: params.search.trim(), $options: "i" } },
      { ministry: { $regex: params.search.trim(), $options: "i" } },
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
    <SchemesListClient
      initialSchemes={serializedSchemes}
      initialPagination={initialPagination}
    />
  );
}
