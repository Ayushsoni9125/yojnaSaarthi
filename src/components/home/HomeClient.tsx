"use client";

import { useEffect, useState } from "react";
import SchemeCard from "@/components/schemes/SchemeCard";
import SchemeSkeleton from "@/components/schemes/SchemeSkeleton";
import Link from "next/link";
import { SCHEME_CATEGORIES } from "@/constants/scheme";

type Scheme = {
  _id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  ministry: string;
  status: string;
};

const FEATURED_CATEGORIES = [
  { name: "Agriculture", icon: "🌾", desc: "Kisan subsidies, crop insurance & credit" },
  { name: "Education", icon: "🎓", desc: "Scholarships, student aid & fellowships" },
  { name: "Health", icon: "🏥", desc: "Ayushman Bharat, medical insurance & care" },
  { name: "Housing", icon: "🏠", desc: "PM Awas Yojana & home assistance" },
  { name: "Business", icon: "💼", desc: "Mudra loans, startup grants & MSME aid" },
  { name: "Women Empowerment", icon: "👩", desc: "Maternity benefit, self-help & safety" },
  { name: "Senior Citizens", icon: "👵", desc: "Pensions, healthcare & social security" },
  { name: "Social Welfare", icon: "🤝", desc: "Direct benefit transfer & food security" },
];

export default function HomeClient({
  initialSchemes,
}: {
  initialSchemes: Scheme[];
}) {
  const [schemes, setSchemes] = useState<Scheme[]>(initialSchemes);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debounced search & filter fetch
  useEffect(() => {
    if (!search && !category) {
      setSchemes(initialSchemes);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("limit", showAll ? "24" : "8");

        if (search.trim()) params.append("search", search.trim());
        if (category) params.append("category", category);

        const res = await fetch(`/api/schemes?${params.toString()}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setSchemes(data.data.schemes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [search, category, showAll, initialSchemes]);

  const handleCategoryClick = (catName: string) => {
    if (category === catName) {
      setCategory(""); // Toggle off if selected again
    } else {
      setCategory(catName);
    }
  };

  const displayedSchemes = showAll ? schemes : schemes.slice(0, 4);

  return (
    <div className="space-y-16">
      {/* 1. Hero & Search Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 p-8 sm:p-12 text-white shadow-xl">
        <div className="relative z-10 mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
            <span>✨</span>
            <span>Your Personal Government Welfare Companion</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight">
            Find & Explore Government Schemes with Ease
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
            Discover central and state welfare benefits tailored for farmers, students, women, senior citizens, and entrepreneurs.
          </p>

          {/* Prominent Search Bar */}
          <div className="relative max-w-2xl mx-auto mt-4">
            <div className="flex items-center rounded-2xl bg-white p-2 shadow-2xl">
              <span className="pl-3 text-slate-400 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Search by scheme name, ministry, or benefits (e.g. PM Kisan, Scholarship)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="px-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Pills */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-emerald-200/70 font-medium">Popular:</span>
              {["Agriculture", "Education", "Housing", "Women Empowerment"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setCategory(category === tag ? "" : tag)}
                  className={`rounded-full px-3 py-1 font-medium transition-all ${
                    category === tag
                      ? "bg-emerald-400 text-emerald-950 font-bold"
                      : "bg-white/10 text-emerald-100 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. Browse by Category */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Explore by Category</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select a category to filter schemes matching your interest
            </p>
          </div>
          {category && (
            <button
              onClick={() => setCategory("")}
              className="text-xs font-semibold text-emerald-700 hover:underline self-start sm:self-auto"
            >
              Clear filter ({category})
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FEATURED_CATEGORIES.map((cat) => {
            const isActive = category === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`group flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 ${
                  isActive
                    ? "border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20"
                    : "border-slate-200/80 bg-white hover:border-emerald-300 hover:shadow-sm"
                }`}
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {cat.icon}
                </span>
                <h3 className={`text-sm font-bold ${isActive ? "text-emerald-900" : "text-slate-800"}`}>
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Featured / Filtered Schemes */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {search || category ? "Matching Schemes" : "Featured Schemes"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {search || category
                ? `Showing results for ${search ? `"${search}"` : ""} ${category ? `in ${category}` : ""}`
                : "Handpicked government schemes you can apply for today"}
            </p>
          </div>

          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors border border-emerald-200 rounded-xl px-4 py-2 bg-emerald-50/50 hover:bg-emerald-50"
          >
            {showAll ? "Show Less" : "View All Schemes →"}
          </button>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <SchemeSkeleton key={idx} />
            ))}
          </div>
        ) : displayedSchemes.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
            <span className="text-4xl">🔍</span>
            <h3 className="text-base font-bold text-slate-800 mt-3">No schemes found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try clearing your search query or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("");
              }}
              className="mt-4 text-xs font-bold text-emerald-700 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {displayedSchemes.map((scheme) => (
              <SchemeCard key={scheme._id} scheme={scheme} />
            ))}
          </div>
        )}
      </section>

      {/* 4. How YojanaSaarthi Helps You */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-sm space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">How YojanaSaarthi Works</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A simple 3-step approach to navigating government benefits smoothly
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-6 space-y-3 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-800 text-base">Search & Discover</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Quickly find verified welfare programs from central and state ministries using intuitive filters.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6 space-y-3 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-800 text-base">Compare & Qualify</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use our side-by-side comparison tool to evaluate benefits, rules, and document prerequisites.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6 space-y-3 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-800 text-base">AI Virtual Guidance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask our AI Assistant any question to get customized recommendations based on your profile.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Call to Action Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-lg text-center sm:text-left">
          <h2 className="text-2xl font-bold">Unsure which scheme suits you best?</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Answer a few quick questions and let our AI Assistant recommend the most relevant schemes for your background.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/assistant"
            className="text-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
          >
            🤖 Try AI Assistant
          </Link>
          <Link
            href="/compare"
            className="text-center rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            ⚖️ Compare Schemes
          </Link>
        </div>
      </section>
    </div>
  );
}