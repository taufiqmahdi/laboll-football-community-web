import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, SoccerBall, SoccerGoal, Users } from "@/app/components/icons";
import StatusBadge from "@/app/components/tournament/StatusBadge";
import { themes } from "@/app/components/tournament/theme";
import type { Tournament } from "@/app/data/tournaments";
import { formatDayMonth } from "@/app/lib/format";

// Poster-style hero in the tournament's color; the stats strip overlaps its bottom edge.
export default function TournamentHero({ tournament: t }: { tournament: Tournament }) {
  const CategoryIcon = t.category === "Football" ? SoccerBall : SoccerGoal;

  return (
    <section className="relative isolate overflow-hidden">
      <img src={t.image} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
      <div className={`absolute inset-0 -z-10 bg-linear-to-t ${themes[t.theme].poster}`} />
      <div className="absolute inset-0 -z-10 bg-slate-950/30" />

      <div className="mx-auto max-w-7xl px-4 pt-6 pb-24 md:px-8 md:pt-10 md:pb-28">
        <Link
          href="/tournament"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Balik ke turnamen
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-2 md:mt-12">
          <StatusBadge status={t.status} />
          <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur">
            <CategoryIcon className="size-3.5" />
            {t.category}
          </span>
        </div>

        <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-white/80 uppercase sm:text-sm">{t.edition}</p>
        <h1 className="mt-1 max-w-3xl text-4xl leading-none font-black tracking-tight text-white uppercase italic sm:text-6xl">
          {t.name}
        </h1>

        <ul className="mt-6 flex flex-col gap-2 text-sm text-white/90 sm:flex-row sm:flex-wrap sm:gap-x-6">
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-white/70" />
            {formatDayMonth(t.startDate)} – {formatDayMonth(t.endDate)}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-white/70" />
            {t.location}
          </li>
          <li className="flex items-center gap-2">
            <Users className="size-4 shrink-0 text-white/70" />
            {t.teamsTotal} tim · {t.format}
          </li>
        </ul>
      </div>
    </section>
  );
}
