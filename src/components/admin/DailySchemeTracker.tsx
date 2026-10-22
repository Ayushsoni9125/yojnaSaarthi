"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CalendarPlus,
  AlertTriangle,
  Trash2,
  ExternalLink,
  Pencil,
  Search,
  CheckCircle2,
  Clock,
  Bot,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  Info,
} from "lucide-react";

type SchemeItem = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  ministry: string;
  status: string;
  sources?: { name: string; url: string }[];
  createdAt?: string | null;
  updatedAt?: string | null;
  officialUrl?: string;
};

type DeletedItem = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  ministry: string;
  reason: string;
  deletedBy: string;
  deletedAt?: string | null;
  originalCreatedAt?: string | null;
  sources?: { name: string; url: string }[];
  officialUrl?: string;
};

type ScraperStats = {
  status: string;
  source: string;
  lastRun: string | null;
  importedSchemes: number;
  totalSchemes: number;
};

type Props = {
  addedToday: SchemeItem[];
  expiredSchemes: SchemeItem[];
  deletedSchemes: DeletedItem[];
  totalAddedToday: number;
  totalExpired: number;
  totalDeleted: number;
  deletedTodayCount: number;
  scraperStats: ScraperStats;
};

function formatIST(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "N/A";
  return (
    d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }) + " IST"
  );
}

