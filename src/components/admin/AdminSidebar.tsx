"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ScrollText,
  History,
  Users,
  Bot,
  ChevronRight,
  Sparkles,
  Leaf,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Schemes",
    href: "/admin/schemes",
    icon: ScrollText,
  },
  {
    label: "Activity",
    href: "/admin/activity",
    icon: History,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Scraper",
    href: "/admin/scraper",
    icon: Bot,
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="relative flex h-full flex-col">
      {/* Glow orb */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-64 w-full"
        style={{
          background:
            "radial-gradient(ellipse at 50% -20%, rgba(22,163,74,0.28) 0%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <div className="relative px-6 pb-6 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                boxShadow: "0 0 16px rgba(22,163,74,0.5)",
              }}
            >
              <Leaf className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="text-base font-bold leading-tight tracking-tight text-white">
                YojanaSaarthi
              </h2>

              <p
                className="text-xs font-medium"
                style={{ color: "#86efac" }}
              >
                Admin Panel
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-green-300 hover:bg-white/10 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div
          className="mt-6 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(134,239,172,0.4), transparent)",
          }}
        />
      </div>

      {/* Navigation Label */}
      <div className="mb-2 px-6">
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#4ade80" }}
        >
          Navigation
        </span>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 space-y-1 px-3">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(href, exact);

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200"
              style={{
                background: active
                  ? "linear-gradient(135deg, rgba(22,163,74,0.28), rgba(21,128,61,0.18))"
                  : "transparent",
                border: active
                  ? "1px solid rgba(134,239,172,0.35)"
                  : "1px solid transparent",
              }}
            >
              {/* Active Indicator */}
              {active && (
                <span
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full"
                  style={{
                    background: "linear-gradient(180deg, #22c55e, #16a34a)",
                  }}
                />
              )}

              {/* Icon */}
              <span
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200"
                style={{
                  background: active
                    ? "linear-gradient(135deg, #16a34a, #15803d)"
                    : "rgba(255,255,255,0.05)",
                  boxShadow: active
                    ? "0 0 10px rgba(22,163,74,0.45)"
                    : "none",
                }}
              >
                <Icon
                  className="h-4 w-4 transition-colors duration-200"
                  style={{
                    color: active ? "#fff" : "#6ee7b7",
                  }}
                />
              </span>

              {/* Label */}
              <span
                className="flex-1 text-sm font-medium transition-colors duration-200"
                style={{
                  color: active ? "#dcfce7" : "#6ee7b7",
                }}
              >
                {label}
              </span>

              {/* Arrow */}
              <ChevronRight
                className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                style={{ color: "#22c55e" }}
              />
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="relative px-5 py-6">
        <div
          className="mb-4 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(134,239,172,0.4), transparent)",
          }}
        />

        <div
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(134,239,172,0.15)",
          }}
        >
          <div
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(135deg, #16a34a, #15803d)",
            }}
          >
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">
              Admin Mode
            </p>

            <p
              className="truncate text-xs"
              style={{ color: "#64748b" }}
            >
              Full access enabled
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-3 flex w-full items-center gap-3 rounded-xl border border-red-500/20 bg-red-950/10 hover:bg-red-950/30 px-3 py-2.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors duration-150"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Mobile top bar ───────────────────────────────── */}
      <div
        className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center gap-3 px-4 lg:hidden"
        style={{
          background: "linear-gradient(160deg, #052e16 0%, #14532d 100%)",
          borderBottom: "1px solid rgba(134,239,172,0.15)",
        }}
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-1.5 text-green-300 hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              boxShadow: "0 0 10px rgba(22,163,74,0.4)",
            }}
          >
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            YojanaSaarthi
          </span>
        </div>
      </div>

      {/* ── Mobile overlay backdrop ──────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ───────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background:
            "linear-gradient(160deg, #052e16 0%, #14532d 55%, #052e16 100%)",
          borderRight: "1px solid rgba(134,239,172,0.15)",
        }}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* ── Desktop sidebar ─────────────────────────────── */}
      <aside
        className="relative hidden min-h-screen w-64 flex-col lg:flex"
        style={{
          background:
            "linear-gradient(160deg, #052e16 0%, #14532d 55%, #052e16 100%)",
          borderRight: "1px solid rgba(134,239,172,0.15)",
        }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}