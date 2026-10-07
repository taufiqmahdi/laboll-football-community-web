import type { TournamentTheme } from "@/app/data/tournaments";

// Poster overlay + slot fill per tournament color.
export const themes: Record<TournamentTheme, { poster: string; slot: string }> = {
  blue: { poster: "from-blue-700/95 via-blue-700/60 to-blue-950/10", slot: "bg-blue-500" },
  emerald: { poster: "from-emerald-700/95 via-emerald-700/60 to-emerald-950/10", slot: "bg-emerald-500" },
  orange: { poster: "from-orange-600/95 via-orange-600/60 to-orange-950/10", slot: "bg-orange-500" },
  violet: { poster: "from-violet-700/95 via-violet-700/60 to-violet-950/10", slot: "bg-violet-500" },
};

export const medalColors = ["text-amber-500", "text-slate-400", "text-orange-700"];
