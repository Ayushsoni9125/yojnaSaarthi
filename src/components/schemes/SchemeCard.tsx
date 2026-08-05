"use client";

import Link from "next/link";
import { useState } from "react";

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

export default function SchemeCard({
  scheme,
}: SchemeCardProps) {
  const [loading, setLoading] = useState(false);

  const handleBookmark = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);

      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schemeId: scheme._id,
        }),
      });

      const data = await res.json();

      alert(data.message);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/schemes/${scheme.slug}`}>
      <div className="relative h-full rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          disabled={loading}
          className="absolute right-4 top-4 rounded-full border bg-white p-2 transition hover:bg-gray-100 disabled:opacity-50"
        >
          {loading ? "..." : "❤️"}
        </button>

        {/* Category + Status */}
        <div className="mb-3 flex items-center justify-between pr-12">
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

        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-bold text-slate-900">
          {scheme.title}
        </h3>

        {/* Description */}
        <p className="mt-3 line-clamp-3 text-sm text-slate-600">
          {scheme.shortDescription}
        </p>

        {/* Ministry */}
        <div className="mt-5 border-t pt-3 text-xs text-slate-500">
          {scheme.ministry}
        </div>

      </div>
    </Link>
  );
}