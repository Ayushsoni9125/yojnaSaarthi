"use client";

import { useEffect } from "react";

type Props = {
  scheme: {
    _id: string;
  };
};

export default function RecentlyViewed({ scheme }: Props) {
  useEffect(() => {
    const saveRecentlyViewed = async () => {
      try {
        await fetch("/api/recently-viewed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            schemeId: scheme._id,
          }),
        });
      } catch (error) {
        console.error("Failed to save recently viewed:", error);
      }
    };

    saveRecentlyViewed();
  }, [scheme._id]);

  return null;
}