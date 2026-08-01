"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScrollText,
  Users,
  Bot,
  ChevronRight,
  Sparkles,
  Leaf,
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

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="relative flex flex-col w-64 min-h-screen"
      style={{
        background: "linear-gradient(160deg, #052e16 0%, #14532d 55%, #052e16 100%)",
        borderRight: "1px solid rgba(134,239,172,0.15)",
      }}
    >
      {/* Glow orb */}
      <div
        className="absolute top-0 left-0 w-full h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% -20%, rgba(22,163,74,0.28) 0%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <div className="relative px-6 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              boxShadow: "0 0 16px rgba(22,163,74,0.5)",
            }}
          >
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base leading-tight tracking-tight">
              YojanaSaarthi
            </h2>
            <p className="text-xs font-medium" style={{ color: "#86efac" }}>
              Admin Panel
            </p>
          </div>
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

      {/* Nav label */}
      <div className="px-6 mb-2">
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#4ade80" }}
        >
          Navigation
        </span>
      </div>

      {/* Nav Links */}
      <nav className="relative flex-1 px-3 space-y-1">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative"
              style={{
                background: active
                  ? "linear-gradient(135deg, rgba(22,163,74,0.28), rgba(21,128,61,0.18))"
                  : "transparent",
                border: active
                  ? "1px solid rgba(134,239,172,0.35)"
                  : "1px solid transparent",
              }}
            >
              {/* Active indicator bar */}
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                  style={{
                    background: "linear-gradient(180deg, #22c55e, #16a34a)",
                  }}
                />
              )}

              {/* Icon */}
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-all duration-200"
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
                  className="w-4 h-4 transition-colors duration-200"
                  style={{ color: active ? "#fff" : "#6ee7b7" }}
                />
              </span>

              {/* Label */}
              <span
                className="flex-1 text-sm font-medium transition-colors duration-200"
                style={{ color: active ? "#dcfce7" : "#6ee7b7" }}
              >
                {label}
              </span>

              {/* Arrow */}
              <ChevronRight
                className="w-3.5 h-3.5 transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0"
                style={{ color: "#22c55e" }}
              />
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="relative px-5 py-6">
        <div
          className="h-px w-full mb-4"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(134,239,172,0.4), transparent)",
          }}
        />
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(134,239,172,0.15)",
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #16a34a, #15803d)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Admin Mode</p>
            <p className="text-xs truncate" style={{ color: "#64748b" }}>
              Full access enabled
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}