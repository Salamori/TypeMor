"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/type", label: "Type", icon: "⌨️" },
  { href: "/writing", label: "Writing", icon: "✍️" },
  { href: "/vocabulary", label: "Vocabulary", icon: "📖" },
  { href: "/achievements", label: "Achievements", icon: "🏆" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-900 bg-zinc-950 sticky top-0 z-40">
        <Link href="/" className="text-lg font-bold text-white tracking-tight">
          Type<span className="text-emerald-400">Mor</span>
        </Link>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="text-zinc-400 hover:text-white transition p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="sm:hidden border-b border-zinc-900 px-4 py-2 flex flex-col bg-zinc-950 sticky top-[49px] z-40">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-zinc-800 text-emerald-400"
                    : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden sm:flex flex-col w-56 shrink-0 border-r border-zinc-900 bg-zinc-950 min-h-screen sticky top-0 px-3 py-5">
        <Link href="/" className="text-lg font-bold text-white tracking-tight px-2 mb-6">
          Type<span className="text-emerald-400">Mor</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-zinc-800 text-emerald-400"
                    : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}