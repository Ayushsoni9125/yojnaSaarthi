"use client";

import { useEffect, useState } from "react";
import SchemeCard from "@/components/schemes/SchemeCard";
import SchemeSkeleton from "@/components/schemes/SchemeSkeleton";
import { SCHEME_CATEGORIES, SCHEME_STATUS } from "@/constants/scheme";
import { INDIAN_STATES } from "@/constants/states";

type Scheme = {
  _id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  ministry: string;
  status: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function HomeClient({
  initialSchemes,
}: {
  initialSchemes: Scheme[];
}) {
  const [schemes, setSchemes] = useState<Scheme[]>(initialSchemes);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: initialSchemes.length,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, state, status]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("limit", "12");

        if (search.trim()) params.append("search", search.trim());
        if (category) params.append("category", category);
        if (state) params.append("state", state);
        if (status) params.append("status", status);

        const res = await fetch(`/api/schemes?${params.toString()}`);

        const data = await res.json();

        if (!res.ok) {
          console.error(data);
          return;
        }

        setSchemes(data.data.schemes);
        setPagination(data.data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, category, state, status, page]);

  return (
    <>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search government schemes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border p-2"
        >
          <option value="">All Categories</option>

          {SCHEME_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border p-2"
        >
          <option value="">All Status</option>

          {SCHEME_STATUS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* State */}
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="rounded-lg border p-2"
        >
          <option value="">All States</option>

          {INDIAN_STATES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Cards & Loading state */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in">
          {Array.from({ length: 8 }).map((_, idx) => (
            <SchemeSkeleton key={idx} />
          ))}
        </div>
      ) : schemes.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl p-8 max-w-md mx-auto shadow-sm animate-fade-in">
          <span className="text-4xl">🔍</span>
          <h3 className="text-lg font-bold text-slate-800 mt-4">No schemes found</h3>
          <p className="text-sm text-slate-400 mt-1">
            We couldn&apos;t find any government schemes matching your search queries or filters. Try adjusting your parameters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {schemes.map((scheme) => (
              <SchemeCard key={scheme._id} scheme={scheme} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
              className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === pagination.totalPages}
              className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
}