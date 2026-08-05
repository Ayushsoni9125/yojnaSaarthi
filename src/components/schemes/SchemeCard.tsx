"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
  const [isCompared, setIsCompared] = useState(false);

  useEffect(() => {
    const checkCompared = () => {
      const stored = localStorage.getItem("compareList");
      if (stored) {
        try {
          const list = JSON.parse(stored);
          setIsCompared(list.some((item: any) => item._id === scheme._id));
        } catch {
          setIsCompared(false);
        }
      }
    };
    checkCompared();
    window.addEventListener("compare-list-updated", checkCompared);
    return () => window.removeEventListener("compare-list-updated", checkCompared);
  }, [scheme._id]);

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const stored = localStorage.getItem("compareList") || "[]";
    let list = [];
    try {
      list = JSON.parse(stored);
    } catch {
      list = [];
    }

    const exists = list.some((item: any) => item._id === scheme._id);

    if (exists) {
      list = list.filter((item: any) => item._id !== scheme._id);
      localStorage.setItem("compareList", JSON.stringify(list));
      setIsCompared(false);
      window.dispatchEvent(new Event("compare-list-updated"));
      toast.info("Removed from comparison.");
    } else {
      if (list.length >= 3) {
        toast.warning("You can compare a maximum of 3 schemes.");
        return;
      }
      list.push({ _id: scheme._id, title: scheme.title });
      localStorage.setItem("compareList", JSON.stringify(list));
      setIsCompared(true);
      window.dispatchEvent(new Event("compare-list-updated"));
      toast.success("Added to comparison.");
    }
  };

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
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/schemes/${scheme.slug}`}>
      <div className="relative h-full rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

        {/* Actions Bar */}
        <div className="absolute right-4 top-4 z-10 flex gap-1.5">
          <button
            onClick={handleCompareToggle}
            className={`rounded-full border p-2 text-xs transition duration-150 ${
              isCompared
                ? "bg-emerald-50 border-emerald-300 text-emerald-600 hover:bg-emerald-100"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
            title={isCompared ? "Remove from Compare" : "Add to Compare"}
          >
            ⚖️
          </button>
          <button
            onClick={handleBookmark}
            disabled={loading}
            className="rounded-full border border-slate-200 bg-white p-2 text-xs transition hover:bg-slate-50 disabled:opacity-50"
            title="Bookmark"
          >
            {loading ? "..." : "❤️"}
          </button>
        </div>

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