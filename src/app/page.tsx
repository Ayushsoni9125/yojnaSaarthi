import { connectDB } from "@/lib/db/mongoose";
import { getLatestSchemes } from "@/services/schemeQuery.service";
import HomeClient from "@/components/home/HomeClient";
import Header from "@/components/layout/Header";

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
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-slate-900">
          Find the Right Government Scheme
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          Discover central and state government schemes tailored for students,
          farmers, women, senior citizens, entrepreneurs and more.
        </p>
      </section>

      {/* Latest Schemes */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">
          Latest Schemes
        </h2>

        <HomeClient initialSchemes={serializedSchemes} />
      </section>
    </main>
    </div>
  );
}