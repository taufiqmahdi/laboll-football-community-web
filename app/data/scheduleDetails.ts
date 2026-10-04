import type { Schedule } from "@/app/data/schedules";

// ---------- Venues ----------

export type VenueFacility =
  | "Parkir"
  | "Toilet"
  | "Ruang ganti"
  | "Shower"
  | "Mushola"
  | "Kantin"
  | "Lampu malam"
  | "Wifi"
  | "Tribun";

export type Venue = {
  name: string;
  area: string; // area-level address; swap in exact addresses once confirmed
  surface: string;
  facilities: VenueFacility[];
};

// Keyed by the schedule's `location`.
const venues: Record<string, Venue> = {
  "Soccer Republic, Kemang": {
    name: "Soccer Republic",
    area: "Kemang, Mampang Prapatan, Jakarta Selatan",
    surface: "Rumput sintetis",
    facilities: ["Parkir", "Toilet", "Ruang ganti", "Shower", "Kantin", "Lampu malam"],
  },
  "Lapangan ABC Senayan": {
    name: "Lapangan ABC Senayan",
    area: "Gelora, Tanah Abang, Jakarta Pusat",
    surface: "Rumput asli",
    facilities: ["Parkir", "Toilet", "Ruang ganti", "Mushola", "Tribun"],
  },
  "Ballers Arena, Senayan": {
    name: "Ballers Arena",
    area: "Senayan, Kebayoran Baru, Jakarta Selatan",
    surface: "Rumput sintetis",
    facilities: ["Parkir", "Toilet", "Ruang ganti", "Kantin", "Lampu malam", "Wifi"],
  },
  "Stadion Soemantri, Kuningan": {
    name: "Stadion Soemantri Brodjonegoro",
    area: "Kuningan, Setiabudi, Jakarta Selatan",
    surface: "Rumput asli",
    facilities: ["Parkir", "Toilet", "Ruang ganti", "Shower", "Mushola", "Tribun"],
  },
  "Gelora Futsal, Kemang": {
    name: "Gelora Futsal & Mini Soccer",
    area: "Kemang, Mampang Prapatan, Jakarta Selatan",
    surface: "Rumput sintetis",
    facilities: ["Parkir", "Toilet", "Ruang ganti", "Kantin", "Lampu malam"],
  },
  "Lapangan Pertamina, Simprug": {
    name: "Lapangan Pertamina Simprug",
    area: "Simprug, Kebayoran Lama, Jakarta Selatan",
    surface: "Rumput asli",
    facilities: ["Parkir", "Toilet", "Ruang ganti", "Shower", "Mushola"],
  },
  "Rasuna Mini Soccer, Kuningan": {
    name: "Rasuna Mini Soccer",
    area: "Kuningan, Setiabudi, Jakarta Selatan",
    surface: "Rumput sintetis",
    facilities: ["Parkir", "Toilet", "Ruang ganti", "Shower", "Kantin", "Lampu malam", "Wifi"],
  },
  "Lapangan Banteng, Jakarta Pusat": {
    name: "Lapangan Banteng",
    area: "Pasar Baru, Sawah Besar, Jakarta Pusat",
    surface: "Rumput asli",
    facilities: ["Parkir", "Toilet", "Mushola", "Tribun"],
  },
};

export function getVenue(s: Schedule): Venue {
  return venues[s.location] ?? { name: s.location, area: s.location, surface: "-", facilities: [] };
}

export const mapsLink = (v: Venue) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.name}, ${v.area}`)}`;

// ---------- Match info ----------

export function getMatchFormat(s: Schedule) {
  const teamCount = s.category === "Football" ? 3 : 2;
  return { teamCount, teamSize: Math.round(s.slotsTotal / teamCount) };
}

export function durationLabel(s: Schedule) {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const minutes = toMin(s.endTime) - toMin(s.startTime);
  return minutes % 60 === 0 ? `${minutes / 60} jam` : `${Math.floor(minutes / 60)} jam ${minutes % 60} menit`;
}

// ---------- Line up ----------

export type Team = {
  name: string;
  color: "blue" | "slate" | "red";
  players: { name: string; role: "GK" | "Player" }[];
  size: number;
};

const teamPresets: Pick<Team, "name" | "color">[] = [
  { name: "Tim Biru", color: "blue" },
  { name: "Tim Putih", color: "slate" },
  { name: "Tim Merah", color: "red" },
];

const playerNames = [
  "Rizky A.", "Dimas P.", "Fajar N.", "Bayu S.", "Arif W.", "Yoga H.", "Rangga K.", "Ilham F.",
  "Andre M.", "Galih R.", "Reza T.", "Hendra L.", "Kevin S.", "Bima A.", "Fikri Z.", "Raka D.",
  "Taufik H.", "Gilang P.", "Naufal R.", "Aldi S.", "Rio M.", "Satria W.", "Farhan Y.", "Eko B.",
  "Dani K.", "Iqbal N.", "Wahyu T.", "Hafiz A.", "Ardi G.", "Johan P.", "Lukman S.", "Bagas R.",
  "Ridwan F.",
];

// Dummy line up built from the slot count: players are dealt round-robin so teams stay
// balanced, and each team's first player is its keeper.
export function getLineup(s: Schedule): Team[] {
  const { teamCount, teamSize } = getMatchFormat(s);
  const offset = Number(s.id.replace(/\D/g, "")) * 5;
  const teams: Team[] = teamPresets.slice(0, teamCount).map((t) => ({ ...t, players: [], size: teamSize }));

  for (let i = 0; i < s.slotsFilled; i++) {
    const team = teams[i % teamCount];
    team.players.push({
      name: playerNames[(i + offset) % playerNames.length],
      role: team.players.length === 0 ? "GK" : "Player",
    });
  }
  return teams;
}

// ---------- Rules ----------

export function getRules(s: Schedule): { title: string; items: string[] }[] {
  const shoes =
    s.category === "Mini Soccer"
      ? "Pakai sepatu turf atau pul karet. Sepatu pul besi nggak boleh dipakai di rumput sintetis, ya."
      : "Pakai sepatu pul karet atau pul besi pendek. Biar aman, hindari pul besi panjang.";

  return [
    {
      title: "Sebelum main",
      items: [
        "Dateng 15 menit sebelum mulai buat pemanasan dan pembagian tim.",
        shoes,
        s.includes.includes("Jersey") || s.includes.includes("Rompi")
          ? "Jersey atau rompi udah disiapin, tinggal bawa diri dan semangat!"
          : "Bawa kaos gelap dan terang buat pembagian tim.",
      ],
    },
    {
      title: "Di lapangan",
      items: [
        "Main fair play. Tekel keras dan sliding dari belakang nggak dibolehin.",
        "Keputusan wasit atau koordinator lapangan itu final.",
        "Jaga omongan, nggak ada tempat buat kata-kata kasar atau rasis.",
        "Kalau kiper lagi kosong, kita rotasi gantian jaga gawang.",
      ],
    },
    {
      title: "Pembatalan",
      items: [
        "Batal paling lambat H-2: refund 100% ke saldo akun.",
        "Batal H-1: refund 50%.",
        "Batal di hari H nggak bisa refund, tapi slot boleh dioper ke teman.",
        "Kalau hujan deras atau lapangan nggak bisa dipakai, jadwal diundur atau refund penuh.",
      ],
    },
  ];
}
