import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, MapPin, SoccerBall, SoccerGoal, Users } from "@/app/components/icons";
import type { Community, Schedule } from "@/app/data/schedules";
import { formatDate } from "@/app/lib/format";

export default function ScheduleHero({ schedule: s, community }: { schedule: Schedule; community: Community }) {
  const isFull = s.slotsFilled >= s.slotsTotal;
  const CategoryIcon = s.category === "Football" ? SoccerBall : SoccerGoal;

  return (
    <section className="relative isolate overflow-hidden">
      <img src={s.image} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />

      <div className="mx-auto max-w-7xl px-4 pt-6 pb-24 md:px-8 md:pt-10 md:pb-28">
        <Link
          href="/#jadwal"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Balik ke jadwal
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-2 md:mt-12">
          <span className="flex items-center gap-1.5 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
            <CategoryIcon className="size-3.5" />
            {s.category}
          </span>
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              isFull ? "bg-red-500 text-white" : "bg-white text-slate-800"
            }`}
          >
            <Users className="size-3.5" />
            {s.slotsFilled}/{s.slotsTotal} slot {isFull ? "· penuh" : "terisi"}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur">
            {s.activity}
          </span>
        </div>

        <h1 className="mt-4 max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
          {s.title}
        </h1>
        <p className="mt-2 text-white/80">
          {s.activity} bareng <span className="font-semibold text-white">{community.name}</span> · {s.level}
        </p>

        <ul className="mt-6 flex flex-col gap-2 text-sm text-white/90 sm:flex-row sm:flex-wrap sm:gap-x-6">
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-blue-300" />
            {formatDate(s.date)}
          </li>
          <li className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-blue-300" />
            {s.startTime} – {s.endTime} WIB
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-blue-300" />
            {s.location}
          </li>
        </ul>
      </div>
    </section>
  );
}
