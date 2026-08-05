import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12 text-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-emerald-600 font-extrabold text-7xl select-none">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            The page you are trying to visit does not exist or has been relocated.
            Verify the URL or return to home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
          >
            Go to Homepage
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
