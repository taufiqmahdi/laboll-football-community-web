"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/components/auth/AuthProvider";
import {
  BadgeCheck,
  BadgePercent,
  CalendarDays,
  Camera,
  ChevronDown,
  Crown,
  LogOut,
  Menu,
  ShoppingBag,
  X,
  type LucideIcon,
} from "@/app/components/icons";
import type { User } from "@/app/lib/auth";

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
  const { user, openAuth, logout } = useAuth();
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
          <Link href="/" className="flex items-center gap-2 justify-self-start" aria-label="Laboll, ke beranda">
            <img src="/logo.svg" alt="" className="size-9 rounded-full" />
            <span className="text-xl font-extrabold tracking-tight text-slate-900">LABOLL</span>
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
            {user ? <UserMenu user={user} onLogout={logout} /> : <AuthButtons onOpen={openAuth} />}
          </div>

          {user && (
            <span className="ml-auto lg:hidden">
              <Initials user={user} />
            </span>
          )}

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
            <div className="mt-3 border-t border-slate-100 pt-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Initials user={user} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="size-4" />
                    Keluar
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <AuthButtons
                    onOpen={(mode) => {
                      setMenuOpen(false);
                      openAuth(mode);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function AuthButtons({ onOpen }: { onOpen: (mode: "login" | "register") => void }) {
  return (
    <>
      <button
        type="button"
        onClick={() => onOpen("login")}
        className="rounded-full border border-blue-500 px-5 py-2 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
      >
        Masuk
      </button>
      <button
        type="button"
        onClick={() => onOpen("register")}
        className="rounded-full bg-blue-500 px-5 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
      >
        Daftar
      </button>
    </>
  );
}

function Initials({ user }: { user: User }) {
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
      {initials}
    </span>
  );
}

function UserMenu({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-full py-1 pr-3 pl-1 transition hover:bg-slate-100"
      >
        <Initials user={user} />
        <span className="max-w-32 truncate text-sm font-semibold text-slate-800">{user.name.split(" ")[0]}</span>
        <ChevronDown className={`size-4 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200">
          <div className="px-3 py-2">
            <p className="truncate font-semibold text-slate-900">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
            {user.isMember ? (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                <BadgeCheck className="size-3.5" />
                Member Laboll
              </span>
            ) : (
              <span className="mt-2 inline-block text-xs text-slate-500">Belum member · diskon 10% nunggu kamu!</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="size-4" />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
