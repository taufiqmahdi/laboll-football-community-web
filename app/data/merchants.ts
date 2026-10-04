import type { Brand } from "@/app/components/BrandAvatar";

export type MerchantCategory = "Makanan" | "Minuman" | "Sport Center" | "Apparel";

export type Merchant = Brand & {
  id: string;
  category: MerchantCategory;
  image: string;
  description: string;
  location: string;
  perk: string; // member promo
  highlights: string[];
};

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

export const merchantCategories: MerchantCategory[] = ["Makanan", "Minuman", "Sport Center", "Apparel"];

export const merchants: Merchant[] = [
  {
    id: "dapur-kick-off",
    name: "Dapur Kick Off",
    initials: "DK",
    color: "bg-red-500",
    category: "Makanan",
    image: pexels(70497),
    description: "Burger, rice bowl, sama kentang goreng porsi kuli. Pas banget buat isi tenaga habis main.",
    location: "Kemang, Jakarta Selatan",
    perk: "Diskon 15% buat member",
    highlights: ["Bisa antar ke lapangan", "Paket tim"],
  },
  {
    id: "kopi-kiper",
    name: "Kopi Kiper",
    initials: "KK",
    color: "bg-amber-700",
    logo: "/merchants/kopi-kiper.svg",
    category: "Minuman",
    image: pexels(302899),
    description: "Kopi susu, es teh, sampai jus segar. Tempat nongkrong favorit sebelum dan sesudah game.",
    location: "Senayan, Jakarta Pusat",
    perk: "Gratis 1 es teh tiap beli 2 kopi",
    highlights: ["Buka sampai malam", "Ada colokan"],
  },
  {
    id: "arena-hijau",
    name: "Arena Hijau Sport Center",
    initials: "AH",
    color: "bg-emerald-600",
    category: "Sport Center",
    image: pexels(1884576),
    description: "Lapangan football rumput asli ukuran standar, lengkap sama tribun dan ruang ganti.",
    location: "Simprug, Jakarta Selatan",
    perk: "Diskon 10% sewa lapangan",
    highlights: ["Ruang ganti", "Parkir luas", "Lampu malam"],
  },
  {
    id: "bakmi-babak-kedua",
    name: "Bakmi Babak Kedua",
    initials: "BK",
    color: "bg-orange-500",
    category: "Makanan",
    image: pexels(1907244),
    description: "Bakmi kuah dan goreng yang anget dan ngenyangin. Cocok buat makan bareng satu tim.",
    location: "Kuningan, Jakarta Selatan",
    perk: "Gratis es teh buat member",
    highlights: ["Porsi jumbo", "Muat rombongan"],
  },
  {
    id: "garis-gawang",
    name: "Garis Gawang Mini Soccer",
    initials: "GG",
    color: "bg-blue-600",
    category: "Sport Center",
    image: pexels(1171084),
    description: "Lapangan mini soccer rumput sintetis yang empuk, ada kafe kecil buat yang nunggu giliran.",
    location: "Kemang, Jakarta Selatan",
    perk: "Gratis 1 jam tiap booking 5 jam",
    highlights: ["Rumput sintetis", "Kafe", "Mushola"],
  },
  {
    id: "jersey-juara",
    name: "Konveksi Jersey Juara",
    initials: "JJ",
    color: "bg-slate-900",
    logo: "/merchants/jersey-juara.svg",
    category: "Apparel",
    image: pexels(996329),
    description: "Bikin jersey tim custom, dari desain sampai sablon nama dan nomor punggung. Bisa satuan juga.",
    location: "Tanah Abang, Jakarta Pusat",
    perk: "Diskon 20% pesanan jersey tim",
    highlights: ["Free desain", "Minimal 1 pcs"],
  },
  {
    id: "pasta-pinalti",
    name: "Pasta Pinalti",
    initials: "PP",
    color: "bg-yellow-500",
    category: "Makanan",
    image: pexels(1279330),
    description: "Pasta dan salad buat yang mau tetap fit tapi kenyang. Porsinya pas buat habis lari-lari.",
    location: "Senopati, Jakarta Selatan",
    perk: "Diskon 10% buat member",
    highlights: ["Menu sehat", "Bisa take away"],
  },
  {
    id: "jus-juara",
    name: "Jus Juara",
    initials: "JS",
    color: "bg-pink-500",
    category: "Minuman",
    image: pexels(1233319),
    description: "Jus buah segar dan infused water, pas buat balikin tenaga habis main.",
    location: "Kemang, Jakarta Selatan",
    perk: "Upsize gratis buat member",
    highlights: ["Tanpa gula tambahan", "Antar ke lapangan"],
  },
  {
    id: "teh-tendang",
    name: "Es Teh Tendang",
    initials: "ET",
    color: "bg-lime-600",
    category: "Minuman",
    image: pexels(2638019),
    description: "Es teh jumbo dan kopi susu gula aren yang selalu nangkring di pinggir lapangan.",
    location: "Kuningan, Jakarta Selatan",
    perk: "Beli 5 gratis 1",
    highlights: ["Ukuran jumbo", "Harga bersahabat"],
  },
  {
    id: "lapangan-merdeka",
    name: "Merdeka Football Park",
    initials: "MF",
    color: "bg-teal-600",
    category: "Sport Center",
    image: pexels(3621104),
    description: "Tiga lapangan mini soccer berdampingan, cocok buat turnamen kecil antar komunitas.",
    location: "Cilandak, Jakarta Selatan",
    perk: "Diskon 15% booking pagi",
    highlights: ["3 lapangan", "Shower air panas"],
  },
  {
    id: "sablon-striker",
    name: "Sablon Striker",
    initials: "SS",
    color: "bg-indigo-600",
    category: "Apparel",
    image: pexels(8148577),
    description: "Sablon nama, nomor, dan logo sponsor di jersey. Bisa ditunggu buat pesanan kecil.",
    location: "Tebet, Jakarta Selatan",
    perk: "Gratis sablon nama buat member",
    highlights: ["Bisa ditunggu", "Sablon polyflex"],
  },
  {
    id: "kapten-sportswear",
    name: "Kapten Sportswear",
    initials: "KS",
    color: "bg-rose-600",
    category: "Apparel",
    image: pexels(4066293),
    description: "Kaos kaki grip, deker, sampai tas sepatu. Perlengkapan kecil yang sering lupa dibawa.",
    location: "Blok M, Jakarta Selatan",
    perk: "Diskon 15% semua aksesoris",
    highlights: ["Kaos kaki grip", "Deker"],
  },
];

export function getMerchant(id: string) {
  return merchants.find((m) => m.id === id);
}
