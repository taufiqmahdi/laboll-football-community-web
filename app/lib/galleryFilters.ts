import { galleryItems } from "@/app/data/gallery";
import { slugify } from "@/app/lib/scheduleFilters";

export type GalleryFilters = { query: string; venue: string | null }; // venue = slug

// Venues that have at least one gallery record, A–Z, with how many records each.
export const galleryVenues = [...new Set(galleryItems.map((g) => g.venue))]
  .map((venue) => ({ slug: slugify(venue), venue, count: galleryItems.filter((g) => g.venue === venue).length }))
  .sort((a, b) => a.venue.localeCompare(b.venue));

type Query = Record<string, string | string[] | undefined>;

// URL -> filters. Unknown venues fall back to "all".
export function parseGalleryFilters(q: Query): GalleryFilters {
  return {
    query: typeof q.q === "string" ? q.q : "",
    venue: galleryVenues.find((v) => v.slug === q.venue)?.slug ?? null,
  };
}

// Filters -> "?q=…&venue=…" (defaults left out).
export function galleryFiltersToQuery({ query, venue }: GalleryFilters) {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (venue) params.set("venue", venue);
  const search = params.toString();
  return search ? `?${search}` : "";
}
