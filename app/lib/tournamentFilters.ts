import { sportCategories, type SportCategory } from "@/app/data/schedules";
import type { TournamentStatus } from "@/app/data/tournaments";
import { slugify } from "@/app/lib/scheduleFilters";

export type TournamentFilters = { status: TournamentStatus | "all"; category: SportCategory | "all" };

const statuses: TournamentStatus[] = ["open", "soon", "full"];

type Query = Record<string, string | string[] | undefined>;

// URL -> filters. Unknown or malformed values fall back to defaults.
export function parseTournamentFilters(q: Query): TournamentFilters {
  return {
    status: statuses.find((s) => s === q.status) ?? "all",
    category: sportCategories.find((c) => slugify(c) === q.kategori) ?? "all",
  };
}

// Filters -> "?status=…&kategori=…" (defaults left out).
export function tournamentFiltersToQuery({ status, category }: TournamentFilters) {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (category !== "all") params.set("kategori", slugify(category));
  const search = params.toString();
  return search ? `?${search}` : "";
}
