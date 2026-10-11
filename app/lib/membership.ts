import { nextMembershipUntil, type User } from "@/app/lib/auth";
import { formatDateLong } from "@/app/lib/format";
import { createOrder } from "@/app/lib/orders";

export const MEMBERSHIP_PRICE = 100000; // per year

// Starts a membership payment for the logged-in user: joining, re-joining after it ran out, or renewing early.
export function createMembershipOrder(user: User) {
  const renewing = user.isMember;
  const until = nextMembershipUntil(user.membership);
  return createOrder({
    kind: "member",
    refId: "membership",
    account: user.email,
    title: "Membership Laboll · 1 tahun",
    subtitle: renewing ? `Perpanjang sampai ${formatDateLong(until)}` : "Aktif setahun sejak pembayaran",
    contact: { name: user.name, phone: user.phone },
    lines: [{ label: renewing ? "Perpanjangan membership 1 tahun" : "Membership 1 tahun", amount: MEMBERSHIP_PRICE }],
    total: MEMBERSHIP_PRICE,
  });
}
