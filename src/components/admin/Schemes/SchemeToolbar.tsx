"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";
import {
  SCHEME_CATEGORIES,
  SCHEME_STATUS,
} from "@/constants/scheme";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function SchemeToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (
    key: string,
    value: string
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");

    router.push(`/admin/schemes?${params.toString()}`);
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="flex flex-1 flex-col gap-4 md:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              defaultValue={
                searchParams.get("search") ?? ""
              }
              placeholder="Search schemes..."
              onChange={(e) =>
                updateParam(
                  "search",
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-green-600"
            />
          </div>

          {/* Category */}
          <select
            defaultValue={
              searchParams.get("category") ?? ""
            }
            onChange={(e) =>
              updateParam(
                "category",
                e.target.value
              )
            }
            className="rounded-lg border border-slate-300 px-3 py-2.5"
          >
            <option value="">
              All Categories
            </option>

            {SCHEME_CATEGORIES.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            defaultValue={
              searchParams.get("status") ?? ""
            }
            onChange={(e) =>
              updateParam(
                "status",
                e.target.value
              )
            }
            className="rounded-lg border border-slate-300 px-3 py-2.5"
          >
            <option value="">
              All Status
            </option>

            {SCHEME_STATUS.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Right */}
        <Link
          href="/admin/schemes/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700"
        >
          <Plus size={18} />
          Add Scheme
        </Link>
      </div>
    </div>
  );
}