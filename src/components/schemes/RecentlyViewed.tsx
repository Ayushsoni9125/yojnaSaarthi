"use client";

import { useEffect } from "react";

type Props = {
  scheme: {
    _id: string;
    slug: string;
    title: string;
    shortDescription: string;
    category: string;
    ministry: string;
    status: string;
  };
};

export default function RecentlyViewed({ scheme }: Props) {
  useEffect(() => {
    const existing = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    );

    const filtered = existing.filter(
      (item: any) => item._id !== scheme._id
    );

    filtered.unshift(scheme);

    localStorage.setItem(
      "recentlyViewed",
      JSON.stringify(filtered.slice(0, 10))
    );
  }, [scheme]);

  return null;
}