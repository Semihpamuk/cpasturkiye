"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "/ozellikler", label: "Hizmet" },
  { href: "/kurulum", label: "Süreç" },
  { href: "/fiyatlandirma", label: "Fiyatlandırma" },
  { href: "/sss", label: "SSS" },
  { href: "/blog", label: "Blog" },
  { href: "/hakkimizda", label: "Hakkımızda" },
];

// Kaç piksel kaydırınca navbar "katı" (beyaz) moduna geçer.
const SCROLL_THRESHOLD = 24;

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Yalnızca ana sayfada koyu hero var — orada en üstte şeffaf dururuz.
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menü açıkken de katı zemin kullanılır (açılır panel beyaz).
  const transparent = isHome && !scrolled && !isOpen;

  const linkClass = transparent
    ? "text-sm font-medium text-white/85 transition-colors hover:text-white"
    : "text-sm font-medium text-ink-600 transition-colors hover:text-brand-600";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-ink-100 bg-white/90 shadow-sm backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="Ana sayfa">
          <Logo className="text-2xl" onLight={!transparent} />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/iletisim"
            className={
              transparent
                ? "rounded-lg px-4 py-2 text-sm font-semibold text-white/90 transition-colors hover:text-white"
                : "rounded-lg px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:text-brand-600"
            }
          >
            Sizi Arayalım
          </Link>
          <Link
            href="/satin-al"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md"
          >
            Hemen Başla
          </Link>
        </div>

        <button
          type="button"
          aria-label="Menüyü aç/kapat"
          aria-expanded={isOpen}
          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors lg:hidden ${
            transparent
              ? "text-white hover:bg-white/10"
              : "text-ink-700 hover:bg-ink-50"
          }`}
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
                Hemen Başla
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
