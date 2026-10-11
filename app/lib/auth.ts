// Mock authentication: accounts and the session live in localStorage.
// Swap these functions for real API calls later; the UI only uses this module's exports.

import { addYears, todayIso } from "@/app/lib/format";

// A membership is valid through `until` (inclusive). Dates are YYYY-MM-DD.
export type Membership = { id: string; since: string; until: string };

// isMember is derived: a membership that hasn't run out yet.
export type User = { name: string; email: string; phone: string; isMember: boolean; membership: Membership | null };
type StoredUser = { name: string; email: string; phone: string; password: string };

const USERS_KEY = "laboll-users";
const SESSION_KEY = "laboll-session";
const MEMBERSHIPS_KEY = "laboll-memberships"; // { [email]: Membership }

// Always available so the logged-in states are easy to try.
export const DEMO_ACCOUNT = { email: "demo@laboll.id", password: "main1234" };
const demoUser: StoredUser = {
  name: "Rizky Pratama",
  email: DEMO_ACCOUNT.email,
  phone: "81234567890",
  password: DEMO_ACCOUNT.password,
};
const demoMembership: Membership = { id: "LBM-2603-R1ZK", since: "2026-03-01", until: "2027-02-28" };

// ---------- storage (never throws: private mode or blocked storage just means "logged out") ----------

function read(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
  listeners.forEach((notify) => notify());
}

function storedUsers(): StoredUser[] {
  try {
    const parsed = JSON.parse(read(USERS_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function storedMemberships(): Record<string, Membership> {
  try {
    const parsed = JSON.parse(read(MEMBERSHIPS_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

const allUsers = () => [demoUser, ...storedUsers()];
const findByEmail = (email: string) => allUsers().find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

// A saved membership (joined or renewed in this browser) wins over the demo account's built-in one.
function membershipFor(email: string): Membership | null {
  const key = email.toLowerCase();
  return storedMemberships()[key] ?? (key === DEMO_ACCOUNT.email ? demoMembership : null);
}

const publicUser = (u: StoredUser): User => {
  const membership = membershipFor(u.email);
  return {
    name: u.name,
    email: u.email,
    phone: u.phone,
    membership,
    isMember: Boolean(membership && membership.until >= todayIso()),
  };
};

// ---------- subscription (for useSyncExternalStore) ----------

const listeners = new Set<() => void>();

export function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === USERS_KEY || e.key === SESSION_KEY || e.key === MEMBERSHIPS_KEY) listener();
  };
  window.addEventListener("storage", onStorage); // other tabs
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// Cached so the same session returns the same object (useSyncExternalStore needs that).
let cacheKey: string | null = null;
let cacheUser: User | null = null;

export function getCurrentUser(): User | null {
  // Today is part of the key so a membership stops counting the day after it runs out.
  const key = `${read(SESSION_KEY)}|${read(USERS_KEY)}|${read(MEMBERSHIPS_KEY)}|${todayIso()}`;
  if (key !== cacheKey) {
    cacheKey = key;
    const email = read(SESSION_KEY);
    const found = email ? findByEmail(email) : undefined;
    cacheUser = found ? publicUser(found) : null;
  }
  return cacheUser;
}

// ---------- actions ----------

const fakeNetwork = () => new Promise((resolve) => setTimeout(resolve, 700));

export type AuthResult = { ok: true; user: User } | { ok: false; error: string };

export async function login(email: string, password: string): Promise<AuthResult> {
  await fakeNetwork();
  const found = findByEmail(email);
  if (!found || found.password !== password) return { ok: false, error: "Email atau password-nya salah, nih." };
  write(SESSION_KEY, found.email);
  return { ok: true, user: publicUser(found) };
}

export async function register(data: { name: string; email: string; phone: string; password: string }): Promise<AuthResult> {
  await fakeNetwork();
  if (findByEmail(data.email)) return { ok: false, error: "Email ini udah terdaftar. Langsung masuk aja, ya." };
  const user: StoredUser = { ...data, name: data.name.trim(), email: data.email.trim() };
  write(USERS_KEY, JSON.stringify([...storedUsers(), user]));
  write(SESSION_KEY, user.email);
  return { ok: true, user: publicUser(user) };
}

export function logout() {
  write(SESSION_KEY, null);
}

// ---------- membership ----------

function newMemberId(today: string) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const code = Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  return `LBM-${today.slice(2, 4)}${today.slice(5, 7)}-${code}`;
}

// The end date a paid year would give: a year on from the current end if still active, else from today.
export function nextMembershipUntil(current: Membership | null, today = todayIso()) {
  const active = current && current.until >= today;
  return addYears(active ? current.until : today, 1);
}

// Called once a membership payment is confirmed. Joining starts today; renewing an active one adds a year to it.
export function extendMembership(email: string) {
  const today = todayIso();
  const current = membershipFor(email);
  const active = Boolean(current && current.until >= today);
  const next: Membership = {
    id: current?.id ?? newMemberId(today),
    since: active && current ? current.since : today,
    until: nextMembershipUntil(current, today),
  };
  write(MEMBERSHIPS_KEY, JSON.stringify({ ...storedMemberships(), [email.toLowerCase()]: next }));
}
