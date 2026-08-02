"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("page", page.toString());

    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
      <button
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        className="rounded-lg border px-4 py-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      <p className="text-sm font-medium text-slate-700">
        Page {currentPage} of {totalPages}
      </p>

      <button
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="rounded-lg border px-4 py-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}