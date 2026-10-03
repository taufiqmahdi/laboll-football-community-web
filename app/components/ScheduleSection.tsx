"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import CommunityAvatar from "@/app/components/CommunityAvatar";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  LayoutGrid,
  MapPin,
  SoccerBall,
  SoccerGoal,
  Users,
  type LucideIcon,
} from "@/app/components/icons";
import {
  communities,
  communityById,
  schedules,
  sportCategories,
  type Community,
  type Schedule,
  type SportCategory,
} from "@/app/data/schedules";
import { formatDate, formatRupiah, isInSameWeek, todayIso } from "@/app/lib/format";

const noopSubscribe = () => () => {};

// "Today" only exists in the browser; the server render gets null so hydration matches.
function useToday() {
  return useSyncExternalStore(noopSubscribe, todayIso, () => null);
}

const categoryIcon: Record<SportCategory, LucideIcon> = {
  Football: SoccerBall,
  "Mini Soccer": SoccerGoal,
};

const categoryOptions: { value: SportCategory | "all"; label: string; Icon: LucideIcon }[] = [
  { value: "all", label: "Semua", Icon: LayoutGrid },
  ...sportCategories.map((c) => ({ value: c, label: c, Icon: categoryIcon[c] })),
];

export default function ScheduleSection() {
  const [community, setCommunity] = useState<string | null>(null);
  const [category, setCategory] = useState<SportCategory | "all">("all");
  const today = useToday();

  const filtered = schedules.filter(
    (s) => (!community || s.communityId === community) && (category === "all" || s.category === category),
  );
  const thisWeekCount = today ? schedules.filter((s) => isInSameWeek(s.date, today)).length : null;

  return (
    <section id="jadwal" className="w-full bg-slate-50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Heading */}
        <div className="flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <CalendarDays className="size-7" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">Yuk, Cari Jadwal Main!</h2>
          <p className="mt-2 max-w-xl text-slate-600">
            Pilih jadwal dari komunitas partner kita, amankan slotmu, terus tinggal dateng dan main bareng. Gampang,
            kan?
          </p>
        </div>

        {/* Community picker (single choice, nothing picked = all communities) */}
        <div className="mt-10 text-center">
          <p className="mb-4 text-sm font-semibold text-slate-500">Mau main bareng komunitas mana?</p>
          <div
            role="radiogroup"
            aria-label="Pilih komunitas"
            className="flex flex-wrap justify-center gap-x-4 gap-y-5 sm:gap-x-8"
          >
            {communities.map((c) => (
              <CommunityOption
                key={c.id}
                community={c}
                checked={community === c.id}
                dimmed={community !== null && community !== c.id}
                onSelect={() => setCommunity(community === c.id ? null : c.id)}
              />
            ))}
          </div>
          <p className="mt-4 h-5 text-sm text-slate-500">
            {community ? (
              <>
                Lagi lihat jadwal <span className="font-semibold text-slate-700">{communityById[community].name}</span>{" "}
                ·{" "}
                <button
                  type="button"
                  onClick={() => setCommunity(null)}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Lihat semua aja
                </button>
              </>
            ) : (
              "Lagi nampilin jadwal dari semua komunitas"
            )}
          </p>
        </div>

        {/* Category filter */}
        <div className="mt-6 text-center">
          <p className="mb-3 text-sm font-semibold text-slate-500">Mau main apa hari ini?</p>
          <div className="inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
            {categoryOptions.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition sm:px-5 ${
                  category === value ? "bg-blue-500 text-white" : "text-slate-600 hover:text-blue-600"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {filtered.length > 0 ? (
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {filtered.map((s) => (
              <ScheduleCard key={s.id} schedule={s} community={communityById[s.communityId]} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            Belum ada jadwal, nih.
          </div>
        )}

        {/* See all */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <Link
            href="/schedule"
            className="flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600"
          >
            Lihat Semua Jadwal
            <ArrowRight className="size-5" />
          </Link>
          <p className="h-5 text-sm text-slate-600">
            {thisWeekCount === null ? null : thisWeekCount > 0 ? (
              <>
                Minggu ini ada <span className="font-bold text-blue-600">{thisWeekCount} jadwal</span> seru yang bisa
                kamu ikutin!
              </>
            ) : (
              "Minggu ini belum ada jadwal, nih. Cek lagi nanti, ya!"
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

function CommunityOption({
  community,
  checked,
  dimmed,
  onSelect,
}: {
  community: Community;
  checked: boolean;
  dimmed: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      title={community.name}
      onClick={onSelect}
      className={`group flex w-16 flex-col items-center gap-2 transition sm:w-20 ${dimmed ? "opacity-50 hover:opacity-100" : ""}`}
    >
      <span
        className={`relative rounded-full transition group-hover:scale-105 ${
          checked ? "ring-4 ring-blue-500 ring-offset-3 ring-offset-slate-50" : ""
        }`}
      >
        <CommunityAvatar community={community} size="lg" />
        {checked && (
          <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border-2 border-slate-50 bg-blue-500 text-white">
            <Check className="size-3" strokeWidth={3} />
          </span>
        )}
      </span>
      <span
        className={`text-xs leading-tight ${checked ? "font-bold text-blue-600" : "font-medium text-slate-600"}`}
      >
        {community.name}
      </span>
    </button>
  );
}

function ScheduleCard({ schedule: s, community }: { schedule: Schedule; community: Community }) {
  const percent = Math.round((s.slotsFilled / s.slotsTotal) * 100);
  const isFull = s.slotsFilled >= s.slotsTotal;
  const almostFull = !isFull && percent >= 80;
  const CategoryIcon = categoryIcon[s.category];

  return (
    <article className="flex w-full flex-col overflow-hidden sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      {/* Thumbnail with schedule info */}
      <div className="relative h-52">
        <img src={s.image} alt={`${community.name} ${s.category}`} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          <span className="flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
            <CategoryIcon className="size-3.5" />
            {s.category}
          </span>
          <span
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              isFull ? "bg-red-500 text-white" : "bg-white/90 text-slate-800"
            }`}
          >
            <Users className="size-3.5" />
            {s.slotsFilled}/{s.slotsTotal} slot
          </span>
        </div>

        <div className="absolute inset-x-3 bottom-3 space-y-1 text-white">
          <p className="flex items-center gap-1.5 text-sm font-bold">
            <CalendarDays className="size-4" />
            {formatDate(s.date)}
          </p>
          <p className="flex items-center gap-1.5 text-xs">
            <Clock className="size-4" />
            {s.startTime} – {s.endTime} WIB
          </p>
          <p className="flex items-center gap-1.5 text-xs">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{s.location}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Community */}
        <div className="flex items-center gap-3">
          <CommunityAvatar community={community} />
          <div>
            <p className="font-bold text-slate-900">{community.name}</p>
            <p className="text-xs text-slate-500">Partner komunitas kita</p>
          </div>
        </div>

        {/* Fees */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Player</p>
            <p className="font-bold text-slate-900">{formatRupiah(s.playerFee)}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Kiper (GK)</p>
            <p className="font-bold text-slate-900">{formatRupiah(s.gkFee)}</p>
          </div>
        </div>

        {/* Included */}
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-500">Udah termasuk</p>
          <div className="flex flex-wrap gap-1.5">
            {s.includes.map((item) => (
              <span
                key={item}
                className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
              >
                <Check className="size-3" strokeWidth={3} />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Booking progress */}
        <div className="mt-auto">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">
              {isFull ? "Yah, udah penuh" : almostFull ? "Hampir penuh, buruan!" : "Slot terisi"}
            </span>
            <span className="font-bold text-slate-900">{percent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${isFull ? "bg-red-500" : almostFull ? "bg-orange-500" : "bg-blue-500"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/schedule/${s.id}`}
            className="rounded-full border border-blue-500 py-2.5 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Lihat Detail
          </Link>
          {isFull ? (
            <span className="cursor-not-allowed rounded-full bg-slate-200 py-2.5 text-center text-sm font-semibold text-slate-500">
              Udah Penuh
            </span>
          ) : (
            <Link
              href={`/schedule/${s.id}/booking`}
              className="rounded-full bg-blue-500 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Ikutan Main
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
