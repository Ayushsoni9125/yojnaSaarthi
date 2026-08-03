"use client";

import { useState } from "react";

export default function RunScraperButton() {
  const [loading, setLoading] = useState(false);

  const runScraper = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/scraper/run", {
        method: "POST",
      });

      const data = await res.json();

      alert(data.message);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={runScraper}
      disabled={loading}
      className="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Running..." : "Run Scraper"}
    </button>
  );
}