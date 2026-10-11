// Mock orders + payments: everything lives in localStorage, like app/lib/auth.ts.
// Swap these functions for real API calls (create order, start payment, payment webhook) later;
// the UI only uses this module's exports.

import { demoOrders } from "@/app/data/bookings";
import { extendMembership } from "@/app/lib/auth";
import { newBookingId } from "@/app/lib/bookingId";

export type PaymentMethodId =
  | "qris"
  | "va-bca"
  | "va-mandiri"
  | "va-bni"
  | "va-bri"
  | "gopay"
  | "ovo"
  | "dana"
  | "shopeepay";

export type PaymentGroup = "qris" | "va" | "ewallet";

export const paymentMethods: { id: PaymentMethodId; label: string; group: PaymentGroup }[] = [
  { id: "qris", label: "QRIS", group: "qris" },
  { id: "va-bca", label: "BCA Virtual Account", group: "va" },
  { id: "va-mandiri", label: "Mandiri Virtual Account", group: "va" },
  { id: "va-bni", label: "BNI Virtual Account", group: "va" },
  { id: "va-bri", label: "BRI Virtual Account", group: "va" },
  { id: "gopay", label: "GoPay", group: "ewallet" },
  { id: "ovo", label: "OVO", group: "ewallet" },
  { id: "dana", label: "DANA", group: "ewallet" },
  { id: "shopeepay", label: "ShopeePay", group: "ewallet" },
];

export const getMethod = (id: PaymentMethodId) => paymentMethods.find((m) => m.id === id)!;

// Where the order's payment is. "failed" isn't final: the order can still be paid until it expires.
export type PaymentState =
  | { step: "choose" }
  | { step: "awaiting"; method: PaymentMethodId; startedAt: number }
  | { step: "failed"; method: PaymentMethodId; reason: string; at: number }
  | { step: "paid"; method: PaymentMethodId; paidAt: number };

export type OrderLine = { label: string; amount: number }; // negative = discount

export type Order = {
  id: string; // LBL-YYMMDD-XXXX, doubles as the booking ID
  kind: "jadwal" | "turnamen" | "member";
  refId: string; // schedule or tournament id ("membership" for member orders)
  account?: string; // email of the account the order belongs to (member orders need it)
  title: string;
  subtitle: string;
  location?: string;
  contact: { name: string; phone: string }; // phone: national digits, see app/lib/phone.ts
  lines: OrderLine[];
  total: number;
  createdAt: number;
  expiresAt: number;
  payment: PaymentState;
};

export type OrderStatus = "pending" | "paid" | "expired";

// Paid wins; anything unpaid past its deadline has expired (the slot is released).
export function orderStatus(o: Order, now: number): OrderStatus {
  if (o.payment.step === "paid") return "paid";
  return now >= o.expiresAt ? "expired" : "pending";
}

// How long each kind of order stays payable.
export const PAY_WITHIN_MS = { jadwal: 60 * 60 * 1000, turnamen: 3 * 24 * 60 * 60 * 1000, member: 24 * 60 * 60 * 1000 };

// ---------- storage (never throws: blocked storage just means "no saved orders") ----------

const ORDERS_KEY = "laboll-orders";
const listeners = new Set<() => void>();

function readRaw() {
  try {
    return window.localStorage.getItem(ORDERS_KEY);
  } catch {
    return null;
  }
}

function storedOrders(): Record<string, Order> {
  try {
    const parsed = JSON.parse(readRaw() ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function save(order: Order) {
  try {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify({ ...storedOrders(), [order.id]: order }));
  } catch {
    // ignore: the order just won't survive a reload
  }
  listeners.forEach((notify) => notify());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === ORDERS_KEY) listener();
  };
  window.addEventListener("storage", onStorage); // other tabs
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// Saved orders first, then the demo ones (a saved copy of a demo order, e.g. after paying it, wins).
let cacheKey: string | null = null;
let cacheAll: Record<string, Order> = {};

function allOrders() {
  const raw = readRaw() ?? "";
  if (raw !== cacheKey) {
    cacheKey = raw;
    const demos = Object.fromEntries(demoOrders(Date.now()).map((o) => [o.id, o]));
    cacheAll = { ...demos, ...storedOrders() };
  }
  return cacheAll;
}

// Stable per id between changes, as useSyncExternalStore needs.
export function getOrder(id: string): Order | null {
  return allOrders()[id] ?? null;
}

// Pretends to be a network call so the UI already handles loading.
export async function findOrder(id: string): Promise<Order | null> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return getOrder(id);
}

