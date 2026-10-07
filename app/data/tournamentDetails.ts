// Detail-page-only tournament info, kept apart from tournaments.ts so the client-side list doesn't bundle it.
import { getMerchant } from "@/app/data/merchants";
import type { Tournament } from "@/app/data/tournaments";

export type TournamentDetail = {
  about: string[]; // paragraphs
  squad: string; // players per team, as shown
  minPlayers: number; // needed by the technical meeting
  maxPlayers: number;
  matchLength: string;
  minAge?: number;
  technicalMeeting: string; // YYYY-MM-DD
  // The other end of the registration window: when it opened (open/full) or closes (soon).
  registrationOther: string; // YYYY-MM-DD
  venue: { merchantId: string } | { name: string; address: string };
  awards: { title: string; reward: string }[];
  teams: string[]; // registered teams, length must equal tournament.teamsRegistered
  rules: { title: string; items: string[] }[];
};

const footballRules = (extra: string[] = []) => [
  {
    title: "Pendaftaran",
    items: [
      "Satu tim maksimal 18 pemain (11 inti + 7 cadangan), didaftarin sebelum technical meeting.",
      "Pemain cuma boleh terdaftar di satu tim.",
      ...extra,
      "Biaya daftar dibayar lunas maksimal 3 hari setelah daftar, kalau lewat slot dilepas.",
    ],
  },
  {
    title: "Pertandingan",
    items: [
      "Tim wajib hadir 30 menit sebelum kick-off. Telat 15 menit dianggap kalah WO 0-3.",
      "Pergantian pemain bebas, pemain yang udah keluar boleh masuk lagi.",
      "Kartu merah = absen satu pertandingan berikutnya.",
      "Keputusan wasit itu final dan nggak bisa diprotes.",
    ],
  },
  {
    title: "Fair play",
    items: [
      "Nggak ada tempat buat kata-kata kasar, rasis, atau kekerasan. Pelanggaran berat = diskualifikasi.",
      "Pakai jersey tim dengan nomor punggung yang sama kayak di daftar pemain.",
      "Sepatu pul karet atau pul besi pendek. Deker wajib dipakai.",
    ],
  },
];

const miniSoccerRules = (extra: string[] = []) => [
  {
    title: "Pendaftaran",
    items: [
      "Satu tim maksimal 12 pemain (7 inti + 5 cadangan), didaftarin sebelum technical meeting.",
      "Pemain cuma boleh terdaftar di satu tim.",
      ...extra,
      "Biaya daftar dibayar lunas maksimal 3 hari setelah daftar, kalau lewat slot dilepas.",
    ],
  },
  {
    title: "Pertandingan",
    items: [
      "Tim wajib hadir 30 menit sebelum kick-off. Telat 10 menit dianggap kalah WO 0-3.",
      "Pergantian pemain bebas dan nggak terbatas.",
      "Nggak ada offside. Kiper boleh lempar bola langsung ke setengah lapangan lawan.",
      "Keputusan wasit itu final dan nggak bisa diprotes.",
    ],
  },
  {
    title: "Fair play",
    items: [
      "Nggak ada tempat buat kata-kata kasar, rasis, atau kekerasan. Pelanggaran berat = diskualifikasi.",
      "Sliding tackle nggak dibolehin di rumput sintetis.",
      "Pakai sepatu turf atau pul karet. Pul besi dilarang.",
    ],
  },
];

