"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AssistantForm from "@/components/assistant/AssistantForm";

export default function AssistantPage() {
  const { status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      toast.warning("Please sign in to access the AI Scheme Assistant.", {
        toastId: "assistant-auth-warning",
      });
      router.push("/login");
    }
  }, [sessionStatus, router]);

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
      <div className="max-w-3xl">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          🤖 AI Scheme Assistant
        </h1>

        <p className="mt-1.5 text-slate-500 text-sm">
          Answer a few questions about yourself and get personalized government scheme recommendations instantly.
        </p>
      </div>

      <div className="mt-6 max-w-4xl">
        <AssistantForm />
      </div>
    </main>
  );
}