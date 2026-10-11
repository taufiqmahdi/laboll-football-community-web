import type { Order } from "@/app/lib/orders";

type Link = { href: string; label: string };

// Wording and follow-up links per kind of order, shared by the payment page and the homepage status check.
export function orderCopy(o: Order): {
  label: string; // summary heading, e.g. "Booking jadwal"
  short: string; // detail row label, e.g. "Jadwal"
  paidMessage: string;
  nextSteps: string[];
  afterPaid: Link; // main button once paid
  retry: Link; // main button once expired
  browse: Link; // secondary button once expired
  expiredNote: string; // what an unpaid deadline means for this kind
  recover: Link; // where the homepage status check sends someone whose order expired
} {
  switch (o.kind) {
    case "turnamen":
      return {
        label: "Pendaftaran turnamen",
        short: "Turnamen",
        paidMessage: "Slot tim kamu udah aman. Gas siapin pemain terbaik!",
        nextSteps: [
          "Bukti pendaftaran dikirim ke WhatsApp kapten.",
          "Lengkapi daftar pemain sebelum technical meeting.",
          "Info grup dan jadwal tanding diumumin pas technical meeting.",
        ],
        afterPaid: { href: `/tournament/${o.refId}`, label: "Lihat Detail Turnamen" },
        retry: { href: `/tournament/${o.refId}`, label: "Daftar Ulang" },
        browse: { href: "/tournament", label: "Lihat Turnamen Lain" },
        expiredNote: "jadi slot timnya udah dilepas buat tim lain.",
        recover: { href: "/tournament", label: "Lihat Turnamen Lain" },
      };
    case "member":
      return {
        label: "Membership",
        short: "Membership",
        paidMessage: "Selamat, kamu resmi jadi member Laboll! Semua benefitnya udah aktif.",
        nextSteps: [
          "Diskon 10% buat booking jadwal dan merchandise langsung kepasang otomatis.",
          "Voucher member di merchant partner udah bisa dibuka.",
          "Kartu member digital kamu ada di halaman Member.",
        ],
        afterPaid: { href: "/member", label: "Lihat Kartu Member" },
        retry: { href: "/member", label: "Gabung Lagi" },
        browse: { href: "/", label: "Balik ke Beranda" },
        expiredNote: "jadi pesanannya dibatalin. Kamu bisa gabung lagi kapan aja.",
        recover: { href: "/member", label: "Gabung Lagi" },
      };
    default:
      return {
        label: "Booking jadwal",
        short: "Jadwal",
        paidMessage: "Slot kamu udah aman. Sampai ketemu di lapangan!",
        nextSteps: [
          "Bukti booking dikirim ke WhatsApp kamu.",
          "Dateng 15 menit sebelum mulai buat pemanasan dan pembagian tim.",
          "Tunjukin booking ID ke koordinator lapangan.",
        ],
        afterPaid: { href: `/schedule/${o.refId}`, label: "Lihat Detail Jadwal" },
        retry: { href: `/schedule/${o.refId}`, label: "Booking Ulang" },
        browse: { href: "/schedule", label: "Cari Jadwal Lain" },
        expiredNote: "jadi slotnya udah dilepas buat yang lain.",
        recover: { href: "/schedule", label: "Cari Jadwal Lain" },
      };
  }
}
