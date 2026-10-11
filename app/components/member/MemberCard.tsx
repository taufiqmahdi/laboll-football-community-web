"use client";

import { useAuth } from "@/app/components/auth/AuthProvider";
import { BadgeCheck, Crown } from "@/app/components/icons";
import { daysBetween, formatDateLong, todayIso } from "@/app/lib/format";

// The digital member card. Members see theirs; everyone else sees a sample with their name on it.
export default function MemberCard() {
  const { user } = useAuth();
  const m = user?.membership ?? null;
  const active = Boolean(user?.isMember && m);
  const lapsed = Boolean(m && !user?.isMember);
  const daysLeft = active && m ? daysBetween(todayIso(), m.until) : null;

  return (
    <figure className="mx-auto w-full max-w-sm">
      <div
        className={`relative aspect-[1.586] overflow-hidden rounded-3xl p-5 text-white shadow-2xl shadow-blue-950/40 ring-1 ring-white/15 sm:p-6 ${
          lapsed ? "bg-slate-700" : "bg-linear-to-br from-slate-900 via-blue-950 to-blue-800"
        }`}
      >
        <span aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-white/5" />
        <span aria-hidden className="absolute -bottom-20 -left-10 size-56 rounded-full bg-white/5" />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="" className="size-7 rounded-full sm:size-8" />
              <span className="text-base font-extrabold tracking-tight sm:text-lg">LABOLL</span>
            </div>
            <span
              className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${
                active ? "bg-amber-400 text-amber-950" : "bg-white/15 text-white"
              }`}
            >
              {active ? <BadgeCheck className="size-3.5" /> : <Crown className="size-3.5" />}
              {active ? "MEMBER AKTIF" : lapsed ? "BERAKHIR" : "CONTOH"}
            </span>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.2em] text-white/60 uppercase">Nama member</p>
            <p className="truncate text-xl font-bold">{user?.name ?? "Nama Kamu"}</p>
            <div className="mt-3 flex items-end justify-between gap-3 text-xs">
              <div className="min-w-0">
                <p className="text-white/60">Member ID</p>
                <p className="font-mono text-sm font-semibold tracking-wider">{m?.id ?? "LBM-XXXX-XXXX"}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60">{lapsed ? "Berakhir" : "Berlaku s/d"}</p>
                <p className="text-sm font-semibold whitespace-nowrap">{m ? formatDateLong(m.until).replace(/^\w+, /, "") : "1 tahun"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-sm text-blue-100">
        {active && m
          ? `Member sejak ${formatDateLong(m.since)} · sisa ${daysLeft} hari`
          : lapsed
            ? "Aktifin lagi biar kartunya nyala lagi."
            : "Kartu ini muncul di akun kamu begitu jadi member."}
      </figcaption>
    </figure>
  );
}
