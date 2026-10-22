"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, CalendarPlus, AlertTriangle, CheckCircle2, ListFilter } from "lucide-react";
import {
    SCHEME_CATEGORIES,
    SCHEME_STATUS,
} from "@/constants/scheme";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";

export default function SchemeToolbar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? ""
    );

    const currentTimeFrame = searchParams.get("timeFrame");
    const currentStatus = searchParams.get("status");

    // Debounced search
    useEffect(() => {
        const currentSearch = searchParams.get("search") ?? "";
        if (search.trim() === currentSearch.trim()) return;

        const timer = setTimeout(() => {
            const params = new URLSearchParams(
                searchParams.toString()
            );

            if (search.trim()) {
                params.set("search", search.trim());
            } else {
                params.delete("search");
            }

            params.set("page", "1");

            router.push(`/admin/schemes?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timer);
    }, [search, router, searchParams]);

    const updateParam = (
        key: string,
        value: string
    ) => {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        params.set("page", "1");

        router.push(`/admin/schemes?${params.toString()}`);
    };

    const setQuickFilter = (type: "all" | "today" | "expired" | "active") => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        if (type === "all") {
            params.delete("timeFrame");
            params.delete("status");
        } else if (type === "today") {
            params.set("timeFrame", "today");
            params.delete("status");
        } else if (type === "expired") {
            params.set("status", "Expired");
            params.delete("timeFrame");
        } else if (type === "active") {
            params.set("status", "Active");
            params.delete("timeFrame");
        }
        router.push(`/admin/schemes?${params.toString()}`);
    };

    return (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            {/* Quick Filter Pill Buttons */}
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                    <ListFilter className="w-3.5 h-3.5" /> Filter:
                </span>

                <button
                    onClick={() => setQuickFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        !currentTimeFrame && !currentStatus
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                    All Schemes
                </button>

                <button
                    onClick={() => setQuickFilter("today")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        currentTimeFrame === "today"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                    }`}
                >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    Added Today
                </button>

                <button
                    onClick={() => setQuickFilter("active")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        currentStatus === "Active" && !currentTimeFrame
                            ? "bg-emerald-700 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active
                </button>

                <button
                    onClick={() => setQuickFilter("expired")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        currentStatus === "Expired"
                            ? "bg-amber-600 text-white shadow-sm"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                    }`}
                >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Expired
                </button>
            </div>

            {/* Inputs & Dropdowns */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Left */}
                <div className="flex flex-1 flex-col gap-4 md:flex-row">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search schemes by title, ministry, or keywords..."
                            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                        />
                    </div>

                    {/* Category */}
                    <select
                        defaultValue={
                            searchParams.get("category") ?? ""
                        }
                        onChange={(e) =>
                            updateParam(
                                "category",
                                e.target.value
                            )
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 bg-white"
                    >
                        <option value="">
                            All Categories
                        </option>

                        {SCHEME_CATEGORIES.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>

                    {/* Status */}
                    <select
                        value={currentStatus ?? ""}
                        onChange={(e) =>
                            updateParam(
                                "status",
                                e.target.value
                            )
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 bg-white"
                    >
                        <option value="">
                            All Status
                        </option>

                        {SCHEME_STATUS.map((status) => (
                            <option
                                key={status}
                                value={status}
                            >
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-3">
                    <select
                        defaultValue={searchParams.get("sort") ?? "latest"}
                        onChange={(e) =>
                            updateParam("sort", e.target.value)
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 bg-white"
                    >
                        <option value="latest">Latest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="az">Title (A-Z)</option>
                        <option value="za">Title (Z-A)</option>
                    </select>

                    {/* Add Scheme Button */}
                    <Link
                        href="/admin/schemes/new"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 whitespace-nowrap shadow-sm"
                    >
                        <Plus size={18} />
                        Add Scheme
                    </Link>
                </div>
            </div>
        </div>
    );
}