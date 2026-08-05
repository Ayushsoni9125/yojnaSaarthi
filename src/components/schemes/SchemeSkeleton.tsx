export default function SchemeSkeleton() {
  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse flex flex-col justify-between">
      <div>
        {/* Header tags placeholder */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="h-6 w-20 rounded-full bg-slate-200" />
          <div className="h-6 w-16 rounded-full bg-slate-200" />
        </div>

        {/* Title placeholder */}
        <div className="space-y-2 mt-2">
          <div className="h-5 w-3/4 rounded bg-slate-200" />
          <div className="h-5 w-1/2 rounded bg-slate-200" />
        </div>

        {/* Description placeholder */}
        <div className="space-y-2 mt-5">
          <div className="h-3.5 w-full rounded bg-slate-100" />
          <div className="h-3.5 w-full rounded bg-slate-100" />
          <div className="h-3.5 w-2/3 rounded bg-slate-100" />
        </div>
      </div>

      {/* Footer ministry placeholder */}
      <div className="mt-6 border-t border-slate-100 pt-3">
        <div className="h-3 w-1/3 rounded bg-slate-100" />
      </div>
    </div>
  );
}
