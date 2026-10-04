"use client";

import { useSyncExternalStore } from "react";
import { todayIso } from "@/app/lib/format";

const noopSubscribe = () => () => {};

// "Today" (YYYY-MM-DD) only exists in the browser; the server render gets null so hydration matches.
export function useToday() {
  return useSyncExternalStore(noopSubscribe, todayIso, () => null);
}
