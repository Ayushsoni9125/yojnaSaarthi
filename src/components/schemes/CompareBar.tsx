"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CompareItem = {
  _id: string;
  title: string;
};

export default function CompareBar() {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const loadItems = () => {
      const stored = localStorage.getItem("compareList");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setItems(parsed);
          setVisible(parsed.length > 0);
        } catch {
          setItems([]);
          setVisible(false);
        }
      } else {
        setItems([]);
        setVisible(false);
      }
    };

    loadItems();

    // Listen to storage changes and custom trigger events
    window.addEventListener("storage", loadItems);
    window.addEventListener("compare-list-updated", loadItems);

    return () => {
      window.removeEventListener("storage", loadItems);
      window.removeEventListener("compare-list-updated", loadItems);
    };
  }, []);

  const handleRemove = (id: string) => {
    const updated = items.filter((item) => item._id !== id);
    localStorage.setItem("compareList", JSON.stringify(updated));
    window.dispatchEvent(new Event("compare-list-updated"));
  };

  const handleClear = () => {
    localStorage.removeItem("compareList");
    window.dispatchEvent(new Event("compare-list-updated"));
  };

  if (!visible || items.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-3xl -translate-x-1/2 animate-slide-up rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-xl backdrop-blur-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Selection Details */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-slate-800">
            Compare Schemes ({items.length}/3)
          </span>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800"
              >
                <span className="max-w-[120px] truncate">{item.title}</span>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="rounded-full hover:bg-emerald-100 p-0.5 text-emerald-600 transition-colors"
                  aria-label="Remove scheme from comparison"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleClear}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Clear All
          </button>
          <Link
            href="/compare"
            className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
}
