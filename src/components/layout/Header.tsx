"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

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

        {/* Navigation links */}
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

        {/* Auth / Menu */}
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:flex flex-col items-end"
              >
                <p className="text-sm font-semibold text-slate-800 hover:text-emerald-700 transition-colors">
                  {session.user?.name}
                </p>
                <p className="text-xs text-slate-400">Dashboard</p>
              </Link>
              <Link
                href="/dashboard"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 border-2 border-slate-100 hover:border-emerald-500 transition-colors"
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
      </div>
    </header>
  );
}
