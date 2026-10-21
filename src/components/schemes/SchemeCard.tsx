"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, Scale } from "lucide-react";
import {
  isSchemeBookmarked,
  addBookmarkLocal,
  removeBookmarkLocal,
  syncUserBookmarks,
} from "@/lib/bookmarks";

type SchemeCardProps = {
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

export default function SchemeCard({ scheme }: SchemeCardProps) {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [loading, setLoading] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Sync bookmarks state with local cache & server
  useEffect(() => {
    const updateBookmarkState = () => {
      setIsBookmarked(isSchemeBookmarked(scheme._id));
    };

    updateBookmarkState();

    if (sessionStatus === "authenticated") {
      syncUserBookmarks().then(updateBookmarkState);
    }

    window.addEventListener("bookmarks-updated", updateBookmarkState);
    return () => window.removeEventListener("bookmarks-updated", updateBookmarkState);
  }, [scheme._id, sessionStatus]);

  // Sync comparison state
  useEffect(() => {
    const checkCompared = () => {
      const stored = localStorage.getItem("compareList");
      if (stored) {
        try {
          const list = JSON.parse(stored);
          setIsCompared(list.some((item: any) => item._id === scheme._id));
        } catch {
          setIsCompared(false);
        }
      }
    };
    checkCompared();
    window.addEventListener("compare-list-updated", checkCompared);
    return () => window.removeEventListener("compare-list-updated", checkCompared);
  }, [scheme._id]);

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (sessionStatus === "unauthenticated") {
      toast.warning("Please log in to compare schemes.", {
        toastId: "compare-auth-warning",
      });
      router.push("/login");
      return;
    }

    const stored = localStorage.getItem("compareList") || "[]";
    let list = [];
    try {
      list = JSON.parse(stored);
    } catch {
      list = [];
    }

    const exists = list.some((item: any) => item._id === scheme._id);

    if (exists) {
      list = list.filter((item: any) => item._id !== scheme._id);
      localStorage.setItem("compareList", JSON.stringify(list));
      setIsCompared(false);
      window.dispatchEvent(new Event("compare-list-updated"));
      toast.info("Removed from comparison.");
    } else {
      if (list.length >= 3) {
        toast.warning("You can compare a maximum of 3 schemes.");
        return;
      }
      list.push({ _id: scheme._id, title: scheme.title });
      localStorage.setItem("compareList", JSON.stringify(list));
      setIsCompared(true);
      window.dispatchEvent(new Event("compare-list-updated"));
      toast.success("Added to comparison.");
    }
  };

  const handleBookmark = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (sessionStatus === "unauthenticated") {
      toast.warning("Please log in to bookmark schemes.", {
        toastId: "bookmark-auth-warning",
      });
      router.push("/login");
      return;
    }

    if (loading) return;

    const previousState = isBookmarked;
    const nextState = !previousState;

    // Optimistic UI update (Instagram-style instant toggle)
    setIsBookmarked(nextState);
    if (nextState) {
      addBookmarkLocal(scheme._id);
    } else {
      removeBookmarkLocal(scheme._id);
    }

    try {
      setLoading(true);

      if (nextState) {
        // Add bookmark
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schemeId: scheme._id }),
        });
        const data = await res.json();

        if (res.status === 401) {
          setIsBookmarked(previousState);
          removeBookmarkLocal(scheme._id);
          toast.warning("Please log in to bookmark schemes.");
          router.push("/login");
          return;
        }

        if (!res.ok && res.status !== 409) {
          // Rollback on unexpected error
          setIsBookmarked(previousState);
          removeBookmarkLocal(scheme._id);
          toast.error(data.message || "Failed to bookmark scheme.");
          return;
        }

        toast.success("Scheme bookmarked successfully.");
      } else {
        // Remove bookmark
        const res = await fetch(`/api/bookmarks?schemeId=${scheme._id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (res.status === 401) {
          setIsBookmarked(previousState);
          addBookmarkLocal(scheme._id);
          toast.warning("Please log in to bookmark schemes.");
          router.push("/login");
          return;
        }

        if (!res.ok && res.status !== 404) {
          // Rollback on unexpected error
          setIsBookmarked(previousState);
          addBookmarkLocal(scheme._id);
          toast.error(data.message || "Failed to remove bookmark.");
          return;
        }

        toast.info("Removed from bookmarks.");
      }
    } catch (error) {
      console.error(error);
      setIsBookmarked(previousState);
      if (previousState) {
        addBookmarkLocal(scheme._id);
      } else {
        removeBookmarkLocal(scheme._id);
      }
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/schemes/${scheme.slug}`}>
      <div className="relative h-full rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        {/* Header Row (Category, Status and Actions) */}
        <div className="mb-4 flex items-center justify-between gap-4">
          {/* Left: Tags */}
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 truncate max-w-[120px]">
              {scheme.category}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
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

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={handleCompareToggle}
              className={`rounded-full border p-2 text-xs transition duration-150 ${
                isCompared
                  ? "bg-emerald-50 border-emerald-300 text-emerald-600 hover:bg-emerald-100"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
              title={isCompared ? "Remove from Compare" : "Add to Compare"}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleBookmark}
              disabled={loading}
              className={`group/btn rounded-full border p-2 text-xs transition duration-200 disabled:opacity-50 ${
                isBookmarked
                  ? "bg-red-50 border-red-200 shadow-sm"
                  : "bg-white border-slate-200 hover:bg-slate-50 hover:border-red-200"
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Scheme"}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform duration-200 active:scale-125 ${
                  isBookmarked
                    ? "fill-red-500 text-red-500 scale-105"
                    : "text-slate-400 group-hover/btn:text-red-500"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-bold text-slate-900">
          {scheme.title}
        </h3>

        {/* Description */}
        <p className="mt-3 line-clamp-3 text-sm text-slate-600">
          {scheme.shortDescription}
        </p>

        {/* Ministry */}
        <div className="mt-5 border-t pt-3 text-xs text-slate-500">
          {scheme.ministry}
        </div>
      </div>
    </Link>
  );
}