// There's no real auth yet. Pages read a demo user from `?demo=login` so the
// logged-in states (voucher, member discount, prefilled form) can be previewed.

export type User = { name: string; email: string; phone: string; isMember: boolean };

const demoUser: User = { name: "Rizky Pratama", email: "rizky@contoh.id", phone: "81234567890", isMember: true };

export function getDemoUser(searchParams: Record<string, string | string[] | undefined>): User | null {
  return searchParams.demo === "login" ? demoUser : null;
}
