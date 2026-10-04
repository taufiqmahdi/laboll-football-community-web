export type SportCategory = "Football" | "Mini Soccer";

import type { Brand } from "@/app/components/BrandAvatar";

export type Community = Brand & { id: string };

export type Schedule = {
  id: string;
  communityId: string;
  category: SportCategory;
  image: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  location: string;
  slotsFilled: number;
  slotsTotal: number;
  playerFee: number;
  gkFee: number;
  includes: string[];
};

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

export const communities: Community[] = [
  { id: "blaks", name: "Blaks FC", initials: "BF", color: "bg-blue-500", logo: "/communities/blaks.svg" },
  {
    id: "sunday-league",
    name: "Sunday League JKT",
    initials: "SL",
    color: "bg-emerald-500",
    logo: "/communities/sunday-league.svg",
  },
  { id: "ballers", name: "Ballers Senayan", initials: "BS", color: "bg-orange-500", logo: "/communities/ballers.svg" },
  { id: "garuda-muda", name: "Garuda Muda", initials: "GM", color: "bg-red-500" },
  { id: "kemang-united", name: "Kemang United", initials: "KU", color: "bg-violet-500" },
];

export const sportCategories: SportCategory[] = ["Football", "Mini Soccer"];

export const schedules: Schedule[] = [
  {
    id: "sch-001",
    communityId: "blaks",
    category: "Mini Soccer",
    image: pexels(3621104),
    date: "2026-10-03",
    startTime: "19:00",
    endTime: "21:00",
    location: "Soccer Republic, Kemang",
    slotsFilled: 18,
    slotsTotal: 20,
    playerFee: 85000,
    gkFee: 40000,
    includes: ["Air mineral", "Jersey", "Wasit", "Foto"],
  },
  {
    id: "sch-002",
    communityId: "sunday-league",
    category: "Football",
    image: pexels(3148452),
    date: "2026-10-04",
    startTime: "07:00",
    endTime: "09:00",
    location: "Lapangan ABC Senayan",
    slotsFilled: 30,
    slotsTotal: 33,
    playerFee: 120000,
    gkFee: 60000,
    includes: ["Air mineral", "Jersey", "Wasit", "Foto", "Video"],
  },
  {
    id: "sch-003",
    communityId: "ballers",
    category: "Mini Soccer",
    image: pexels(1171084),
    date: "2026-10-05",
    startTime: "20:00",
    endTime: "22:00",
    location: "Ballers Arena, Senayan",
    slotsFilled: 9,
    slotsTotal: 20,
    playerFee: 75000,
    gkFee: 0,
    includes: ["Air mineral", "Rompi", "Wasit"],
  },
  {
    id: "sch-004",
    communityId: "garuda-muda",
    category: "Football",
    image: pexels(274422),
    date: "2026-10-06",
    startTime: "16:00",
    endTime: "18:00",
    location: "Stadion Soemantri, Kuningan",
    slotsFilled: 22,
    slotsTotal: 33,
    playerFee: 110000,
    gkFee: 55000,
    includes: ["Air mineral", "Jersey", "Wasit", "Foto", "Video", "Asuransi"],
  },
  {
    id: "sch-005",
    communityId: "kemang-united",
    category: "Mini Soccer",
    image: pexels(918798),
    date: "2026-10-07",
    startTime: "19:30",
    endTime: "21:30",
    location: "Gelora Futsal, Kemang",
    slotsFilled: 20,
    slotsTotal: 20,
    playerFee: 80000,
    gkFee: 40000,
    includes: ["Air mineral", "Rompi", "Wasit", "Foto"],
  },
  {
    id: "sch-006",
    communityId: "blaks",
    category: "Football",
    image: pexels(114296),
    date: "2026-10-08",
    startTime: "06:30",
    endTime: "08:30",
    location: "Lapangan Pertamina, Simprug",
    slotsFilled: 14,
    slotsTotal: 33,
    playerFee: 125000,
    gkFee: 60000,
    includes: ["Air mineral", "Jersey", "Wasit", "Foto", "Video"],
  },
  {
    id: "sch-007",
    communityId: "sunday-league",
    category: "Mini Soccer",
    image: pexels(3148452),
    date: "2026-10-09",
    startTime: "20:00",
    endTime: "22:00",
    location: "Rasuna Mini Soccer, Kuningan",
    slotsFilled: 16,
    slotsTotal: 20,
    playerFee: 85000,
    gkFee: 45000,
    includes: ["Air mineral", "Jersey", "Wasit"],
  },
  {
    id: "sch-008",
    communityId: "ballers",
    category: "Football",
    image: pexels(274422),
    date: "2026-10-09",
    startTime: "15:30",
    endTime: "17:30",
    location: "Lapangan Banteng, Jakarta Pusat",
    slotsFilled: 27,
    slotsTotal: 33,
    playerFee: 115000,
    gkFee: 50000,
    includes: ["Air mineral", "Rompi", "Wasit", "Foto"],
  },
];

export const communityById: Record<string, Community> = Object.fromEntries(communities.map((c) => [c.id, c]));

export function getSchedule(id: string) {
  return schedules.find((s) => s.id === id);
}
