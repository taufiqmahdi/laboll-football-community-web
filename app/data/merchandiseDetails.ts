// Detail-page-only product info, kept apart from merchandise.ts so the client-side product list doesn't bundle it.

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];

// Body measurements of the garment, in cm.
export type SizeChart = Record<Size, { chest: number; length: number }>;

const charts = {
  jersey: {
    S: { chest: 48, length: 68 },
    M: { chest: 50, length: 70 },
    L: { chest: 52, length: 72 },
    XL: { chest: 54, length: 74 },
    XXL: { chest: 56, length: 76 },
  },
  hoodie: {
    S: { chest: 52, length: 66 },
    M: { chest: 55, length: 68 },
    L: { chest: 58, length: 70 },
    XL: { chest: 61, length: 72 },
    XXL: { chest: 64, length: 74 },
  },
  tee: {
    S: { chest: 49, length: 67 },
    M: { chest: 51, length: 69 },
    L: { chest: 53, length: 71 },
    XL: { chest: 55, length: 73 },
    XXL: { chest: 57, length: 75 },
  },
} satisfies Record<string, SizeChart>;

export type ProductDetail = {
  description: string[]; // paragraphs
  features: string[];
  material: string;
  fit: string;
  customizable: boolean; // free name + number printing on the back
  sizeChart: SizeChart;
};

const details: Record<string, ProductDetail> = {
  "home-jersey-2026": {
    description: [
      "Jersey kandang Laboll musim 2026/27. Putih bersih dengan aksen biru di kerah dan lengan, simpel tapi tetap kelihatan kompak pas dipakai satu tim.",
      "Dipakai di semua fun game dan turnamen resmi Laboll musim ini.",
    ],
    features: ["Bahan dry-fit yang cepat kering", "Logo Laboll dibordir", "Custom nama dan nomor punggung gratis"],
    material: "100% polyester dry-fit",
    fit: "Regular fit",
    customizable: true,
    sizeChart: charts.jersey,
  },
  "away-jersey-2026": {
    description: [
      "Jersey tandang 2026/27 warna hitam yang gampang dipadu-padankan, di lapangan maupun buat nongkrong.",
      "Bahannya adem dan nggak gampang kusut, pas buat dibawa main ke mana aja.",
    ],
    features: ["Bahan dry-fit yang cepat kering", "Logo Laboll dibordir", "Custom nama dan nomor punggung gratis"],
    material: "100% polyester dry-fit",
    fit: "Regular fit",
    customizable: true,
    sizeChart: charts.jersey,
  },
  "third-jersey-2026": {
    description: [
      "Third jersey 2026/27 dengan warna oranye yang kalem dan detail garis tipis di kerah dan lengan.",
      "Edisi pre-order, jadi tiap jersey dibikin sesuai pesanan, termasuk nama dan nomor punggung kamu.",
    ],
    features: ["Bahan dry-fit yang cepat kering", "Detail garis di kerah dan lengan", "Custom nama dan nomor punggung gratis"],
    material: "100% polyester dry-fit",
    fit: "Regular fit",
    customizable: true,
    sizeChart: charts.jersey,
  },
  "collab-jersey-juara": {
    description: [
      "Jersey kolaborasi Laboll x Konveksi Jersey Juara, merchant partner yang udah bikin jersey buat ratusan tim komunitas.",
      "Desainnya cuma dibikin satu kali, jadi begitu pre-order ditutup, jersey ini nggak bakal diproduksi lagi.",
    ],
    features: ["Desain edisi terbatas", "Logo kolaborasi di dada", "Custom nama dan nomor punggung gratis"],
    material: "100% polyester dry-fit",
    fit: "Regular fit",
    customizable: true,
    sizeChart: charts.jersey,
  },
  "hoodie-5-tahun": {
    description: [
      "Hoodie spesial buat ngerayain 5 tahun Laboll main bareng. Bahan fleece yang tebal dan hangat, pas buat main pagi atau nonton bareng malam-malam.",
      "Ada bordir angka 5 di lengan kiri dan logo Laboll edisi ulang tahun di dada.",
    ],
    features: ["Bahan fleece tebal", "Bordir edisi 5 tahun", "Kantong depan dan tali hoodie"],
    material: "80% katun, 20% polyester fleece",
    fit: "Oversized fit",
    customizable: false,
    sizeChart: charts.hoodie,
  },
  "training-tee": {
    description: [
      "Kaos latihan yang ringan dan cepat kering, buat pemanasan, latihan, atau sekadar olahraga santai.",
      "Harganya paling bersahabat, jadi enak buat stok beberapa biar selalu ada yang bersih.",
    ],
    features: ["Bahan ringan dan cepat kering", "Logo Laboll di dada", "Jahitan rata, nggak bikin lecet"],
    material: "100% polyester mesh",
    fit: "Regular fit",
    customizable: false,
    sizeChart: charts.tee,
  },
};

export function getProductDetail(id: string): ProductDetail | undefined {
  return details[id];
}
