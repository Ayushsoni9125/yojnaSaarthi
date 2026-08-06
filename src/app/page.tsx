import { connectDB } from "@/lib/db/mongoose";
import { getLatestSchemes } from "@/services/schemeQuery.service";
import HomeClient from "@/components/home/HomeClient";

export default async function HomePage() {
  await connectDB();

  const schemes = await getLatestSchemes();

  const serializedSchemes = schemes.map((scheme: any) => ({
    _id: scheme._id.toString(),
    slug: scheme.slug,
    title: scheme.title,
    shortDescription: scheme.shortDescription,
    category: scheme.category,
    ministry: scheme.ministry,
    status: scheme.status,
  }));

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <HomeClient initialSchemes={serializedSchemes} />
    </main>
  );
}