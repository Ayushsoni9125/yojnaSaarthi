"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

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

export default function HomeClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/schemes?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/schemes");
    }
  };

  return (
    <div className="space-y-16">
      {/* 1. Hero & Search Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 p-8 sm:p-14 text-white shadow-xl">
        <div className="relative z-10 mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-emerald-500/20 px-3 sm:px-4 py-1 text-[11px] sm:text-xs font-semibold text-emerald-300 border border-emerald-500/30 backdrop-blur-md whitespace-nowrap max-w-full">
            <span>✨</span>
            <span>Your Personal Government Welfare Companion</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight">
            Find & Explore Government Schemes with Ease
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
            Discover central and state welfare benefits tailored for farmers, students, women, senior citizens, and entrepreneurs.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto mt-4">
            <div className="flex items-center rounded-2xl bg-white p-1.5 sm:p-2 shadow-2xl">
              <span className="pl-2.5 sm:pl-3 text-slate-400">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <input
                type="text"
                placeholder="Search schemes, ministry, or keywords (e.g. PM Kisan)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent px-2.5 sm:px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none font-medium min-w-0"
              />
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 p-2.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition-all flex-shrink-0 flex items-center justify-center gap-1.5"
                title="Search Schemes"
              >
                <Search className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Search Schemes</span>
              </button>
            </div>

            {/* Quick Tag Pills */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-emerald-200/70 font-medium">Quick Tags:</span>
              {["Agriculture", "Education", "Housing", "Women Empowerment"].map((tag) => (
                <Link
                  key={tag}
                  href={`/schemes?category=${encodeURIComponent(tag)}`}
                  className="rounded-full px-3 py-1 font-medium bg-white/10 text-emerald-100 hover:bg-white/20 border border-white/10 transition-all"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </form>

          {/* Primary CTA Button */}
          <div className="pt-4">
            <Link
              href="/schemes"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-8 py-3.5 text-base font-extrabold text-slate-950 shadow-lg hover:bg-emerald-400 transition-all hover:scale-105"
            >
              <span>Explore All Schemes</span>
              <span className="text-lg">→</span>
            </Link>
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
            <h2 className="text-2xl font-bold text-slate-900">Explore Schemes by Category</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select any category to view all relevant government welfare programs
            </p>
          </div>

          <Link
            href="/schemes"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {FEATURED_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/schemes?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-start p-5 rounded-2xl border border-slate-200/80 bg-white text-left transition-all duration-200 hover:border-emerald-300 hover:shadow-md"
            >
              <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {cat.icon}
              </span>
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {cat.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Explore Banner CTA */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 p-6 sm:p-8 lg:p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Complete Scheme Directory
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            Ready to browse all listed schemes?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Filter by state, category, or application status across thousands of government schemes.
          </p>
        </div>

        <Link
          href="/schemes"
          className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-3.5 text-sm font-extrabold text-emerald-900 shadow-md hover:bg-emerald-50 active:scale-95 transition-all flex-shrink-0 text-center whitespace-nowrap w-full sm:w-auto"
        >
          🔍 Browse All Schemes →
        </Link>
      </section>

      {/* 4. How YojanaSaarthi Helps You */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 lg:p-10 shadow-sm space-y-8">
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
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 lg:p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        {/* Glow decoration */}
        <div 
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-20 pointer-events-none blur-3xl"
          style={{ background: "radial-gradient(circle, #10b981, transparent)" }} 
        />
        <div 
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-10 pointer-events-none blur-3xl"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} 
        />

        <div className="relative z-10 space-y-2 max-w-xl text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Unsure which scheme suits you best?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
            Answer a few quick questions and let our AI Assistant recommend the most relevant schemes for your background.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto flex-shrink-0">
          <Link
            href="/assistant"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-500 active:scale-95 transition-all text-center whitespace-nowrap w-full sm:w-auto"
          >
            🤖 Try AI Assistant
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700 active:scale-95 transition-all text-center whitespace-nowrap w-full sm:w-auto"
          >
            ⚖️ Compare Schemes
          </Link>
        </div>
      </section>
    </div>
  );
}