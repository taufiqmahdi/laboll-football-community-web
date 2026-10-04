const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Parsed manually so server and client render the same string.
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${DAYS[day]}, ${d} ${MONTHS[m - 1]}`;
}

export function formatRupiah(amount: number) {
  if (amount === 0) return "Gratis!";
  return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

// "24 Okt"
export function formatDayMonth(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

// 15000000 -> "15 juta" (or "15 jt" short), 2500000 -> "2,5 juta"
export function formatJuta(amount: number, short = false) {
  return `${String(amount / 1_000_000).replace(".", ",")} ${short ? "jt" : "juta"}`;
}

// Whole days from `from` to `to` (both YYYY-MM-DD).
export function daysBetween(from: string, to: string) {
  const ms = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((ms(to) - ms(from)) / 86_400_000);
}

const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const parseUtc = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

// "2026-10-04" + 3 -> "2026-10-07"
export function addDays(iso: string, days: number) {
  const date = parseUtc(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// Pieces for compact date tiles: { weekday: "Sen", day: 5, month: "Okt" }
export function dateParts(iso: string) {
  const date = parseUtc(iso);
  return { weekday: DAYS_SHORT[date.getUTCDay()], day: date.getUTCDate(), month: MONTHS[date.getUTCMonth()] };
}

// Today in Jakarta, so server-rendered dates don't depend on the server's timezone.
export function todayInJakarta() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
}

export function todayIso() {
  return toIso(new Date());
}

// Monday–Sunday week containing `today` (YYYY-MM-DD).
export function isInSameWeek(iso: string, today: string) {
  const [y, m, d] = today.split("-").map(Number);
  const monday = new Date(y, m - 1, d - ((new Date(y, m - 1, d).getDay() + 6) % 7));
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
  return iso >= toIso(monday) && iso <= toIso(sunday);
}
