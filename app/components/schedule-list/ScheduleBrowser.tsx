"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FilterPill, SegmentedFilter } from "@/app/components/SectionTemplate";
import ScheduleListCard from "@/app/components/schedule-list/ScheduleListCard";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  MapPin,
  Navigation,
  RotateCcw,
  SoccerBall,
  SoccerGoal,
  Swords,
  X,
} from "@/app/components/icons";
import { getVenue, mapsLink } from "@/app/data/scheduleDetails";
import {
  activities,
  communityById,
  schedulesByDate,
  sportCategories,
  type Schedule,
} from "@/app/data/schedules";
import { addDays, dateParts, formatDate } from "@/app/lib/format";
import { filtersToQuery, venueSlug, WINDOW_DAYS, type Filters, type View } from "@/app/lib/scheduleFilters";

const viewOptions: { value: View; label: string; Icon: typeof CalendarDays }[] = [
  { value: "tanggal", label: "Per tanggal", Icon: CalendarDays },
  { value: "venue", label: "Per venue", Icon: MapPin },
];

export default function ScheduleBrowser({ today, initialFilters }: { today: string; initialFilters: Filters }) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const set = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));

  // Keep the URL shareable without triggering a server round trip.
  useEffect(() => {
    window.history.replaceState(null, "", `${window.location.pathname}${filtersToQuery(filters)}`);
  }, [filters]);

  const lastDay = addDays(today, WINDOW_DAYS - 1);
  const upcoming = schedulesByDate.filter((s) => s.date >= today && s.date <= lastDay);
  const matching = upcoming.filter(
    (s) =>
      (filters.category === "all" || s.category === filters.category) &&
      (filters.activity === "all" || s.activity === filters.activity),
  );

  const days = Array.from({ length: WINDOW_DAYS }, (_, i) => addDays(today, i));
  const countByDate = countBy(matching, (s) => s.date);

  const venues = [...new Map(upcoming.map((s) => [venueSlug(s.location), s])).entries()]
    .map(([slug, s]) => ({ slug, venue: getVenue(s) }))
    .sort((a, b) => a.venue.name.localeCompare(b.venue.name));
  const countByVenue = countBy(matching, (s) => venueSlug(s.location));

  const results = matching.filter((s) =>
    filters.view === "tanggal"
      ? !filters.date || s.date === filters.date
      : !filters.venue || venueSlug(s.location) === filters.venue,
  );
  const groups =
    filters.view === "tanggal"
      ? groupBy(results, (s) => s.date)
      : groupBy(results, (s) => venueSlug(s.location)).sort((a, b) =>
          getVenue(a.items[0]).name.localeCompare(getVenue(b.items[0]).name),
        );

  const selectedVenue = venues.find((v) => v.slug === filters.venue)?.venue;
  const activeChips: { label: string; clear: () => void }[] = [
    filters.category !== "all" && { label: filters.category, clear: () => set({ category: "all" }) },
    filters.activity !== "all" && { label: filters.activity, clear: () => set({ activity: "all" }) },
    filters.view === "tanggal" &&
      filters.date && { label: formatDate(filters.date), clear: () => set({ date: null }) },
    filters.view === "venue" &&
      selectedVenue && { label: selectedVenue.name, clear: () => set({ venue: null }) },
  ].filter((c): c is { label: string; clear: () => void } => Boolean(c));

  const resetAll = () => setFilters({ category: "all", activity: "all", view: filters.view, date: null, venue: null });

  return (
    <div className="flex flex-col gap-6">
      {/* ---------- Filters ---------- */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:flex-wrap lg:items-end lg:gap-x-10">
          <FilterGroup label="Kategori">
            <FilterPill active={filters.category === "all"} onClick={() => set({ category: "all" })} icon={<LayoutGrid />}>
              Semua
            </FilterPill>
            {sportCategories.map((c) => (
              <FilterPill
                key={c}
                active={filters.category === c}
                onClick={() => set({ category: c })}
                icon={c === "Football" ? <SoccerBall /> : <SoccerGoal />}
              >
                {c}
              </FilterPill>
            ))}
          </FilterGroup>

          <FilterGroup label="Jenis main">
            <FilterPill active={filters.activity === "all"} onClick={() => set({ activity: "all" })} icon={<LayoutGrid />}>
              Semua
            </FilterPill>
            {activities.map((a) => (
              <FilterPill key={a} active={filters.activity === a} onClick={() => set({ activity: a })} icon={<Swords />}>
                {a}
              </FilterPill>
            ))}
          </FilterGroup>

          <div className="lg:ml-auto">
            <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">Tampilkan</p>
            <SegmentedFilter
              options={viewOptions}
              value={filters.view}
              onChange={(view) => set({ view, date: null, venue: null })}
            />
          </div>
        </div>

        {/* Active filters */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 text-sm">
          <span className="font-semibold text-slate-600">Filter aktif:</span>
          {activeChips.length === 0 ? (
            <span className="text-slate-400">Belum ada, lagi nampilin semua jadwal</span>
          ) : (
            <>
              {activeChips.map((chip) => (
                <span
                  key={chip.label}
                  className="flex items-center gap-1 rounded-full bg-blue-50 py-1 pr-1 pl-3 font-medium text-blue-700 ring-1 ring-blue-200"
                >
                  {chip.label}
                  <button
                    type="button"
                    onClick={chip.clear}
                    aria-label={`Hapus filter ${chip.label}`}
                    className="flex size-6 items-center justify-center rounded-full hover:bg-blue-100"
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={resetAll}
                className="flex items-center gap-1 font-semibold text-slate-500 hover:text-blue-600"
              >
                <RotateCcw className="size-3.5" />
                Reset semua
              </button>
            </>
          )}
        </div>
      </section>

      {/* ---------- Dates or venues ---------- */}
      {filters.view === "tanggal" ? (
        <DateStrip
          days={days}
          today={today}
          selected={filters.date}
          counts={countByDate}
          onSelect={(date) => set({ date })}
        />
      ) : (
        <section aria-label="Pilih venue">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            <VenueTile
              active={!filters.venue}
              onClick={() => set({ venue: null })}
              name="Semua venue"
              detail={`${venues.length} venue`}
              count={matching.length}
            />
            {venues.map(({ slug, venue }) => (
              <VenueTile
                key={slug}
                active={filters.venue === slug}
                onClick={() => set({ venue: slug })}
                name={venue.name}
                detail={venue.area.split(",").at(-1)?.trim() ?? venue.area}
                count={countByVenue.get(slug) ?? 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* ---------- Results ---------- */}
      <section aria-live="polite">
        <p className="text-sm text-slate-600">
          <span className="font-bold text-slate-900">{results.length} jadwal</span> dalam {WINDOW_DAYS} hari ke depan
        </p>

        {groups.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-500">Belum ada jadwal, nih.</p>
            {activeChips.length > 0 && (
              <button type="button" onClick={resetAll} className="mt-3 text-sm font-semibold text-blue-600 hover:underline">
                Reset filter, yuk
              </button>
            )}
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-8">
            {groups.map(({ key, items }) => (
              <div key={key}>
                {filters.view === "tanggal" ? (
                  <GroupHeading
                    title={formatDate(key)}
                    badge={key === today ? "Hari ini" : key === addDays(today, 1) ? "Besok" : undefined}
                    count={items.length}
                  />
                ) : (
                  <VenueHeading schedule={items[0]} count={items.length} />
                )}
                <div className="mt-3 grid gap-4 lg:grid-cols-2">
                  {items.map((s) => (
                    <ScheduleListCard key={s.id} schedule={s} community={communityById[s.communityId]} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ---------- Pieces ----------

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function DateStrip({
  days,
  today,
  selected,
  counts,
  onSelect,
}: {
  days: string[];
  today: string;
  selected: string | null;
  counts: Map<string, number>;
  onSelect: (date: string | null) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => rowRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  // Bring a date picked from the URL into view.
  useEffect(() => {
    const row = rowRef.current;
    const tile = row?.querySelector<HTMLElement>("[aria-pressed=true]");
    if (row && tile) row.scrollLeft = tile.offsetLeft - row.clientWidth / 2 + tile.clientWidth / 2;
  }, []);

  return (
    <section aria-label="Pilih tanggal" className="relative">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Pilih tanggal</p>
        <div className="hidden gap-1 sm:flex">
          <ArrowButton label="Tanggal sebelumnya" onClick={() => scroll(-1)}>
            <ChevronLeft className="size-4" />
          </ArrowButton>
          <ArrowButton label="Tanggal berikutnya" onClick={() => scroll(1)}>
            <ChevronRight className="size-4" />
          </ArrowButton>
        </div>
      </div>
      <div
        ref={rowRef}
        className="relative -mx-4 flex snap-x gap-2 overflow-x-auto scroll-px-4 px-4 pt-1 pb-2 [scrollbar-width:none] md:-mx-8 md:scroll-px-8 md:px-8 [&::-webkit-scrollbar]:hidden"
      >
        <DateTile active={!selected} onClick={() => onSelect(null)} disabled={false}>
          <span className="text-xs font-medium opacity-80">Semua</span>
          <CalendarDays className="my-0.5 size-5" />
          <span className="text-[11px] font-semibold opacity-80">30 hari</span>
        </DateTile>
        {days.map((day) => {
          const { weekday, day: num, month } = dateParts(day);
          const count = counts.get(day) ?? 0;
          return (
            <DateTile
              key={day}
              active={selected === day}
              onClick={() => onSelect(day)}
              disabled={count === 0}
              label={`${formatDate(day)}, ${count} jadwal`}
            >
              <span className="text-xs font-medium opacity-80">{day === today ? "Hari ini" : weekday}</span>
              <span className="text-xl leading-tight font-extrabold">{num}</span>
              <span className="text-[11px] font-semibold opacity-80">{month}</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white ring-2 ring-slate-50">
                  {count}
                </span>
              )}
            </DateTile>
          );
        })}
      </div>
    </section>
  );
}

function DateTile({
  active,
  disabled,
  onClick,
  label,
  children,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  label?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`relative flex w-16 shrink-0 snap-start flex-col items-center rounded-xl py-2 ring-1 transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "bg-blue-500 text-white ring-blue-500"
          : "bg-white text-slate-700 ring-slate-200 enabled:hover:ring-blue-300"
      }`}
    >
      {children}
    </button>
  );
}

function ArrowButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200 transition hover:text-blue-600"
    >
      {children}
    </button>
  );
}

function VenueTile({
  active,
  onClick,
  name,
  detail,
  count,
}: {
  active: boolean;
  onClick: () => void;
  name: string;
  detail: string;
  count: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      disabled={count === 0 && !active}
      className={`flex flex-col items-start rounded-xl p-3 text-left ring-1 transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "bg-blue-500 text-white ring-blue-500" : "bg-white text-slate-700 ring-slate-200 enabled:hover:ring-blue-300"
      }`}
    >
      <span className="line-clamp-1 text-sm font-bold">{name}</span>
      <span className={`text-xs ${active ? "text-white/80" : "text-slate-500"}`}>{detail}</span>
      <span className={`mt-1.5 text-xs font-semibold ${active ? "text-white" : "text-blue-600"}`}>{count} jadwal</span>
    </button>
  );
}

function GroupHeading({ title, badge, count }: { title: string; badge?: string; count: number }) {
  return (
    <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
      {title}
      {badge && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">{badge}</span>}
      <span className="text-sm font-medium text-slate-400">· {count} jadwal</span>
    </h2>
  );
}

function VenueHeading({ schedule, count }: { schedule: Schedule; count: number }) {
  const venue = getVenue(schedule);
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          {venue.name} <span className="text-sm font-medium text-slate-400">· {count} jadwal</span>
        </h2>
        <p className="text-sm text-slate-500">
          {venue.area} · {venue.surface}
        </p>
      </div>
      <a
        href={mapsLink(venue)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
      >
        <Navigation className="size-4" />
        Buka Maps
      </a>
    </div>
  );
}

// ---------- Helpers ----------

function countBy<T>(items: T[], key: (item: T) => string) {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
  return counts;
}

function groupBy<T>(items: T[], key: (item: T) => string) {
  const groups = new Map<string, T[]>();
  for (const item of items) groups.set(key(item), [...(groups.get(key(item)) ?? []), item]);
  return [...groups.entries()].map(([k, list]) => ({ key: k, items: list }));
}
