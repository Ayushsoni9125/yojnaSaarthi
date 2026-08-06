"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SchemeCard from "@/components/schemes/SchemeCard";

export default function AssistantResults() {
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const [schemes, setSchemes] = useState<any[]>([]);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      toast.warning("Please sign in to access recommendation results.", {
        toastId: "assistant-auth-warning",
      });
      router.push("/login");
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    const data = localStorage.getItem("assistant-results");
    if (data) {
      setSchemes(JSON.parse(data));
    }
  }, []);

  if (sessionStatus === "loading") {
    return (
      <main className="flex min-h-[400px] flex-col items-center justify-center py-20 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        <p className="mt-4 text-sm font-semibold text-slate-600">
          Verifying authorization...
        </p>
      </main>
    );
  }

  if (sessionStatus === "unauthenticated") return null;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          🎯 Recommended Schemes for You
        </h1>
        <p className="mt-1 text-slate-500 text-sm">
          Based on your profile answers, here are the government schemes you are most likely eligible for.
        </p>
      </div>

      {schemes.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
          <span className="text-4xl">🤖</span>
          <h3 className="text-base font-bold text-slate-800 mt-3">No recommendations found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try filling out the AI Assistant questionnaire again with updated information.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {schemes.map((scheme) => (
            <SchemeCard
              key={scheme._id}
              scheme={{
                _id: scheme._id.toString(),
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
      )}
    </main>
  );
}