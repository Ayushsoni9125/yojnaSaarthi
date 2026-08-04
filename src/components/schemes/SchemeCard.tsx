import Link from "next/link";

type SchemeCardProps = {
  scheme: {
    _id: string;
    slug: string;
    title: string;
    shortDescription: string;
    category: string;
    ministry: string;
    status: string;
  };
};

export default function SchemeCard({ scheme }: SchemeCardProps) {
  return (
    <Link href={`/schemes/${scheme.slug}`}>
      <div className="h-full rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {scheme.category}
          </span>

          <span
            className={`text-xs font-semibold ${
              scheme.status === "Active"
                ? "text-green-600"
                : scheme.status === "Upcoming"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {scheme.status}
          </span>
        </div>

        <h3 className="line-clamp-2 text-lg font-bold text-slate-900">
          {scheme.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm text-slate-600">
          {scheme.shortDescription}
        </p>

        <div className="mt-5 border-t pt-3 text-xs text-slate-500">
          {scheme.ministry}
        </div>
      </div>
    </Link>
  );
}