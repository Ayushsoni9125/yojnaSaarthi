"use client";

import { useEffect, useState } from "react";
import SchemeCard from "@/components/schemes/SchemeCard";

export default function HomeClient({
  initialSchemes,
}: {
  initialSchemes: any[];
}) {
  const [schemes, setSchemes] = useState(initialSchemes);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSchemes = async () => {
      const res = await fetch(
        `/api/schemes?search=${encodeURIComponent(search)}`
      );

      const data = await res.json();

      setSchemes(data.data.schemes);
    };

    fetchSchemes();
  }, [search]);

  return (
    <>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search schemes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {schemes.map((scheme: any) => (
          <SchemeCard
            key={scheme._id}
            scheme={{
              _id: scheme._id,
              slug: scheme.slug,
              title: scheme.title,
              shortDescription: scheme.shortDescription,
              category: scheme.category,
              ministry: scheme.ministry,
              status: scheme.status,
            }}
          />
        ))}
      </div>
    </>
  );
}