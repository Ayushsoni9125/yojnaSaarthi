"use client";

import { useEffect, useState } from "react";
import SchemeCard from "@/components/schemes/SchemeCard";

export default function AssistantResults() {
  const [schemes, setSchemes] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem(
      "assistant-results"
    );

    if (data) {
      setSchemes(JSON.parse(data));
    }
  }, []);

  return (
    <main className="mx-auto max-w-7xl p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Recommended Schemes
      </h1>

      {schemes.length === 0 ? (
        <p>No schemes found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schemes.map((scheme) => (
            <SchemeCard
              key={scheme._id}
              scheme={{
                _id: scheme._id.toString(),
                slug: scheme.slug,
                title: scheme.title,
                shortDescription:
                  scheme.shortDescription,
                category: scheme.category,
                ministry: scheme.ministry,
                status: scheme.status,
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}