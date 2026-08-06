"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

type Scheme = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  documents: string[];
  tags: string[];
  states: string[];
  category: string;
  ministry: string;
  officialUrl: string;
  status: string;
};

type CompareItem = {
  _id: string;
  title: string;
};

export default function ComparePage() {
  const { status: sessionStatus } = useSession();
  const router = useRouter();

  const [compareList, setCompareList] = useState<CompareItem[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);

  // Auth Guard - Redirect unauthenticated users
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      toast.warning("Please sign in to access the scheme comparison tool.", {
        toastId: "compare-auth-warning",
      });
      router.push("/login");
    }
  }, [sessionStatus, router]);

  // Search autocomplete state for adding new schemes
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Load selection from localStorage
  const loadCompareList = () => {
    const stored = localStorage.getItem("compareList");
    if (stored) {
      try {
        setCompareList(JSON.parse(stored));
      } catch {
        setCompareList([]);
      }
    } else {
      setCompareList([]);
    }
  };

  useEffect(() => {
    loadCompareList();

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("compare-list-updated", loadCompareList);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("compare-list-updated", loadCompareList);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Fetch full details of all compared schemes when list changes
  useEffect(() => {
    const fetchCompareDetails = async () => {
      if (compareList.length === 0) {
        setSchemes([]);
        return;
      }

      try {
        setLoading(true);
        const idsParam = compareList.map((item) => item._id).join(",");
        const res = await fetch(`/api/schemes/compare?ids=${idsParam}`);
        const data = await res.json();

        if (data.success) {
          setSchemes(data.data);
        } else {
          toast.error(data.message || "Failed to load scheme details.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load comparison data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompareDetails();
  }, [compareList]);

  // Autocomplete search suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await fetch(
          `/api/schemes?search=${encodeURIComponent(searchQuery.trim())}&limit=6`
        );
        const data = await res.json();
        if (data.success && data.data?.schemes) {
          // Filter out schemes already in comparison list
          const filtered = data.data.schemes.filter(
            (s: any) => !compareList.some((item) => item._id === s._id)
          );
          setSuggestions(filtered);
          setShowDropdown(filtered.length > 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, compareList]);

  const handleAddScheme = (scheme: any) => {
    if (compareList.length >= 3) {
      toast.warning("You can compare a maximum of 3 schemes.");
      return;
    }

    const updated = [...compareList, { _id: scheme._id, title: scheme.title }];
    localStorage.setItem("compareList", JSON.stringify(updated));
    window.dispatchEvent(new Event("compare-list-updated"));
    setSearchQuery("");
    setShowDropdown(false);
    toast.success("Added to comparison.");
  };

  const handleRemoveScheme = (id: string) => {
    const updated = compareList.filter((item) => item._id !== id);
    localStorage.setItem("compareList", JSON.stringify(updated));
    window.dispatchEvent(new Event("compare-list-updated"));
    toast.info("Removed from comparison.");
  };
  if (sessionStatus === "loading") {
    return (
      <main className="flex min-h-[400px] flex-col items-center justify-center py-20 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        <p className="mt-4 text-sm font-semibold text-slate-600">
          Verifying authorization...
        </p>
      </main>
    );
  }

  if (sessionStatus === "unauthenticated") return null;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 space-y-8 pb-16">
        {/* Title and Top Options */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              ⚖️ Scheme Comparison Matrix
            </h1>
            <p className="mt-1.5 text-slate-500 text-sm">
              Compare government benefits, eligibility, and documentation side-by-side.
            </p>
          </div>

          {/* Autocomplete Search input to add schemes */}
          {compareList.length < 3 && (
            <div ref={searchContainerRef} className="relative w-full md:w-80">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search & add scheme to compare..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(suggestions.length > 0)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                {searching && (
                  <div className="absolute right-3.5 top-3.5 h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 z-40 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-slate-100 bg-white p-2 shadow-xl animate-fade-in">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion._id}
                      onClick={() => handleAddScheme(suggestion)}
                      className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
                    >
                      <p className="font-semibold">{suggestion.title}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {suggestion.ministry} • {suggestion.category}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {loading && schemes.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border bg-white p-12 text-center shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            <p className="mt-4 text-sm font-medium text-slate-500">
              Gathering scheme comparison metrics...
            </p>
          </div>
        ) : compareList.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <span className="text-5xl mb-4">⚖️</span>
            <h3 className="text-lg font-bold text-slate-700">No schemes selected for comparison</h3>
            <p className="mt-1.5 text-sm text-slate-400 max-w-sm">
              Use the search bar above or click the ⚖️ icon on any scheme card to start comparing.
            </p>
            <Link
              href="/schemes"
              className="mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Browse Schemes
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="w-1/4 p-6 text-sm font-bold text-slate-500 uppercase tracking-wider">
                      Comparison Metric
                    </th>
                    {compareList.map((item) => {
                      const detail = schemes.find((s) => s._id === item._id);
                      return (
                        <th key={item._id} className="p-6 w-1/4 min-w-[250px] relative">
                          <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 self-start">
                              {detail?.category || "Loading..."}
                            </span>
                            <h3 className="font-bold text-slate-800 text-sm line-clamp-2">
                              {item.title}
                            </h3>
                            <button
                              onClick={() => handleRemoveScheme(item._id)}
                              className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors self-start mt-1 flex items-center gap-1"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </th>
                      );
                    })}
                    {/* Placeholder columns if comparing less than 3 schemes */}
                    {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                      <th key={idx} className="p-6 w-1/4 min-w-[250px] bg-slate-50/20 border-l border-dashed border-slate-100">
                        <div className="flex flex-col items-center justify-center py-6 text-center text-slate-300">
                          <span className="text-2xl mb-1">＋</span>
                          <span className="text-xs font-medium">Add scheme to compare</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {/* Status Row */}
                  <tr>
                    <td className="p-6 font-semibold bg-slate-50/30 text-slate-800">Status</td>
                    {schemes.map((scheme) => (
                      <td key={scheme._id} className="p-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            scheme.status === "Active"
                              ? "bg-green-50 text-green-700 border border-green-100"
                              : scheme.status === "Upcoming"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-red-50 text-red-700 border border-red-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full inline-block ${
                              scheme.status === "Active"
                                ? "bg-green-500"
                                : scheme.status === "Upcoming"
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                          />
                          {scheme.status}
                        </span>
                      </td>
                    ))}
                    {Array.from({ length: 3 - schemes.length }).map((_, idx) => (
                      <td key={idx} className="p-6 bg-slate-50/10 border-l border-dashed border-slate-100" />
                    ))}
                  </tr>

                  {/* Ministry Row */}
                  <tr>
                    <td className="p-6 font-semibold bg-slate-50/30 text-slate-800">Ministry</td>
                    {schemes.map((scheme) => (
                      <td key={scheme._id} className="p-6 text-slate-600 font-medium">
                        {scheme.ministry}
                      </td>
                    ))}
                    {Array.from({ length: 3 - schemes.length }).map((_, idx) => (
                      <td key={idx} className="p-6 bg-slate-50/10 border-l border-dashed border-slate-100" />
                    ))}
                  </tr>

                  {/* State Row */}
                  <tr>
                    <td className="p-6 font-semibold bg-slate-50/30 text-slate-800">Target States</td>
                    {schemes.map((scheme) => (
                      <td key={scheme._id} className="p-6">
                        {scheme.states && scheme.states.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {scheme.states.map((st) => (
                              <span key={st} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                {st}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400">All India (Central)</span>
                        )}
                      </td>
                    ))}
                    {Array.from({ length: 3 - schemes.length }).map((_, idx) => (
                      <td key={idx} className="p-6 bg-slate-50/10 border-l border-dashed border-slate-100" />
                    ))}
                  </tr>

                  {/* Short Description Row */}
                  <tr>
                    <td className="p-6 font-semibold bg-slate-50/30 text-slate-800">Quick Overview</td>
                    {schemes.map((scheme) => (
                      <td key={scheme._id} className="p-6 text-slate-500 leading-relaxed text-xs">
                        {scheme.shortDescription}
                      </td>
                    ))}
                    {Array.from({ length: 3 - schemes.length }).map((_, idx) => (
                      <td key={idx} className="p-6 bg-slate-50/10 border-l border-dashed border-slate-100" />
                    ))}
                  </tr>

                  {/* Benefits Row */}
                  <tr>
                    <td className="p-6 font-semibold bg-slate-50/30 text-slate-800">Benefits Provided</td>
                    {schemes.map((scheme) => (
                      <td key={scheme._id} className="p-6 leading-relaxed align-top">
                        {scheme.benefits && scheme.benefits.length > 0 ? (
                          <ul className="list-disc pl-4 space-y-1 text-slate-600 text-xs">
                            {scheme.benefits.map((benefit, idx) => (
                              <li key={idx}>{benefit}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-slate-400 text-xs">Check details page for benefits details.</span>
                        )}
                      </td>
                    ))}
                    {Array.from({ length: 3 - schemes.length }).map((_, idx) => (
                      <td key={idx} className="p-6 bg-slate-50/10 border-l border-dashed border-slate-100" />
                    ))}
                  </tr>

                  {/* Documents Row */}
                  <tr>
                    <td className="p-6 font-semibold bg-slate-50/30 text-slate-800">Required Documents</td>
                    {schemes.map((scheme) => (
                      <td key={scheme._id} className="p-6 leading-relaxed align-top">
                        {scheme.documents && scheme.documents.length > 0 ? (
                          <ul className="list-disc pl-4 space-y-1 text-slate-600 text-xs">
                            {scheme.documents.map((doc, idx) => (
                              <li key={idx}>{doc}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-slate-400 text-xs">Not specified.</span>
                        )}
                      </td>
                    ))}
                    {Array.from({ length: 3 - schemes.length }).map((_, idx) => (
                      <td key={idx} className="p-6 bg-slate-50/10 border-l border-dashed border-slate-100" />
                    ))}
                  </tr>

                  {/* View Details Link */}
                  <tr>
                    <td className="p-6 font-semibold bg-slate-50/30 text-slate-800">Actions</td>
                    {schemes.map((scheme) => (
                      <td key={scheme._id} className="p-6">
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/schemes/${scheme.slug}`}
                            className="text-center rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            View Scheme Details
                          </Link>
                          {scheme.officialUrl && (
                            <a
                              href={scheme.officialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-center text-xs font-semibold text-slate-500 hover:text-slate-700 hover:underline"
                            >
                              Official Website ↗
                            </a>
                          )}
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: 3 - schemes.length }).map((_, idx) => (
                      <td key={idx} className="p-6 bg-slate-50/10 border-l border-dashed border-slate-100" />
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
  );
}
