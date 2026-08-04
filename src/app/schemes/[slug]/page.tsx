import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { getSchemeBySlug } from "@/services/schemeQuery.service";

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

    return (
        <div className="mx-auto max-w-5xl px-6 py-10">
            <div className="mb-6">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {scheme.category}
                </span>
            </div>

            <h1 className="text-4xl font-bold">
                {scheme.title}
            </h1>

            <p className="mt-4 text-lg text-slate-600">
                {scheme.shortDescription}
            </p>

            <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-xl font-semibold">
                    Description
                </h2>

                <p className="leading-8 text-slate-700">
                    {scheme.description}
                </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="mb-3 font-semibold">
                        Ministry
                    </h3>

                    <p>{scheme.ministry || "Unknown"}</p>
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="mb-3 font-semibold">
                        Status
                    </h3>

                    <p>{scheme.status}</p>
                </div>

            </div>

            <div className="mt-8">
                <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
                >
                    Visit Official Website
                </a>
            </div>
        </div>
    );
}