const details: Record<string, TournamentDetail> = {
  "laboll-cup-3": {
    about: [
      "Laboll Cup balik lagi buat season ketiga, dan kali ini lebih gede: 16 tim, fase grup plus gugur, dan total hadiah Rp 15 juta.",
      "Semua laga dimainkan di lapangan rumput asli Lapangan ABC Senayan, lengkap sama wasit berlisensi, fotografer, dan live score di Instagram Laboll.",
    ],
    squad: "11 pemain + maks. 7 cadangan",
    minPlayers: 11,
    maxPlayers: 18,
    matchLength: "2 × 30 menit",
    technicalMeeting: "2026-10-19",
    registrationOther: "2026-10-01",
    venue: { name: "Lapangan ABC Senayan", address: "Gelora, Tanah Abang, Jakarta Pusat" },
    awards: [
      { title: "Top skor", reward: "Trofi + Rp 500.000" },
      { title: "Kiper terbaik", reward: "Trofi + sarung tangan" },
      { title: "Tim fair play", reward: "Jersey Laboll buat satu tim" },
    ],
    teams: [
      "Laboll FC",
      "Sunday League JKT",
      "Ballers Senayan",
      "Garuda Muda",
      "Kemang United",
      "Kopi Senja FC",
      "Gelora Muda",
      "Persatuan Kantor Sudirman",
      "Rajawali Simprug",
      "Anak Tribun FC",
      "Cempaka Putih United",
    ],
    rules: footballRules(),
  },
  "night-league": {
    about: [
      "Liga mini soccer tiap Sabtu malam di bawah lampu Garis Gawang. Format liga penuh, jadi tiap tim pasti main banyak, nggak cuma sekali terus pulang.",
      "Klasemen dan statistik pemain di-update tiap pekan, jadi tiap gol kamu kecatat.",
    ],
    squad: "7 pemain + maks. 5 cadangan",
    minPlayers: 7,
    maxPlayers: 12,
    matchLength: "2 × 20 menit",
    technicalMeeting: "2026-11-03",
    registrationOther: "2026-10-03",
    venue: { merchantId: "garis-gawang" },
    awards: [
      { title: "Top skor", reward: "Trofi + Rp 300.000" },
      { title: "Pemain terbaik", reward: "Trofi + sepatu turf" },
      { title: "Tim fair play", reward: "Voucher makan tim di Dapur Kick Off" },
    ],
    teams: [
      "Kemang United",
      "Ballers Senayan",
      "Sunday League JKT",
      "Malam Minggu FC",
      "Lampu Sorot",
      "Bangka Raya FC",
      "Mampang Muda",
      "Kopi Senja FC",
      "Tendangan Senja",
    ],
    rules: miniSoccerRules(),
  },
  "fun-cup-komunitas": {
    about: [
      "Turnamen santai dua hari buat nutup tahun bareng komunitas-komunitas partner Laboll. Sistem gugur, jadi tiap laga berasa final.",
      "Selain pertandingan, ada booth merchant, doorprize, dan sesi foto bareng semua tim di hari terakhir.",
    ],
    squad: "7 pemain + maks. 5 cadangan",
    minPlayers: 7,
    maxPlayers: 12,
    matchLength: "2 × 15 menit",
    technicalMeeting: "2026-12-07",
    registrationOther: "2026-12-01",
    venue: { merchantId: "lapangan-merdeka" },
    awards: [
      { title: "Top skor", reward: "Trofi + Rp 250.000" },
      { title: "Supporter terheboh", reward: "Hampers dari merchant partner" },
      { title: "Tim fair play", reward: "Jersey Laboll buat satu tim" },
    ],
    teams: [],
    rules: miniSoccerRules(["Khusus komunitas yang udah terdaftar sebagai partner Laboll."]),
  },
  "liga-veteran": {
    about: [
      "Liga khusus pemain 35 tahun ke atas, buat yang masih pengen kompetitif tapi dengan tempo yang lebih bersahabat.",
      "Format setengah kompetisi, semua laga di lapangan rumput asli Arena Hijau tiap Sabtu pagi.",
    ],
    squad: "11 pemain + maks. 7 cadangan",
    minPlayers: 11,
    maxPlayers: 18,
    matchLength: "2 × 25 menit",
    minAge: 35,
    technicalMeeting: "2026-10-10",
    registrationOther: "2026-09-15",
    venue: { merchantId: "arena-hijau" },
    awards: [
      { title: "Top skor", reward: "Trofi + Rp 500.000" },
      { title: "Pemain terbaik", reward: "Trofi + jersey edisi spesial" },
      { title: "Tim fair play", reward: "Jersey Laboll buat satu tim" },
    ],
    teams: [
      "Veteran Senayan",
      "Simprug Legends",
      "Old Boys Kebayoran",
      "Laboll Masters",
      "Bapak-bapak Gelora",
      "Kuningan Classic",
      "Pondok Indah Seniors",
      "Cilandak Veterans",
      "Tebet Old Stars",
      "Menteng Legends",
    ],
    rules: footballRules(["Semua pemain minimal berusia 35 tahun, dibuktikan pakai KTP pas technical meeting."]),
  },
};

export function getTournamentDetail(id: string): TournamentDetail | undefined {
  return details[id];
}

// Venue with a concrete address; merchant venues reuse the merchant's data and link to its page.
export function getTournamentVenue(d: TournamentDetail) {
  if ("merchantId" in d.venue) {
    const m = getMerchant(d.venue.merchantId);
    if (m) return { name: m.name, address: m.address, merchantId: m.id };
  }
  return { ...(d.venue as { name: string; address: string }), merchantId: null };
}

export const venueMapsLink = (v: { name: string; address: string }) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.name}, ${v.address}`)}`;

export type TimelineStep = { label: string; date: string };

// Key dates in order. Registration dates come from the tournament itself so they can't drift apart.
export function getTimeline(t: Tournament, d: TournamentDetail): TimelineStep[] {
  const [opens, closes] = t.status === "soon" ? [t.registrationDate, d.registrationOther] : [d.registrationOther, t.registrationDate];
  const singleDay = t.startDate === t.endDate;
  return [
    { label: "Pendaftaran dibuka", date: opens },
    { label: "Pendaftaran ditutup", date: closes },
    { label: "Technical meeting", date: d.technicalMeeting },
    { label: "Kick-off", date: t.startDate },
    ...(singleDay ? [] : [{ label: t.format.startsWith("Liga") ? "Pekan terakhir" : "Final", date: t.endDate }]),
  ];
}
