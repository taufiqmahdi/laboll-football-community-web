// Mock authentication: accounts and the session live in localStorage.
// Swap these functions for real API calls later; the UI only uses this module's exports.

export type User = { name: string; email: string; phone: string; isMember: boolean };
type StoredUser = User & { password: string };

const USERS_KEY = "laboll-users";
const SESSION_KEY = "laboll-session";

// Always available so the logged-in states are easy to try.
export const DEMO_ACCOUNT = { email: "demo@laboll.id", password: "main1234" };
const demoUser: StoredUser = {
  name: "Rizky Pratama",
  email: DEMO_ACCOUNT.email,
  phone: "81234567890",
  isMember: true,
  password: DEMO_ACCOUNT.password,
};

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

const allUsers = () => [demoUser, ...storedUsers()];
const findByEmail = (email: string) => allUsers().find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
const publicUser = (u: StoredUser): User => ({ name: u.name, email: u.email, phone: u.phone, isMember: u.isMember });

// ---------- subscription (for useSyncExternalStore) ----------

const listeners = new Set<() => void>();

export function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === USERS_KEY || e.key === SESSION_KEY) listener();
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
  const key = `${read(SESSION_KEY)}|${read(USERS_KEY)}`;
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
  const user: StoredUser = { ...data, name: data.name.trim(), email: data.email.trim(), isMember: false };
  write(USERS_KEY, JSON.stringify([...storedUsers(), user]));
  write(SESSION_KEY, user.email);
  return { ok: true, user: publicUser(user) };
}

export function logout() {
  write(SESSION_KEY, null);
}
