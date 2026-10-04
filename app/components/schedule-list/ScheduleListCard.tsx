import Link from "next/link";
import BrandAvatar from "@/app/components/BrandAvatar";
import { packageIcon } from "@/app/components/facilityIcons";
import { CalendarDays, Clock, MapPin, SoccerBall, SoccerGoal, Users } from "@/app/components/icons";
import type { Community, Schedule } from "@/app/data/schedules";
import { formatDate, formatRupiah } from "@/app/lib/format";

const MAX_FACILITY_ICONS = 4;

// Horizontal listing card for /schedule (photo left on sm+, stacked on phones).
export default function ScheduleListCard({ schedule: s, community }: { schedule: Schedule; community: Community }) {
  const left = s.slotsTotal - s.slotsFilled;
  const isFull = left <= 0;
  const CategoryIcon = s.category === "Football" ? SoccerBall : SoccerGoal;
  // "Starts from" uses the cheapest paid position; a free GK slot is called out separately.
  const lowestPrice = s.gkFee > 0 ? Math.min(s.playerFee, s.gkFee) : s.playerFee;
  const extraFacilities = s.includes.length - MAX_FACILITY_ICONS;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md sm:flex-row">
      {/* Thumbnail */}
      <div className="relative h-44 shrink-0 sm:h-auto sm:w-52">
        <img src={s.image} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent sm:bg-linear-to-r" />
        <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white">
          <CategoryIcon className="size-3.5" />
          {s.category}
        </span>
        <span
          className={`absolute bottom-3 left-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
            isFull ? "bg-red-500 text-white" : left <= 3 ? "bg-orange-400 text-orange-950" : "bg-white text-slate-800"
          }`}
        >
          <Users className="size-3.5" />
          {isFull ? "Penuh" : `Sisa ${left} slot`}
        </span>
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <BrandAvatar brand={community} size="xs" />
            <span className="truncate">{community.name}</span>
            <span aria-hidden>·</span>
            <span className="shrink-0">{s.activity}</span>
          </p>
          <h3 className="mt-1 text-lg leading-snug font-bold text-slate-900">{s.title}</h3>
        </div>

        <ul className="space-y-1 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-slate-400" />
            {formatDate(s.date)}
            <span className="text-slate-300">|</span>
            <Clock className="size-4 shrink-0 text-slate-400" />
            {s.startTime} – {s.endTime}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-slate-400" />
            <span className="truncate">{s.location}</span>
          </li>
        </ul>

        {/* Facilities as icons, full names on hover / for screen readers */}
        <ul className="flex flex-wrap items-center gap-1.5" aria-label="Fasilitas">
          {s.includes.slice(0, MAX_FACILITY_ICONS).map((item) => {
            const Icon = packageIcon(item);
            return (
              <li
                key={item}
                title={item}
                className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
              >
                <Icon className="size-3.5 text-blue-600" />
                {item}
              </li>
            );
          })}
          {extraFacilities > 0 && (
            <li className="text-xs font-semibold text-slate-500" title={s.includes.slice(MAX_FACILITY_ICONS).join(", ")}>
              +{extraFacilities} lagi
            </li>
          )}
        </ul>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-3">
          <div>
            <p className="text-xs text-slate-500">Mulai dari</p>
            <p className="text-lg font-extrabold text-slate-900">
              {formatRupiah(lowestPrice)}
              {s.gkFee === 0 && <span className="ml-1.5 text-xs font-semibold text-emerald-600">GK gratis</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/schedule/${s.id}`}
              className="rounded-full border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Detail
            </Link>
            {isFull ? (
              <span className="cursor-not-allowed rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">
                Penuh
              </span>
            ) : (
              <Link
                href={`/schedule/${s.id}/booking`}
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Booking
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
