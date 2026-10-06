export const newsCategories = ["Turnamen", "Komunitas", "Tips", "Hasil Laga", "Merchandise"] as const;
export type NewsCategory = (typeof newsCategories)[number];

export type NewsArticle = {
  slug: string;
  date: string; // YYYY-MM-DD
  image: string;
  category: NewsCategory;
  readMinutes: number;
  views: number;
  title: string;
  excerpt: string;
};

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

// Newest first.
export const news: NewsArticle[] = [
  {
    slug: "laboll-cup-season-3-dibuka",
    date: "2026-10-03",
    image: pexels(1884576),
    category: "Turnamen",
    readMinutes: 3,
    views: 1840,
    title: "Laboll Cup Season 3 Resmi Dibuka, Total Hadiahnya Rp 15 Juta!",
    excerpt:
      "Pendaftaran Laboll Cup Season 3 udah dibuka. Ada 16 slot tim, fase grup plus gugur, dan hadiah total Rp 15 juta. Amankan slot timmu sebelum 15 Oktober, ya!",
  },
  {
    slug: "kenalan-sama-garuda-muda",
    date: "2026-09-29",
    image: pexels(274422),
    category: "Komunitas",
    readMinutes: 6,
    views: 962,
    title: "Kenalan Sama Garuda Muda, Komunitas yang Rutin Main Tiap Selasa Sore",
    excerpt:
      "Berawal dari teman satu kantor, sekarang Garuda Muda punya puluhan member aktif. Kita ngobrol soal cara mereka jaga suasana main tetap seru dan santai.",
  },
  {
    slug: "tips-anti-cedera-mini-soccer",
    date: "2026-09-24",
    image: pexels(3621104),
    category: "Tips",
    readMinutes: 4,
    views: 2315,
    title: "5 Tips Biar Nggak Gampang Cedera Pas Main Mini Soccer",
    excerpt:
      "Pemanasan yang bener, sepatu yang pas sama rumput sintetis, sampai kapan harus berhenti. Hal-hal kecil yang sering disepelein padahal penting banget.",
  },
  {
    slug: "recap-night-league-oktober",
    date: "2026-09-18",
    image: pexels(918798),
    category: "Hasil Laga",
    readMinutes: 5,
    views: 1207,
    title: "Recap Night League: Hujan Gol di Bawah Lampu Stadion",
    excerpt:
      "Pekan ketiga Night League ditutup dengan 23 gol dari 6 pertandingan. Ini dia momen-momen paling seru dan tim yang lagi di puncak klasemen.",
  },
  {
    slug: "third-jersey-pre-order",
    date: "2026-09-10",
    image: pexels(8148577),
    category: "Merchandise",
    readMinutes: 2,
    views: 3480,
    title: "Third Jersey 2026/27 Udah Bisa Di-pre-order",
    excerpt:
      "Warna oranye yang kalem, bahan adem, dan ada nama kamu di punggung. Member dapet harga spesial, dan PO-nya ditutup 18 Oktober.",
  },
  {
    slug: "posisi-kiper-fun-game",
    date: "2026-09-04",
    image: pexels(114296),
    category: "Tips",
    readMinutes: 4,
    views: 758,
    title: "Jadi Kiper di Fun Game? Ini Cara Biar Tetap Seru dan Nggak Kapok",
    excerpt:
      "Slot GK sering gratis, tapi banyak yang masih ragu. Mulai dari posisi badan, komunikasi sama bek, sampai sarung tangan yang worth it buat pemula.",
  },
  {
    slug: "fun-league-agustus-juara",
    date: "2026-08-28",
    image: pexels(1171084),
    category: "Hasil Laga",
    readMinutes: 3,
    views: 1426,
    title: "Fun League Agustus Ditutup, Kopi Senja FC Juara Tanpa Kalah",
    excerpt:
      "Delapan tim, tujuh pekan, dan satu tim yang nggak pernah kalah. Kita rangkum perjalanan Kopi Senja FC plus top skor dan kiper terbaik musim ini.",
  },
  {
    slug: "main-bareng-member-baru",
    date: "2026-08-20",
    image: pexels(2638019),
    category: "Komunitas",
    readMinutes: 5,
    views: 2093,
    title: "Baru Pertama Kali Ikut Main Bareng? Ini yang Perlu Kamu Tahu",
    excerpt:
      "Datang sendirian juga nggak masalah. Dari cara booking slot, apa aja yang perlu dibawa, sampai etika di lapangan biar main bareng orang baru tetap nyaman.",
  },
  {
    slug: "kualifikasi-laboll-cup-season-2",
    date: "2026-08-12",
    image: pexels(1279330),
    category: "Turnamen",
    readMinutes: 4,
    views: 1689,
    title: "Laboll Cup Season 2: Drama Adu Penalti di Babak Kualifikasi",
    excerpt:
      "Tiga laga kualifikasi harus ditentukan lewat adu penalti. Simak siapa aja yang lolos ke fase grup dan tim kuda hitam yang bikin kejutan.",
  },
];

export function getArticle(slug: string) {
  return news.find((n) => n.slug === slug);
}
