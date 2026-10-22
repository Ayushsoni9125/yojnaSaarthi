import { connectDB } from "@/lib/db/mongoose";
import { getSchemes } from "@/services/scheme.service";
import Pagination from "@/components/admin/Schemes/Pagination";
import SchemeTable from "@/components/admin/Schemes/SchemeTable";
import SchemeToolbar from "@/components/admin/Schemes/SchemeToolbar";

type Props = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    status?: string;
    state?: string;
    timeFrame?: string;
    sort?: string;
  }>;
};

export default async function SchemesPage({
  searchParams,
}: Props) {
  await connectDB();

  const params = await searchParams;

  const { schemes, pagination } = await getSchemes({
    page: Number(params.page ?? 1),
    limit: Number(params.limit ?? 10),
    search: params.search,
    category: params.category as any,
    status: params.status as any,
    state: params.state,
    timeFrame: params.timeFrame,
    sort: (params.sort as any) ?? "latest",
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Schemes
        </h1>

        <p className="mt-2 text-slate-500">
          Manage all government schemes from one place.
        </p>
      </div>

      <SchemeToolbar />

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <SchemeTable schemes={schemes} />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <p className="text-sm text-slate-600">
    Showing{" "}
    <span className="font-semibold">
      {schemes.length}
    </span>{" "}
    of{" "}
    <span className="font-semibold">
      {pagination.total}
    </span>{" "}
    schemes
  </p>

  <Pagination
  currentPage={pagination.page}
  totalPages={pagination.totalPages}
  basePath="/admin/schemes"
/>
</div>
    </div>
  );
}