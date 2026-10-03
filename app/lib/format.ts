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
