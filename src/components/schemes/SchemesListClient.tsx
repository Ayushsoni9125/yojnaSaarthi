"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SchemeCard from "@/components/schemes/SchemeCard";
import SchemeSkeleton from "@/components/schemes/SchemeSkeleton";
import { SCHEME_CATEGORIES, SCHEME_STATUS } from "@/constants/scheme";
import { INDIAN_STATES } from "@/constants/states";
import { apiFetch } from "@/lib/apiClient";

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

export default function SchemesListClient({
  initialSchemes,
  initialPagination,
}: {
  initialSchemes: Scheme[];
  initialPagination: Pagination;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [schemes, setSchemes] = useState<Scheme[]>(initialSchemes);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [state, setState] = useState(searchParams.get("state") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [loading, setLoading] = useState(false);

  // Sync state if searchParams change externally
  useEffect(() => {
    const qSearch = searchParams.get("search") || "";
    const qCategory = searchParams.get("category") || "";
    const qState = searchParams.get("state") || "";
    const qStatus = searchParams.get("status") || "";
    const qPage = Number(searchParams.get("page")) || 1;

    setSearch(qSearch);
    setCategory(qCategory);
    setState(qState);
    setStatus(qStatus);
    setPage(qPage);
  }, [searchParams]);

  // Fetch schemes whenever filters or page changes
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

        // Update browser URL query without full page reload
        router.replace(`/schemes?${params.toString()}`, { scroll: false });

        const res = await apiFetch(`/api/schemes?${params.toString()}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setSchemes(data.data.schemes);
          setPagination(data.data.pagination);
        }
      } catch (err) {
        console.error("Failed to fetch schemes:", err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [search, category, state, status, page, router]);

  const handleFilterReset = () => {
    setSearch("");
    setCategory("");
    setState("");
    setStatus("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            🔍 All Government Schemes
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            Browse, filter, and discover central and state government welfare schemes across India.
          </p>
        </div>

        {(search || category || state || status) && (
          <button
            onClick={handleFilterReset}
            className="self-start md:self-auto text-xs font-semibold text-emerald-700 hover:text-emerald-800 border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 rounded-xl transition-colors"
          >
            Clear All Filters ✕
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
          <span className="pl-3 text-slate-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search by scheme name, ministry, keyword, or benefits..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none font-medium"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="px-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3">
        {/* Category */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm"
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
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm"
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
          onChange={(e) => {
            setState(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm"
        >
          <option value="">All States / UTs</option>
          {INDIAN_STATES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200/60 pb-3">
        <span>
          Showing <strong className="text-slate-800">{schemes.length}</strong> of{" "}
          <strong className="text-slate-800">{pagination.total}</strong> government schemes
        </span>
        <span>Page {pagination.page} of {pagination.totalPages || 1}</span>
      </div>

      {/* Cards Grid & Loading / Empty states */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in">
          {Array.from({ length: 8 }).map((_, idx) => (
            <SchemeSkeleton key={idx} />
          ))}
        </div>
      ) : schemes.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
          <span className="text-4xl">🔍</span>
          <h3 className="text-base font-bold text-slate-800 mt-3">No matching schemes found</h3>
          <p className="text-xs text-slate-400 mt-1">
            We couldn&apos;t find any schemes matching your selected filters or search terms.
          </p>
          <button
            onClick={handleFilterReset}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {schemes.map((scheme) => (
              <SchemeCard key={scheme._id} scheme={scheme} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pagination.totalPages}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
