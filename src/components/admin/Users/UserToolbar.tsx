"use client";

import { Search } from "lucide-react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function UserToolbar() {
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

    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search users..."
            defaultValue={
              searchParams.get("search") ?? ""
            }
            onChange={(e) =>
              updateParam(
                "search",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 outline-none focus:border-green-600"
          />
        </div>

        {/* Role Filter */}
        <select
          defaultValue={
            searchParams.get("role") ?? ""
          }
          onChange={(e) =>
            updateParam(
              "role",
              e.target.value
            )
          }
          className="rounded-lg border border-slate-300 px-3 py-2.5"
        >
          <option value="">
            All Roles
          </option>

          <option value="admin">
            Admin
          </option>

          <option value="user">
            User
          </option>
        </select>
      </div>
    </div>
  );
}