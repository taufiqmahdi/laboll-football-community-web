import type { Tournament } from "@/app/data/tournaments";
import { daysBetween } from "@/app/lib/format";

export type RegistrationState = "open" | "soon" | "full" | "closed";

// Status from the data, corrected by the date: an "open" tournament whose deadline has passed reads as closed.
// `today` is null on the server render, so the data status is used until the browser knows the date.
export function registrationState(t: Tournament, today: string | null) {
  const daysLeft = today && t.status === "open" ? daysBetween(today, t.registrationDate) : null;
  const state: RegistrationState = daysLeft !== null && daysLeft < 0 ? "closed" : t.status;
  return { state, daysLeft };
}

export const countdownLabel = (daysLeft: number) => (daysLeft === 0 ? "hari ini!" : `${daysLeft} hari lagi`);
