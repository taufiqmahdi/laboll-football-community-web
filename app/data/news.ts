export type NewsArticle = {
  slug: string;
  date: string; // YYYY-MM-DD
  image: string;
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
    title: "Laboll Cup Season 3 Resmi Dibuka, Total Hadiahnya Rp 15 Juta!",
    excerpt:
      "Pendaftaran Laboll Cup Season 3 udah dibuka. Ada 16 slot tim, fase grup plus gugur, dan hadiah total Rp 15 juta. Amankan slot timmu sebelum 15 Oktober, ya!",
  },
  {
    slug: "kenalan-sama-garuda-muda",
    date: "2026-09-29",
    image: pexels(274422),
    title: "Kenalan Sama Garuda Muda, Komunitas yang Rutin Main Tiap Selasa Sore",
    excerpt:
      "Berawal dari teman satu kantor, sekarang Garuda Muda punya puluhan member aktif. Kita ngobrol soal cara mereka jaga suasana main tetap seru dan santai.",
  },
  {
    slug: "tips-anti-cedera-mini-soccer",
    date: "2026-09-24",
    image: pexels(3621104),
    title: "5 Tips Biar Nggak Gampang Cedera Pas Main Mini Soccer",
    excerpt:
      "Pemanasan yang bener, sepatu yang pas sama rumput sintetis, sampai kapan harus berhenti. Hal-hal kecil yang sering disepelein padahal penting banget.",
  },
  {
    slug: "recap-night-league-oktober",
    date: "2026-09-18",
    image: pexels(918798),
    title: "Recap Night League: Hujan Gol di Bawah Lampu Stadion",
    excerpt:
      "Pekan ketiga Night League ditutup dengan 23 gol dari 6 pertandingan. Ini dia momen-momen paling seru dan tim yang lagi di puncak klasemen.",
  },
  {
    slug: "third-jersey-pre-order",
    date: "2026-09-10",
    image: pexels(8148577),
    title: "Third Jersey 2026/27 Udah Bisa Di-pre-order",
    excerpt:
      "Warna oranye yang kalem, bahan adem, dan ada nama kamu di punggung. Member dapet harga spesial, dan PO-nya ditutup 18 Oktober.",
  },
];

export function getArticle(slug: string) {
  return news.find((n) => n.slug === slug);
}
