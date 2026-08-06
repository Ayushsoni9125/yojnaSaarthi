"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const isAdmin = (session?.user as any)?.role === "admin";
  const dashboardLink = isAdmin ? "/admin" : "/dashboard";
  const dashboardText = isAdmin ? "Admin Panel" : "Dashboard";

  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-md border-slate-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold animate-pulse"
            style={{
              background: "linear-gradient(135deg, #064e3b, #059669)",
            }}
          >
            य
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">
            YojanaSaarthi
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <Link
            href="/"
            className="hover:text-emerald-700 transition-colors font-semibold"
          >
            Schemes
          </Link>
          <Link
            href="/assistant"
            className="hover:text-emerald-700 transition-colors font-semibold"
          >
            AI Assistant
          </Link>
          <Link
            href="/compare"
            className="hover:text-emerald-700 transition-colors font-semibold"
          >
            Compare
          </Link>
        </nav>

        {/* Desktop Auth / Menu */}
        <div className="hidden md:flex items-center gap-4">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link href={dashboardLink} className="flex items-center gap-2.5 group">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 border-2 border-slate-100 group-hover:border-emerald-500 transition-colors"
                  style={{
                    background: "linear-gradient(135deg, #064e3b, #059669)",
                  }}
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-slate-400">{dashboardText}</p>
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors px-3 py-1.5"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 space-y-4 md:hidden animate-slide-down shadow-inner">
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors py-1.5"
            >
              🔍 Schemes
            </Link>
            <Link
              href="/assistant"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors py-1.5"
            >
              🤖 AI Assistant
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors py-1.5"
            >
              ⚖️ Compare
            </Link>
          </nav>

          <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
            {status === "loading" ? (
              <div className="h-9 w-full rounded bg-slate-100 animate-pulse" />
            ) : session ? (
              <div className="flex items-center justify-between">
                <Link
                  href={dashboardLink}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold border group-hover:border-emerald-500 transition-colors"
                    style={{
                      background: "linear-gradient(135deg, #064e3b, #059669)",
                    }}
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-slate-400">{dashboardText}</p>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
