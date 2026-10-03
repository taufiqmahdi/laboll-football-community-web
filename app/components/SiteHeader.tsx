"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgePercent,
  CalendarDays,
  Camera,
  Crown,
  Menu,
  ShoppingBag,
  X,
  type LucideIcon,
} from "@/app/components/icons";

const announcements: { text: string; Icon: LucideIcon }[] = [
  { text: "Member dapet diskon 10% buat semua pertandingan", Icon: BadgePercent },
  { text: "Jadi member cuma Rp 100.000 setahun, murah banget!", Icon: Crown },
  { text: "Jadwal baru tiap minggu, jangan sampai kehabisan slot", Icon: CalendarDays },
  { text: "Tiap game ada foto & video, siap buat feed kamu", Icon: Camera },
  { text: "Diskon 10% juga buat semua merchandise", Icon: ShoppingBag },
];

const navLinks = [
  { href: "/schedule", label: "Jadwal" },
  { href: "/news", label: "Berita" },
  { href: "/gallery", label: "Galeri" },
  { href: "/merchants", label: "Merchant" },
  { href: "/merchandise", label: "Merchandise" },
  { href: "/tournament", label: "Turnamen" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Running text */}
      <div className="marquee w-full overflow-hidden bg-blue-600 py-2 text-xs font-medium text-white sm:text-sm">
        <div className="marquee-track flex w-max">
          {[...announcements, ...announcements].map(({ text, Icon }, i) => (
            <div key={i} aria-hidden={i >= announcements.length} className="flex items-center gap-2 whitespace-nowrap pr-12">
              <Icon className="size-4 shrink-0 text-blue-200" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <Link href="/" className="flex items-center gap-2 justify-self-start" aria-label="Blaks, ke beranda">
            <img src="/logo.svg" alt="" className="size-9 rounded-full" />
            <span className="text-xl font-extrabold tracking-tight text-slate-900">BLAKS</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive(link.href) ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 justify-self-end lg:flex">
            <AuthButtons />
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            className="flex size-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 lg:hidden"
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-full border-b border-slate-200 bg-white px-4 pt-2 pb-4 shadow-lg lg:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`block rounded-xl px-4 py-3 font-semibold transition ${
                      isActive(link.href) ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
              <AuthButtons onNavigate={() => setMenuOpen(false)} />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function AuthButtons({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <Link
        href="/login"
        onClick={onNavigate}
        className="rounded-full border border-blue-500 px-5 py-2 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
      >
        Masuk
      </Link>
      <Link
        href="/register"
        onClick={onNavigate}
        className="rounded-full bg-blue-500 px-5 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
      >
        Daftar
      </Link>
    </>
  );
}
