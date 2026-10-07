import type { MerchStatus } from "@/app/data/merchandise";

export type MerchSort = "rekomendasi" | "termurah" | "termahal";

export const sortOptions: { value: MerchSort; label: string }[] = [
  { value: "rekomendasi", label: "Rekomendasi" },
  { value: "termurah", label: "Harga terendah" },
  { value: "termahal", label: "Harga tertinggi" },
];

export type MerchFilters = { status: MerchStatus | "all"; sort: MerchSort };

type Query = Record<string, string | string[] | undefined>;

// URL -> filters. Unknown or malformed values fall back to defaults.
export function parseMerchFilters(q: Query): MerchFilters {
  return {
    status: q.status === "ready" || q.status === "preorder" ? q.status : "all",
    sort: sortOptions.find((o) => o.value === q.urut)?.value ?? "rekomendasi",
  };
}

// Filters -> "?status=…&urut=…" (defaults left out).
export function merchFiltersToQuery({ status, sort }: MerchFilters) {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (sort !== "rekomendasi") params.set("urut", sort);
  const search = params.toString();
  return search ? `?${search}` : "";
}
