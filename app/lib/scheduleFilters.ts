import { activities, sportCategories, type Activity, type SportCategory } from "@/app/data/schedules";

// How far ahead /schedule looks.
export const WINDOW_DAYS = 30;

export type View = "tanggal" | "venue";

export type Filters = {
  category: SportCategory | "all";
  activity: Activity | "all";
  view: View;
  date: string | null; // YYYY-MM-DD, "per tanggal" view only
  venue: string | null; // venue slug, "per venue" view only
};

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const venueSlug = (location: string) => slugify(location);

type Query = Record<string, string | string[] | undefined>;

const pick = <T extends string>(options: readonly T[], value: Query[string]) =>
  options.find((o) => slugify(o) === value) ?? null;

// URL -> filters. Unknown or malformed values fall back to defaults.
export function parseFilters(q: Query): Filters {
  const view: View = q.tampilan === "venue" ? "venue" : "tanggal";
  const date = typeof q.tanggal === "string" && /^\d{4}-\d{2}-\d{2}$/.test(q.tanggal) ? q.tanggal : null;
  return {
    category: pick(sportCategories, q.kategori) ?? "all",
    activity: pick(activities, q.aktivitas) ?? "all",
    view,
    date: view === "tanggal" ? date : null,
    venue: view === "venue" && typeof q.venue === "string" ? q.venue : null,
  };
}

// Filters -> "?kategori=mini-soccer&tampilan=venue" (defaults are left out).
export function filtersToQuery(f: Filters) {
  const params = new URLSearchParams();
  if (f.category !== "all") params.set("kategori", slugify(f.category));
  if (f.activity !== "all") params.set("aktivitas", slugify(f.activity));
  if (f.view === "venue") params.set("tampilan", "venue");
  if (f.view === "tanggal" && f.date) params.set("tanggal", f.date);
  if (f.view === "venue" && f.venue) params.set("venue", f.venue);
  const query = params.toString();
  return query ? `?${query}` : "";
}
