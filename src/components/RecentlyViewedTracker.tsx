"use client";

import { useEffect } from "react";

export default function RecentlyViewedTracker({
  schemeId,
}: {
  schemeId: string;
}) {
  useEffect(() => {
    fetch("/api/recently-viewed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ schemeId }),
    }).catch(() => {});
  }, [schemeId]);

  return null;
}