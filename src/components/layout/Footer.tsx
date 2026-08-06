"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-slate-600">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{
                  background: "linear-gradient(135deg, #064e3b, #059669)",
                }}
              >
                य
              </div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">
                YojanaSaarthi
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Empowering citizens by making central and state government schemes easily accessible, understandable, and comparable.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-700 transition-colors">
                  Explore Schemes
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-emerald-700 transition-colors">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-emerald-700 transition-colors">
                  Compare Schemes
                </Link>
              </li>
            </ul>
          </div>

          {/* User Account */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-emerald-700 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-emerald-700 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-700 transition-colors">
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} YojanaSaarthi. All rights reserved.</p>
          <p className="flex gap-4">
            <span>Built for Citizen Welfare</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
