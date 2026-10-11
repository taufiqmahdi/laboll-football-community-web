// Demo orders so the payment pages, the homepage status check and the demo account's history have something
// to show before anyone books. Real orders are created by the booking / registration / membership flows
// (app/lib/orders.ts).
import type { Order } from "@/app/lib/orders";
import { communityById, getSchedule } from "@/app/data/schedules";
import { getTournament } from "@/app/data/tournaments";
import { DEMO_ACCOUNT } from "@/app/lib/auth";
import { formatDate, formatDayMonth, wibTime } from "@/app/lib/format";
import { MEMBER_DISCOUNT, SERVICE_FEE, type Position } from "@/app/lib/pricing";

const HOUR = 60 * 60 * 1000;

// A one-slot schedule booking with the same price lines the checkout would produce.
function scheduleOrder(
  id: string,
  scheduleId: string,
  who: { name: string; phone: string; account?: string; isMember?: boolean },
  role: Position,
  times: Pick<Order, "createdAt" | "expiresAt" | "payment">,
): Order {
  const s = getSchedule(scheduleId)!;
  const fee = role === "GK" ? s.gkFee : s.playerFee;
  const discount = who.isMember ? Math.round(fee * MEMBER_DISCOUNT) : 0;
  return {
    id,
    kind: "jadwal",
    refId: s.id,
    account: who.account,
    title: s.title,
    subtitle: `${communityById[s.communityId].name} · ${formatDate(s.date)}, ${s.startTime} WIB`,
    location: s.location,
    contact: { name: who.name, phone: who.phone },
    lines: [
      { label: `${role === "GK" ? "Kiper (GK)" : "Player"} × 1`, amount: fee },
      ...(discount ? [{ label: "Diskon member 10%", amount: -discount }] : []),
      { label: "Biaya layanan", amount: SERVICE_FEE },
    ],
    total: fee - discount + SERVICE_FEE,
    ...times,
  };
}

export function demoOrders(now: number): Order[] {
  // The pending demos stay payable whatever day it is.
  const today = new Date(now + 7 * HOUR);
  const endOfToday = wibTime(today.getUTCFullYear(), today.getUTCMonth() + 1, today.getUTCDate(), 23, 59);

  // The demo account (a member since 1 Mar 2026) gets a history covering every state.
  const demo = { name: "Rizky Pratama", phone: "81234567890", account: DEMO_ACCOUNT.email, isMember: true };
  const nightLeague = getTournament("night-league")!;
  const registeredAt = now - 20 * HOUR;

  return [
    // ---------- demo account ----------
    {
      id: "LBL-260301-M3MB",
      kind: "member",
      refId: "membership",
      account: DEMO_ACCOUNT.email,
      title: "Membership Laboll · 1 tahun",
      subtitle: "Aktif setahun sejak pembayaran",
      contact: { name: demo.name, phone: demo.phone },
      lines: [{ label: "Membership 1 tahun", amount: 100000 }],
      total: 100000,
      createdAt: wibTime(2026, 3, 1, 9, 30),
      expiresAt: wibTime(2026, 3, 2, 9, 30),
      payment: { step: "paid", method: "va-bca", paidAt: wibTime(2026, 3, 1, 9, 41) },
    },
    scheduleOrder("LBL-261001-A7K2", "sch-001", demo, "Player", {
      createdAt: wibTime(2026, 10, 1, 14, 2),
      expiresAt: wibTime(2026, 10, 1, 15, 2),
      payment: { step: "paid", method: "qris", paidAt: wibTime(2026, 10, 1, 14, 20) },
    }),
    scheduleOrder("LBL-261002-K4TE", "sch-002", demo, "Player", {
      createdAt: wibTime(2026, 10, 2, 19, 0),
      expiresAt: wibTime(2026, 10, 2, 20, 0),
      payment: { step: "choose" },
    }),
    {
      id: "LBL-261009-T3AM",
      kind: "turnamen",
      refId: nightLeague.id,
      account: DEMO_ACCOUNT.email,
      title: `${nightLeague.name} ${nightLeague.edition}`,
      subtitle: `Tim Kemang Rangers · ${formatDayMonth(nightLeague.startDate)} – ${formatDayMonth(nightLeague.endDate)}`,
      location: nightLeague.location,
      contact: { name: demo.name, phone: demo.phone },
      lines: [{ label: "Biaya pendaftaran tim", amount: nightLeague.entryFee }],
      total: nightLeague.entryFee,
      createdAt: registeredAt,
      expiresAt: registeredAt + 3 * 24 * HOUR,
      payment: { step: "choose" },
    },

    // ---------- other people (for the homepage status check) ----------
    scheduleOrder("LBL-261004-Q9M5", "sch-012", { name: "Dimas", phone: "81298765432" }, "GK", {
      createdAt: now,
      expiresAt: Math.max(endOfToday, now + HOUR),
      payment: { step: "choose" },
    }),
    scheduleOrder("LBL-260928-Z3X8", "sch-003", { name: "Fajar", phone: "81311112222" }, "Player", {
      createdAt: wibTime(2026, 9, 28, 19, 0),
      expiresAt: wibTime(2026, 9, 28, 20, 0),
      payment: { step: "choose" },
    }),
  ];
}