export default function DailySchemeTracker({
  addedToday,
  expiredSchemes,
  deletedSchemes,
  totalAddedToday,
  totalExpired,
  totalDeleted,
  deletedTodayCount,
  scraperStats,
}: Props) {
  const [activeTab, setActiveTab] = useState<"added" | "expired" | "deleted">("added");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAdded = useMemo(() => {
    if (!searchQuery.trim()) return addedToday;
    const q = searchQuery.toLowerCase();
    return addedToday.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q) ||
        s.ministry?.toLowerCase().includes(q)
    );
  }, [addedToday, searchQuery]);

  const filteredExpired = useMemo(() => {
    if (!searchQuery.trim()) return expiredSchemes;
    const q = searchQuery.toLowerCase();
    return expiredSchemes.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q) ||
        s.ministry?.toLowerCase().includes(q)
    );
  }, [expiredSchemes, searchQuery]);

  const filteredDeleted = useMemo(() => {
    if (!searchQuery.trim()) return deletedSchemes;
    const q = searchQuery.toLowerCase();
    return deletedSchemes.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.reason?.toLowerCase().includes(q) ||
        s.deletedBy?.toLowerCase().includes(q)
    );
  }, [deletedSchemes, searchQuery]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm transition-all mb-10">
      {/* Top Banner / Scraper Sync Info */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Bot className="w-3.5 h-3.5 text-emerald-600" />
              Automated Tracking Active
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Daily Portal Audit
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Daily Scheme Audit & Tracker
          </h2>

          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Track schemes added today, monitored expiration dates, and delisted schemes removed from government portals.
          </p>
        </div>

        {/* Scraper Status Badge & Quick Action */}
        <div className="flex flex-wrap items-center gap-2.5 sm:self-start lg:self-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
            <div
              className={`w-2 h-2 rounded-full ${
                scraperStats.status === "Running"
                  ? "bg-amber-500 animate-pulse"
                  : "bg-emerald-500"
              }`}
            />
            <span>
              Scraper: <strong className="font-semibold text-slate-900">{scraperStats.status}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">
              Last synced: {formatIST(scraperStats.lastRun)}
            </span>
          </div>

          <Link
            href="/admin/scraper"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs border border-emerald-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Scraper Controls
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Added Today Tab */}
          <button
            onClick={() => setActiveTab("added")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === "added"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-600/20"
                : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
            }`}
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Added Today</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "added"
                  ? "bg-emerald-700/80 text-emerald-50"
                  : "bg-white text-emerald-700 border border-emerald-200"
              }`}
            >
              {totalAddedToday}
            </span>
          </button>

          {/* Expired Schemes Tab */}
          <button
            onClick={() => setActiveTab("expired")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === "expired"
                ? "bg-amber-600 text-white shadow-sm shadow-amber-600/30 ring-2 ring-amber-600/20"
                : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Expired Schemes</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "expired"
                  ? "bg-amber-700/80 text-amber-50"
                  : "bg-white text-amber-700 border border-amber-200"
              }`}
            >
              {totalExpired}
            </span>
          </button>

          {/* Deleted / Reconciled Tab */}
          <button
            onClick={() => setActiveTab("deleted")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === "deleted"
                ? "bg-rose-600 text-white shadow-sm shadow-rose-600/30 ring-2 ring-rose-600/20"
                : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Deleted / Reconciled</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "deleted"
                  ? "bg-rose-700/80 text-rose-50"
                  : "bg-white text-rose-700 border border-rose-200"
              }`}
            >
              {totalDeleted}
            </span>
          </button>
        </div>

        {/* Search within Tracker */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${
              activeTab === "added"
                ? "today's schemes"
                : activeTab === "expired"
                ? "expired schemes"
                : "deleted records"
            }...`}
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Tab 1: Added Today Content */}
      {activeTab === "added" && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Showing <strong>{filteredAdded.length}</strong> scheme{filteredAdded.length === 1 ? "" : "s"} added since midnight IST
              </p>
            </div>

            <Link
              href="/admin/schemes?timeFrame=today"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 hover:underline"
            >
              View in Schemes Table <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {filteredAdded.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <CalendarPlus className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No New Schemes Added Today</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Existing schemes are up-to-date. If you want to check for new government schemes published today, run the scraper from the control panel.
              </p>
              <div className="mt-4">
                <Link
                  href="/admin/scraper"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Run Scraper Now
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Scheme Details</th>
                    <th className="py-3 px-4">Category & Ministry</th>
                    <th className="py-3 px-4">Source Portal</th>
                    <th className="py-3 px-4">Added Time (IST)</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdded.map((scheme) => (
                    <tr key={scheme._id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs sm:max-w-md">
                        <div className="flex items-start gap-2">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                          <div>
                            <span className="line-clamp-2">{scheme.title}</span>
                            <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                              slug: {scheme.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
                          {scheme.category || "General"}
                        </span>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {scheme.ministry || "Government of India"}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-xs font-medium">
                            {scheme.sources?.[0]?.name || "MyScheme"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatIST(scheme.createdAt)}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/schemes/${scheme.slug}`}
                            target="_blank"
                            title="View Live Scheme Page"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/schemes/${scheme.slug}/edit`}
                            title="Edit Scheme"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Expired Schemes Content */}
      {activeTab === "expired" && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Showing <strong>{filteredExpired.length}</strong> schemes currently marked as <strong>Expired</strong>
              </p>
            </div>

            <Link
              href="/admin/schemes?status=Expired"
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1 hover:underline"
            >
              Filter in Schemes Table <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {filteredExpired.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Zero Expired Schemes</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No catalogued schemes have expired. All schemes in the database are currently Active or Upcoming.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Scheme Title</th>
                    <th className="py-3 px-4">Category & Ministry</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Updated</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExpired.map((scheme) => (
                    <tr key={scheme._id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs sm:max-w-md">
                        <span className="line-clamp-2">{scheme.title}</span>
                        <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                          slug: {scheme.slug}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-1">
                          {scheme.category || "General"}
                        </span>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {scheme.ministry || "Government of India"}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Expired
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                        {formatIST(scheme.updatedAt || scheme.createdAt)}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/schemes/${scheme.slug}`}
                            target="_blank"
                            title="View Scheme Page"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/schemes/${scheme.slug}/edit`}
                            title="Edit / Reactivate"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-600 transition"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Deleted / Reconciled Content */}
      {activeTab === "deleted" && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Archived Delisted & Deleted Schemes ({filteredDeleted.length} tracked records)
              </p>
            </div>

            {deletedTodayCount > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                {deletedTodayCount} removed today
              </span>
            )}
          </div>

          {filteredDeleted.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Deleted or Delisted Schemes</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No schemes have been delisted from official government portals or deleted by administrators.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Scheme Title</th>
                    <th className="py-3 px-4">Delisting / Deletion Reason</th>
                    <th className="py-3 px-4">Removed By</th>
                    <th className="py-3 px-4">Date Removed (IST)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDeleted.map((item) => (
                    <tr key={item._id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs sm:max-w-md">
                        <span className="line-clamp-2">{item.title}</span>
                        <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                          slug: {item.slug}
                        </span>
                        {item.ministry && (
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            {item.ministry}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="flex items-start gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                          <span className="text-xs">{item.reason || "Delisted from government portal"}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {item.deletedBy}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                        {formatIST(item.deletedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