// ---------- actions ----------

export function createOrder(input: Omit<Order, "id" | "createdAt" | "expiresAt" | "payment">): Order {
  let id = newBookingId();
  while (getOrder(id)) id = newBookingId();
  const now = Date.now();
  const order: Order = { ...input, id, createdAt: now, expiresAt: now + PAY_WITHIN_MS[input.kind], payment: { step: "choose" } };
  save(order);
  return order;
}

function update(id: string, change: (o: Order) => Order) {
  const order = getOrder(id);
  if (order) save(change(order));
}

export const startPayment = (id: string, method: PaymentMethodId) =>
  update(id, (o) => ({ ...o, payment: { step: "awaiting", method, startedAt: Date.now() } }));

export const changeMethod = (id: string) => update(id, (o) => ({ ...o, payment: { step: "choose" } }));

// ---------- the "gateway" (demo controls stand in for the bank / e-wallet) ----------

const failureReasons: Record<PaymentGroup, string> = {
  qris: "Pembayaran ditolak: saldo di aplikasi yang kamu pakai buat scan nggak cukup.",
  va: "Transfer ditolak bank karena nominalnya nggak sesuai tagihan.",
  ewallet: "Pembayaran dibatalkan di aplikasi e-wallet sebelum selesai.",
};

// Only an order still waiting for money, and not past its deadline, can be settled.
const settleable = (o: Order) => o.payment.step === "awaiting" && Date.now() < o.expiresAt;

export function simulatePaid(id: string) {
  const order = getOrder(id);
  if (!order || !settleable(order) || order.payment.step !== "awaiting") return;
  save({ ...order, payment: { step: "paid", method: order.payment.method, paidAt: Date.now() } });
  // A paid membership order switches the membership on (or adds a year) straight away.
  if (order.kind === "member" && order.account) extendMembership(order.account);
}

export function simulateFailed(id: string) {
  update(id, (o) =>
    settleable(o) && o.payment.step === "awaiting"
      ? {
          ...o,
          payment: {
            step: "failed",
            method: o.payment.method,
            reason: failureReasons[getMethod(o.payment.method).group],
            at: Date.now(),
          },
        }
      : o,
  );
}

export const simulateExpired = (id: string) => update(id, (o) => ({ ...o, expiresAt: Date.now() }));

// Deterministic mock VA number: bank prefix + the payer's phone digits.
const vaPrefix: Partial<Record<PaymentMethodId, string>> = {
  "va-bca": "39101",
  "va-mandiri": "89508",
  "va-bni": "98820",
  "va-bri": "26215",
};

// Every order tied to an account, newest first. Same array between changes, as useSyncExternalStore needs.
let historyCache: { all: Record<string, Order>; email: string; list: Order[] } | null = null;

export function ordersFor(email: string): Order[] {
  const all = allOrders();
  if (!historyCache || historyCache.all !== all || historyCache.email !== email) {
    const list = Object.values(all)
      .filter((o) => o.account === email)
      .sort((a, b) => b.createdAt - a.createdAt);
    historyCache = { all, email, list };
  }
  return historyCache.list;
}

// The newest membership order for an account, whatever its state (the caller checks the status).
// Same object between changes, as useSyncExternalStore needs.
export function latestMemberOrder(email: string): Order | null {
  const mine = Object.values(allOrders()).filter((o) => o.kind === "member" && o.account === email);
  return mine.sort((a, b) => b.createdAt - a.createdAt)[0] ?? null;
}

export const virtualAccountNumber = (o: Order, method: PaymentMethodId) =>
  `${vaPrefix[method] ?? "00000"}${o.contact.phone.padStart(11, "0").slice(-11)}`;
