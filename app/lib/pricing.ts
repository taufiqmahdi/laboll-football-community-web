import type { Schedule } from "@/app/data/schedules";

export type Position = "Player" | "GK";

export const SERVICE_FEE = 2000; // per booking
export const MEMBER_DISCOUNT = 0.1; // members get 10% off every match

export type Voucher = { code: string; label: string; minSlots?: number } & (
  | { kind: "percent"; value: number }
  | { kind: "flat"; value: number }
);

// Dummy vouchers until there's a real API.
const vouchers: Voucher[] = [
  { code: "MAINLAGI10", label: "Diskon 10%", kind: "percent", value: 0.1 },
  { code: "BAWATEMAN", label: "Potongan Rp 20.000 (min. 2 slot)", kind: "flat", value: 20000, minSlots: 2 },
];

export function findVoucher(code: string) {
  return vouchers.find((v) => v.code === code.trim().toUpperCase()) ?? null;
}

export function priceBreakdown(
  s: Schedule,
  positions: Position[],
  { isMember, voucher }: { isMember: boolean; voucher: Voucher | null },
) {
  const players = positions.filter((p) => p === "Player").length;
  const keepers = positions.length - players;
  const subtotal = players * s.playerFee + keepers * s.gkFee;

  const memberDiscount = isMember ? Math.round(subtotal * MEMBER_DISCOUNT) : 0;
  const afterMember = subtotal - memberDiscount;

  const voucherUsable = voucher && (!voucher.minSlots || positions.length >= voucher.minSlots);
  const voucherDiscount = !voucherUsable
    ? 0
    : Math.min(afterMember, voucher.kind === "percent" ? Math.round(afterMember * voucher.value) : voucher.value);

  return {
    players,
    keepers,
    subtotal,
    memberDiscount,
    voucherDiscount,
    voucherBlocked: Boolean(voucher && !voucherUsable),
    serviceFee: SERVICE_FEE,
    total: afterMember - voucherDiscount + SERVICE_FEE,
  };
}
