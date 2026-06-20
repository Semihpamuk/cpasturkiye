"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/ozellikler", label: "Özellikler" },
  { href: "/fiyatlandirma", label: "Fiyatlandırma" },
  { href: "/kurulum", label: "Kurulum" },
  { href: "/sss", label: "SSS" },
  { href: "/blog", label: "Blog" },
  { href: "/hakkimizda", label: "Hakkımızda" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 font-display text-lg font-bold text-white">
            J
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-ink-900">
            Jale
          </span>
          <span className="mt-1 hidden rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700 sm:inline-block">
            CPAS
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-600 transition-colors hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/iletisim"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:text-brand-600"
          >
            Sizi Arayalım
          </Link>
          <Link
            href="/satin-al"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md"
          >
            Satın Al
          </Link>
        </div>

        <button
          type="button"
          aria-label="Menüyü aç/kapat"
          aria-expanded={isOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-50 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-ink-100 bg-white px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/iletisim"
                className="rounded-lg border border-ink-300 px-4 py-2.5 text-center text-sm font-semibold text-ink-700"
                onClick={() => setIsOpen(false)}
              >
                Sizi Arayalım
              </Link>
              <Link
                href="/satin-al"
                className="rounded-lg bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                onClick={() => setIsOpen(false)}
              >
                Satın Al
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
