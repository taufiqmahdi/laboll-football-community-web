"use client";

import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Medal,
  SoccerBall,
  SoccerGoal,
  Timer,
  Trophy,
  Users,
} from "@/app/components/icons";
import StatusBadge from "@/app/components/tournament/StatusBadge";
import { medalColors, themes } from "@/app/components/tournament/theme";
import { totalPrize, type Tournament } from "@/app/data/tournaments";
import { daysBetween, formatDayMonth, formatJuta, formatRupiah } from "@/app/lib/format";
import { useToday } from "@/app/lib/useToday";

// overflow-clip (not hidden) because the notches overhang: a hidden-overflow box can still be scrolled sideways by focus.
// Unlike hidden, clip doesn't let a grid/flex item shrink below its content, so the card also carries min-w-0
// (otherwise the truncated location line sets a minimum width wider than a phone).
const tones = {
  dark: { card: "shadow-xl shadow-black/30", notch: "bg-slate-950" },
  light: { card: "shadow-lg shadow-slate-900/10 transition hover:shadow-xl hover:shadow-slate-900/15", notch: "bg-slate-50" },
};

/*
 * Ticket-style card: a colored "poster" stub and a details half, split by a dashed
 * tear line with notches punched out. Stacked on phones and at lg (two cards side by
 * side are too narrow to split), horizontal at sm–md and xl+.
 * `tone` is the background the card sits on (the notches are painted that color);
 * the caller sets width/visibility via className, which must include a display class.
 */
export default function TournamentCard({
  tournament: t,
  className,
  tone,
}: {
  tournament: Tournament;
  className: string;
  tone: "dark" | "light";
}) {
  const today = useToday();
  const theme = themes[t.theme];
  const CategoryIcon = t.category === "Football" ? SoccerBall : SoccerGoal;
  const daysLeft = today && t.status === "open" ? daysBetween(today, t.registrationDate) : null;

  return (
    <article
      className={`relative min-w-0 flex-col overflow-clip rounded-3xl bg-white sm:flex-row lg:flex-col xl:flex-row ${tones[tone].card} ${className}`}
    >
      {/* Poster stub */}
      <div className="relative h-56 shrink-0 sm:h-auto sm:w-2/5 lg:h-56 lg:w-auto xl:h-auto xl:w-2/5">
        <img src={t.image} alt={t.name} className="absolute inset-0 size-full object-cover" />
        <div className={`absolute inset-0 bg-linear-to-t ${theme.poster}`} />

        <div className="relative flex h-full min-h-56 flex-col justify-between p-5 text-white">
          <StatusBadge status={t.status} />

          <div>
            <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
              <Trophy className="size-6" />
            </div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-white/80 uppercase">{t.edition}</p>
            <h3 className="mt-1 text-2xl leading-none font-black tracking-tight uppercase italic">{t.name}</h3>
            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur">
              <CategoryIcon className="size-3.5" />
              {t.category}
            </span>
          </div>
        </div>
      </div>

      {/* Details, with the tear line + notches on the edge facing the poster */}
      <div className="relative flex flex-1 flex-col gap-4 border-t-2 border-dashed border-slate-200 p-5 sm:border-t-0 sm:border-l-2 lg:border-t-2 lg:border-l-0 xl:border-t-0 xl:border-l-2">
        {/* Notches sit 13px out on the tear-line axis (12px radius + half the 2px dashed border) so they centre on the line */}
        <span
          aria-hidden
          className={`absolute -top-[13px] -left-3 size-6 rounded-full sm:-top-3 sm:-left-[13px] lg:-top-[13px] lg:-left-3 xl:-top-3 xl:-left-[13px] ${tones[tone].notch}`}
        />
        <span
          aria-hidden
          className={`absolute -top-[13px] -right-3 size-6 rounded-full sm:top-auto sm:right-auto sm:-bottom-3 sm:-left-[13px] lg:-top-[13px] lg:-right-3 lg:bottom-auto lg:left-auto xl:top-auto xl:right-auto xl:-bottom-3 xl:-left-[13px] ${tones[tone].notch}`}
        />

        {/* Prize */}
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Total hadiah</p>
          <p className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-3xl font-black text-transparent">
            Rp {formatJuta(totalPrize(t))}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {t.prizes.map((prize, i) => (
              <span
                key={i}
                className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700"
              >
                <Medal className={`size-3.5 ${medalColors[i]}`} />
                Juara {i + 1} · {formatJuta(prize, true)}
              </span>
            ))}
          </div>
        </div>

        {/* Info */}
        <ul className="space-y-1.5 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" />
            {formatDayMonth(t.startDate)} – {formatDayMonth(t.endDate)}
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />
            <span className="truncate">{t.location}</span>
          </li>
          <li className="flex items-start gap-2">
            <Users className="mt-0.5 size-4 shrink-0 text-slate-400" />
            {t.teamsTotal} tim · {t.format}
          </li>
        </ul>

        {/* Team slots: one block per team */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">Slot tim</span>
            <span className="font-bold text-slate-900">
              {t.teamsRegistered}/{t.teamsTotal} terisi
            </span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: t.teamsTotal }, (_, i) => (
              <span
                key={i}
                className={`h-2.5 flex-1 rounded-sm ${i < t.teamsRegistered ? theme.slot : "bg-slate-200"}`}
              />
            ))}
          </div>
        </div>

        {/* Fee + deadline */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs text-slate-500">Biaya daftar</p>
            <p className="font-bold text-slate-900">
              {formatRupiah(t.entryFee)}
              <span className="text-xs font-medium text-slate-500">/tim</span>
            </p>
          </div>
          {t.status !== "full" && (
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                t.status === "open" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
              }`}
            >
              <Timer className="size-3.5" />
              {t.status === "open" ? "Tutup" : "Buka"} {formatDayMonth(t.registrationDate)}
              {daysLeft !== null && daysLeft >= 0 && ` · ${daysLeft === 0 ? "hari ini!" : `${daysLeft} hari lagi`}`}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/tournament/${t.id}`}
            className="rounded-full border border-blue-500 py-2.5 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Lihat Detail
          </Link>
          {t.status === "open" ? (
            <Link
              href={`/tournament/${t.id}/register`}
              className="rounded-full bg-blue-500 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Daftar Tim
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-full bg-slate-200 py-2.5 text-center text-sm font-semibold text-slate-500">
              {t.status === "soon" ? "Segera Dibuka" : "Slot Penuh"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
