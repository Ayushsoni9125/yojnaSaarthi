"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import RecentlyViewed from "./RecentlyViewed";

type SchemeDetailsProps = {
  scheme: {
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
};

export default function SchemeDetailsClient({ scheme }: SchemeDetailsProps) {
  const [copiedScheme, setCopiedScheme] = useState(false);
  const [copiedOfficial, setCopiedOfficial] = useState(false);

  const handleCopySchemeLink = async () => {
    try {
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedScheme(true);
      toast.success("Scheme details link copied to clipboard!");
      setTimeout(() => setCopiedScheme(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleCopyOfficialLink = async () => {
    try {
      await navigator.clipboard.writeText(scheme.officialUrl);
      setCopiedOfficial(true);
      toast.success("Official website link copied to clipboard!");
      setTimeout(() => setCopiedOfficial(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Dynamic Client Recently Viewed Tracker */}
      <RecentlyViewed scheme={{ _id: scheme._id }} />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <Link href="/" className="hover:text-emerald-700 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/" className="hover:text-emerald-700 transition-colors">
          Schemes
        </Link>
        <span>/</span>
        <span className="text-slate-500 truncate max-w-[120px] sm:max-w-[200px]">
          {scheme.category}
        </span>
        <span>/</span>
        <span className="text-slate-700 truncate max-w-[150px] sm:max-w-[280px]">
          {scheme.title}
        </span>
      </nav>

      {/* Title block */}
      <div className="space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            {scheme.category}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              scheme.status === "Active"
                ? "bg-green-50 text-green-700 border-green-100"
                : scheme.status === "Upcoming"
                ? "bg-amber-50 text-amber-700 border-amber-100"
                : "bg-red-50 text-red-700 border-red-100"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                scheme.status === "Active"
                  ? "bg-green-500"
                  : scheme.status === "Upcoming"
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
            />
            {scheme.status}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-slate-900 leading-tight sm:text-4xl">
          {scheme.title}
        </h1>

        {/* Short Description */}
        <p className="text-lg text-slate-600 leading-relaxed max-w-4xl">
          {scheme.shortDescription}
        </p>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
          >
            Visit Official Website ↗
          </a>
          <button
            onClick={handleCopySchemeLink}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            {copiedScheme ? "Copied! ✓" : "Copy Scheme Link"}
          </button>
          <button
            onClick={handleCopyOfficialLink}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            {copiedOfficial ? "Copied! ✓" : "Copy Official Link"}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main description, benefits and documents details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Scheme Description
            </h2>
            <p className="leading-8 text-slate-600 text-sm whitespace-pre-line">
              {scheme.description}
            </p>
          </div>

          {/* Benefits */}
          {scheme.benefits && scheme.benefits.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Benefits Provided
              </h2>
              <ul className="list-disc pl-5 space-y-3.5 text-slate-600 text-sm">
                {scheme.benefits.map((benefit, index) => (
                  <li key={index} className="leading-relaxed">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Documents required */}
          {scheme.documents && scheme.documents.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Required Documents
              </h2>
              <ul className="list-disc pl-5 space-y-3.5 text-slate-600 text-sm">
                {scheme.documents.map((doc, index) => (
                  <li key={index} className="leading-relaxed">
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar metadata panel */}
        <div className="space-y-6">
          {/* Ministry details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sponsoring Agency
            </h3>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              {scheme.ministry || "Not specified"}
            </p>
          </div>

          {/* State eligibility details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              State Scope
            </h3>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              {scheme.states && scheme.states.length > 0
                ? scheme.states.join(", ")
                : "All India (Central Government)"}
            </p>
          </div>

          {/* Tags list details */}
          {scheme.tags && scheme.tags.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Relevant Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {scheme.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
