import type { SportCategory } from "@/app/data/schedules";

export type TournamentStatus = "open" | "soon" | "full";

// Each tournament gets its own poster color.
export type TournamentTheme = "blue" | "emerald" | "orange" | "violet";

export type Tournament = {
  id: string;
  name: string;
  edition: string; // e.g. "Season 3"
  category: SportCategory;
  status: TournamentStatus;
  theme: TournamentTheme;
  image: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  registrationDate: string; // closes (open) or opens (soon)
  location: string;
  format: string;
  teamsRegistered: number;
  teamsTotal: number;
  entryFee: number; // per team
  prizes: [number, number, number]; // 1st, 2nd, 3rd
};

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1000`;

export const tournaments: Tournament[] = [
  {
    id: "laboll-cup-3",
    name: "Laboll Cup",
    edition: "Season 3",
    category: "Football",
    status: "open",
    theme: "blue",
    image: pexels(1884576),
    startDate: "2026-10-24",
    endDate: "2026-11-08",
    registrationDate: "2026-10-15",
    location: "Lapangan ABC Senayan",
    format: "Fase grup + gugur",
    teamsRegistered: 11,
    teamsTotal: 16,
    entryFee: 1500000,
    prizes: [8000000, 4000000, 3000000],
  },
  {
    id: "night-league",
    name: "Mini Soccer Night League",
    edition: "Edisi November",
    category: "Mini Soccer",
    status: "open",
    theme: "emerald",
    image: pexels(918798),
    startDate: "2026-11-07",
    endDate: "2026-11-28",
    registrationDate: "2026-10-31",
    location: "Garis Gawang Mini Soccer, Kemang",
    format: "Liga, main tiap Sabtu malam",
    teamsRegistered: 9,
    teamsTotal: 12,
    entryFee: 900000,
    prizes: [4000000, 2500000, 1500000],
  },
  {
    id: "fun-cup-komunitas",
    name: "Fun Cup Antar Komunitas",
    edition: "Edisi Akhir Tahun",
    category: "Mini Soccer",
    status: "soon",
    theme: "orange",
    image: pexels(3148452),
    startDate: "2026-12-12",
    endDate: "2026-12-13",
    registrationDate: "2026-11-01",
    location: "Merdeka Football Park, Cilandak",
    format: "2 hari, sistem gugur",
    teamsRegistered: 0,
    teamsTotal: 8,
    entryFee: 600000,
    prizes: [2500000, 1500000, 1000000],
  },
  {
    id: "liga-veteran",
    name: "Liga Veteran 35+",
    edition: "Season 1",
    category: "Football",
    status: "full",
    theme: "violet",
    image: pexels(274422),
    startDate: "2026-10-17",
    endDate: "2026-11-21",
    registrationDate: "2026-10-03",
    location: "Arena Hijau Sport Center, Simprug",
    format: "Liga setengah kompetisi",
    teamsRegistered: 10,
    teamsTotal: 10,
    entryFee: 1200000,
    prizes: [5000000, 3000000, 2000000],
  },
];

export function getTournament(id: string) {
  return tournaments.find((t) => t.id === id);
}

export const totalPrize = (t: Tournament) => t.prizes.reduce((a, b) => a + b, 0);
