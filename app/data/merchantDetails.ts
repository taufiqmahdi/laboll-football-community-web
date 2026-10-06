// Detail-page-only merchant info, kept apart from merchants.ts so the client-side merchant list doesn't bundle it.

export type MerchantVoucher = {
  code: string;
  validUntil: string; // YYYY-MM-DD
  terms: string[];
};

export type MerchantDetail = {
  about: string[]; // paragraphs
  hours: string;
  tiktok?: string; // handle without "@"
  voucher: MerchantVoucher;
};

const details: Record<string, MerchantDetail> = {
  "dapur-kick-off": {
    about: [
      "Dapur Kick Off lahir dari obrolan habis main: kenapa susah banget cari makanan yang ngenyangin dekat lapangan? Dari situ mereka bikin menu burger, rice bowl, dan kentang goreng dengan porsi yang pas buat perut habis lari 90 menit.",
      "Mereka juga bisa antar langsung ke lapangan di area Kemang, dan punya paket tim buat yang mau makan bareng satu skuad.",
    ],
    hours: "Setiap hari, 10.00 – 22.00",
    tiktok: "dapurkickoff",
    voucher: {
      code: "KICKOFF15",
      validUntil: "2026-12-31",
      terms: ["Minimal belanja Rp 75.000", "Berlaku buat dine in dan antar ke lapangan", "1 kali pakai per hari"],
    },
  },
  "kopi-kiper": {
    about: [
      "Kopi Kiper adalah kedai kopi kecil di Senayan yang jadi titik kumpul banyak komunitas sebelum dan sesudah main. Kopi susunya jadi andalan, tapi es teh dan jus segarnya juga laris.",
      "Tempatnya buka sampai malam dan banyak colokan, jadi pas buat nunggu teman yang telat atau nonton highlight bareng.",
    ],
    hours: "Setiap hari, 07.00 – 23.00",
    tiktok: "kopikiper",
    voucher: {
      code: "KIPERTEH",
      validUntil: "2026-11-30",
      terms: ["Beli 2 kopi apa aja, gratis 1 es teh", "Berlaku buat dine in dan take away", "Tidak bisa digabung promo lain"],
    },
  },
  "arena-hijau": {
    about: [
      "Arena Hijau Sport Center punya lapangan football rumput asli ukuran standar, lengkap sama tribun kecil, ruang ganti, dan lampu buat main malam.",
      "Banyak komunitas pakai Arena Hijau buat fun game mingguan sampai turnamen, karena parkirnya luas dan lokasinya gampang dijangkau dari Senayan.",
    ],
    hours: "Setiap hari, 06.00 – 24.00",
    voucher: {
      code: "ARENAHIJAU10",
      validUntil: "2026-12-31",
      terms: ["Minimal sewa 2 jam", "Booking lewat WhatsApp merchant", "Tidak berlaku di hari libur nasional"],
    },
  },
  "bakmi-babak-kedua": {
    about: [
      "Bakmi Babak Kedua menyajikan bakmi kuah dan goreng dengan resep keluarga. Porsinya jumbo dan kuahnya anget, cocok buat makan malam habis main.",
      "Tempatnya muat buat rombongan satu tim, jadi nggak perlu misah-misah meja.",
    ],
    hours: "Senin – Sabtu, 11.00 – 22.00",
    voucher: {
      code: "BABAK2TEH",
      validUntil: "2026-12-15",
      terms: ["Gratis 1 es teh tiap pembelian 1 porsi bakmi", "Berlaku buat dine in", "Maksimal 11 es teh per transaksi"],
    },
  },
  "garis-gawang": {
    about: [
      "Garis Gawang punya lapangan mini soccer rumput sintetis yang empuk dan rata, jadi aman buat lutut. Ada kafe kecil di pinggir lapangan buat yang lagi nunggu giliran.",
      "Fasilitasnya lengkap, mulai dari mushola, ruang ganti, sampai sewa rompi dan bola.",
    ],
    hours: "Setiap hari, 07.00 – 24.00",
    tiktok: "garisgawang",
    voucher: {
      code: "GAWANG5PLUS1",
      validUntil: "2026-12-31",
      terms: ["Booking 5 jam, gratis 1 jam", "Jam gratis dipakai maksimal 30 hari setelah booking", "Booking lewat WhatsApp merchant"],
    },
  },
  "jersey-juara": {
    about: [
      "Konveksi Jersey Juara udah bikin jersey buat ratusan tim komunitas. Mereka bantu dari desain, pilih bahan, sampai sablon nama dan nomor punggung.",
      "Bisa pesan satuan juga, jadi pemain baru yang gabung di tengah musim tetap bisa punya jersey yang sama.",
    ],
    hours: "Senin – Sabtu, 09.00 – 17.00",
    tiktok: "jerseyjuara",
    voucher: {
      code: "JUARA20",
      validUntil: "2026-12-31",
      terms: ["Minimal pesan 10 jersey", "Berlaku buat jersey printing dan sablon", "Desain gratis, maksimal 3 kali revisi"],
    },
  },
  "pasta-pinalti": {
    about: [
      "Pasta Pinalti buat kamu yang mau tetap makan enak tanpa bikin badan berat pas main minggu depan. Menunya pasta, salad, dan grilled chicken dengan porsi yang pas.",
      "Semua menu bisa dibawa pulang, jadi bisa langsung makan di pinggir lapangan.",
    ],
    hours: "Setiap hari, 10.00 – 21.00",
    voucher: {
      code: "PINALTI10",
      validUntil: "2026-11-30",
      terms: ["Minimal belanja Rp 60.000", "Berlaku buat dine in dan take away", "1 kali pakai per transaksi"],
    },
  },
  "jus-juara": {
    about: [
      "Jus Juara bikin jus buah segar dan infused water tanpa gula tambahan. Cocok buat balikin tenaga dan cairan tubuh habis main.",
      "Mereka juga bisa antar ke lapangan di sekitar Kemang buat pesanan satu tim.",
    ],
    hours: "Setiap hari, 08.00 – 21.00",
    voucher: {
      code: "JUARAUPSIZE",
      validUntil: "2026-12-31",
      terms: ["Upsize gratis dari regular ke large", "Berlaku buat semua menu jus", "1 kali pakai per transaksi"],
    },
  },
  "teh-tendang": {
    about: [
      "Es Teh Tendang adalah booth minuman yang selalu ada di pinggir lapangan. Es teh jumbo dan kopi susu gula arennya jadi penyelamat di hari yang panas.",
      "Harganya bersahabat, jadi gampang buat traktir satu tim habis menang.",
    ],
    hours: "Setiap hari, 09.00 – 22.00",
    tiktok: "estehtendang",
    voucher: {
      code: "TENDANG5",
      validUntil: "2026-12-31",
      terms: ["Beli 5 minuman apa aja, gratis 1", "Gratisnya ukuran regular", "Tidak bisa digabung promo lain"],
    },
  },
  "lapangan-merdeka": {
    about: [
      "Merdeka Football Park punya tiga lapangan mini soccer yang berdampingan, jadi cocok banget buat turnamen kecil antar komunitas.",
      "Ruang gantinya bersih dan ada shower air panas, jadi bisa langsung berangkat kerja habis main pagi.",
    ],
    hours: "Setiap hari, 06.00 – 23.00",
    voucher: {
      code: "MERDEKAPAGI",
      validUntil: "2026-12-31",
      terms: ["Berlaku buat booking jam 06.00 – 10.00", "Minimal sewa 1 jam", "Booking lewat WhatsApp merchant"],
    },
  },
  "sablon-striker": {
    about: [
      "Sablon Striker spesialis sablon nama, nomor, dan logo sponsor di jersey. Pakai sablon polyflex yang awet dan nggak gampang retak.",
      "Buat pesanan kecil bisa ditunggu, jadi jersey baru bisa langsung dipakai main hari itu juga.",
    ],
    hours: "Senin – Sabtu, 09.00 – 18.00",
    voucher: {
      code: "STRIKERNAMA",
      validUntil: "2026-12-31",
      terms: ["Gratis sablon nama di 1 jersey", "Bawa jersey sendiri", "1 kali pakai per member"],
    },
  },
  "kapten-sportswear": {
    about: [
      "Kapten Sportswear jual perlengkapan kecil yang sering lupa dibawa: kaos kaki grip, deker, tas sepatu, sampai ban kapten.",
      "Tokonya ada di Blok M Square, gampang mampir sebelum berangkat ke lapangan.",
    ],
    hours: "Setiap hari, 10.00 – 21.00",
    tiktok: "kaptensportswear",
    voucher: {
      code: "KAPTEN15",
      validUntil: "2026-12-31",
      terms: ["Berlaku buat semua aksesoris", "Minimal belanja Rp 50.000", "Tidak berlaku buat sepatu"],
    },
  },
};

export function getMerchantDetail(id: string): MerchantDetail | undefined {
  return details[id];
}
