"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";

export default function SchemeToolbar() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      {/* Search */}
      <div className="relative w-full md:max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Search schemes..."
          className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-green-600"
        />
      </div>

      {/* Add Scheme */}
      <Link
        href="/admin/schemes/new"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700"
      >
        <Plus size={18} />
        Add Scheme
      </Link>
    </div>
  );
}