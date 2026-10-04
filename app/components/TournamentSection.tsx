"use client";

import { useState } from "react";
import Link from "next/link";
import {
  EmptyState,
  Section,
  SectionHeading,
  SeeAllLink,
  SegmentedFilter,
  SwipeRow,
} from "@/app/components/SectionTemplate";
import {
  CalendarDays,
  LayoutGrid,
  MapPin,
  Medal,
  SoccerBall,
  SoccerGoal,
  Ticket,
  Timer,
  Trophy,
  Users,
  type LucideIcon,
} from "@/app/components/icons";
import {
  totalPrize,
  tournaments,
  type Tournament,
  type TournamentStatus,
  type TournamentTheme,
} from "@/app/data/tournaments";
import { daysBetween, formatDayMonth, formatJuta, formatRupiah } from "@/app/lib/format";
import { useToday } from "@/app/lib/useToday";

const statusOptions: { value: TournamentStatus | "all"; label: string; Icon: LucideIcon }[] = [
  { value: "all", label: "Semua", Icon: LayoutGrid },
  { value: "open", label: "Buka", Icon: Ticket },
  { value: "soon", label: "Segera", Icon: Timer },
];

// Poster overlay + slot fill per tournament color.
const themes: Record<TournamentTheme, { poster: string; slot: string }> = {
  blue: { poster: "from-blue-700/95 via-blue-700/60 to-blue-950/10", slot: "bg-blue-500" },
  emerald: { poster: "from-emerald-700/95 via-emerald-700/60 to-emerald-950/10", slot: "bg-emerald-500" },
  orange: { poster: "from-orange-600/95 via-orange-600/60 to-orange-950/10", slot: "bg-orange-500" },
  violet: { poster: "from-violet-700/95 via-violet-700/60 to-violet-950/10", slot: "bg-violet-500" },
};

const medalColors = ["text-amber-500", "text-slate-400", "text-orange-700"];

// Swipe row below lg; from lg up only the first two show, side by side.
const cardVisibility = (i: number) => (i < 2 ? "flex" : "flex lg:hidden");

export default function TournamentSection() {
  const [status, setStatus] = useState<TournamentStatus | "all">("all");

  const filtered = tournaments.filter((t) => status === "all" || t.status === status);
  const openCount = tournaments.filter((t) => t.status === "open").length;

  return (
    <Section id="turnamen" tone="dark">
      <SectionHeading
        Icon={Trophy}
        title="Siap Angkat Piala?"
        subtitle="Kumpulin timmu, daftar turnamen, terus rebut hadiahnya. Nggak harus jago, yang penting kompak!"
      />

      <div className="mt-10 text-center">
        <p className="mb-3 text-sm font-semibold text-slate-400">Mau ikut yang mana?</p>
        <SegmentedFilter options={statusOptions} value={status} onChange={setStatus} />
      </div>

      {filtered.length > 0 ? (
        <SwipeRow hint="Geser buat lihat turnamen lainnya →" count={filtered.length}>
          {filtered.map((t, i) => (
            <TournamentCard key={t.id} tournament={t} className={cardVisibility(i)} />
          ))}
        </SwipeRow>
      ) : (
        <EmptyState>Belum ada turnamen, nih.</EmptyState>
      )}

      <SeeAllLink
        href="/tournament"
        label="Lihat Semua Turnamen"
        note={
          <>
            <span className="font-bold text-blue-300">{openCount} turnamen</span> lagi buka pendaftaran. Gas ajak
            timmu!
          </>
        }
      />
    </Section>
  );
}

/*
 * Ticket-style card: a colored "poster" stub and a details half, split by a dashed
 * tear line with notches punched out. Stacked on phones and at lg (two cards side by
 * side are too narrow to split), horizontal at sm–md and xl+.
 */
function TournamentCard({ tournament: t, className }: { tournament: Tournament; className: string }) {
  const today = useToday();
  const theme = themes[t.theme];
  const CategoryIcon = t.category === "Football" ? SoccerBall : SoccerGoal;
  const daysLeft = today && t.status === "open" ? daysBetween(today, t.registrationDate) : null;

  return (
    <article
      className={`relative w-[88%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/30 sm:w-[85%] sm:flex-row md:w-[78%] lg:w-[calc(50%-12px)] lg:flex-col xl:flex-row ${className}`}
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
        <span aria-hidden className="absolute -top-3 -left-3 size-6 rounded-full bg-slate-950" />
        <span
          aria-hidden
          className="absolute -top-3 -right-3 size-6 rounded-full bg-slate-950 sm:top-auto sm:right-auto sm:-bottom-3 sm:-left-3 lg:-top-3 lg:-right-3 lg:bottom-auto lg:left-auto xl:top-auto xl:right-auto xl:-bottom-3 xl:-left-3"
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
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-slate-400" />
            {formatDayMonth(t.startDate)} – {formatDayMonth(t.endDate)}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-slate-400" />
            <span className="truncate">{t.location}</span>
          </li>
          <li className="flex items-center gap-2">
            <Users className="size-4 shrink-0 text-slate-400" />
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

function StatusBadge({ status }: { status: TournamentStatus }) {
  if (status === "open") {
    return (
      <span className="flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        Pendaftaran dibuka
      </span>
    );
  }
  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
        status === "soon" ? "bg-amber-300 text-amber-950" : "bg-slate-900/80 text-white"
      }`}
    >
      {status === "soon" ? "Segera dibuka" : "Slot penuh"}
    </span>
  );
}
