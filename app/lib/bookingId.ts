// Booking ID format: LBL-YYMMDD-XXXX
//   LBL     brand prefix
//   YYMMDD  booking date
//   XXXX    4-character code (letters/numbers)

export const BOOKING_ID_EXAMPLE = "LBL-261004-Q9M5";

const PREFIX = "LBL";
const RAW_LENGTH = 13; // 3 + 6 + 4, without dashes

export type CheckState = "pending" | "ok" | "error";

export type BookingIdCheck = {
  status: "empty" | "typing" | "invalid" | "valid";
  message: string;
  checks: { label: string; state: CheckState }[];
};

// Uppercases, drops anything that isn't a letter/number, and re-inserts the dashes,
// so typing or pasting "lbl2610 04q9m5" becomes "LBL-261004-Q9M5".
export function formatBookingId(input: string) {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, RAW_LENGTH);
  return [raw.slice(0, 3), raw.slice(3, 9), raw.slice(9)].filter(Boolean).join("-");
}

function isRealDate(yymmdd: string) {
  const y = 2000 + Number(yymmdd.slice(0, 2));
  const m = Number(yymmdd.slice(2, 4));
  const d = Number(yymmdd.slice(4, 6));
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

export function checkBookingId(formatted: string): BookingIdCheck {
  const raw = formatted.replace(/-/g, "");
  const prefix = raw.slice(0, 3);
  const date = raw.slice(3, 9);
  const code = raw.slice(9);

  const prefixState: CheckState =
    prefix.length === 0 ? "pending" : !PREFIX.startsWith(prefix) ? "error" : prefix.length === 3 ? "ok" : "pending";

  let dateState: CheckState = "pending";
  let dateMessage = "";
  if (/\D/.test(date)) {
    dateState = "error";
    dateMessage = "Bagian tanggal cuma boleh angka, ya.";
  } else if (date.length === 6) {
    dateState = isRealDate(date) ? "ok" : "error";
    if (dateState === "error") dateMessage = "Tanggalnya kayaknya nggak valid, nih. Formatnya YYMMDD.";
  }

  const codeState: CheckState = code.length === 4 ? "ok" : "pending";

  const checks = [
    { label: "Diawali LBL", state: prefixState },
    { label: "6 angka tanggal booking", state: dateState },
    { label: "4 kode unik", state: codeState },
  ];

  if (raw.length === 0) {
    return { status: "empty", message: `Contoh formatnya: ${BOOKING_ID_EXAMPLE}`, checks };
  }
  if (prefixState === "error") {
    return { status: "invalid", message: "Booking ID selalu diawali LBL, ya.", checks };
  }
  if (dateState === "error") {
    return { status: "invalid", message: dateMessage, checks };
  }
  if (checks.every((c) => c.state === "ok")) {
    return { status: "valid", message: "Format udah pas, tinggal cek!", checks };
  }
  return { status: "typing", message: `Lanjutin dulu, formatnya ${BOOKING_ID_EXAMPLE}`, checks };
}
