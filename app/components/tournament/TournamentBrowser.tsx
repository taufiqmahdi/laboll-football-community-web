"use client";

import { useEffect, useState } from "react";
import { PillSelect, SegmentedFilter } from "@/app/components/SectionTemplate";
import TournamentCard from "@/app/components/tournament/TournamentCard";
import { LayoutGrid, Lock, SearchX, Ticket, Timer, type LucideIcon } from "@/app/components/icons";
import { sportCategories, type SportCategory } from "@/app/data/schedules";
import { tournaments, type TournamentStatus } from "@/app/data/tournaments";
import { tournamentFiltersToQuery, type TournamentFilters } from "@/app/lib/tournamentFilters";

const statusOptions: { value: TournamentStatus | "all"; label: string; Icon: LucideIcon }[] = [
  { value: "all", label: "Semua", Icon: LayoutGrid },
  { value: "open", label: "Buka", Icon: Ticket },
  { value: "soon", label: "Segera", Icon: Timer },
  { value: "full", label: "Penuh", Icon: Lock },
];

const categoryOptions: { value: SportCategory | "all"; label: string }[] = [
  { value: "all", label: "Semua" },
  ...sportCategories.map((c) => ({ value: c, label: c })),
];

// Open registrations first, then upcoming, then full; earliest kick-off first within each.
const statusOrder: Record<TournamentStatus, number> = { open: 0, soon: 1, full: 2 };
const sorted = [...tournaments].sort(
  (a, b) => statusOrder[a.status] - statusOrder[b.status] || a.startDate.localeCompare(b.startDate),
);

export default function TournamentBrowser({ initialFilters }: { initialFilters: TournamentFilters }) {
  const [status, setStatus] = useState(initialFilters.status);
  const [category, setCategory] = useState(initialFilters.category);

  // Keep the URL shareable without triggering a server round trip.
  useEffect(() => {
    window.history.replaceState(null, "", `${window.location.pathname}${tournamentFiltersToQuery({ status, category })}`);
  }, [status, category]);

  const results = sorted.filter(
    (t) => (status === "all" || t.status === status) && (category === "all" || t.category === category),
  );
  const resetAll = () => {
    setStatus("all");
    setCategory("all");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <SegmentedFilter options={statusOptions} value={status} onChange={setStatus} />
        <PillSelect label="Kategori" options={categoryOptions} value={category} onChange={setCategory} />
      </div>

      <section aria-live="polite">
        <p className="text-sm text-slate-600">
          <span className="font-bold text-slate-900">{results.length} turnamen</span>
          {status !== "all" && <> {statusOptions.find((o) => o.value === status)?.label.toLowerCase()}</>}
          {category !== "all" && <> · {category}</>}
        </p>

        {results.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <SearchX className="size-8 text-slate-300" />
            <p className="mt-3 text-slate-500">Belum ada turnamen yang cocok, nih.</p>
            <button type="button" onClick={resetAll} className="mt-3 text-sm font-semibold text-blue-600 hover:underline">
              Reset filter, yuk
            </button>
          </div>
        ) : (
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {results.map((t) => (
              <TournamentCard key={t.id} tournament={t} tone="light" className="flex" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
