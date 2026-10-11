"use client";

import { useSyncExternalStore } from "react";

const subscribe = (tick: () => void) => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer);
};
// Whole seconds, so the snapshot only changes once per tick.
const getNow = () => Math.floor(Date.now() / 1000) * 1000;

// The current time, updated every second. The server render (and hydration) gets null.
export function useNow() {
  return useSyncExternalStore(subscribe, getNow, () => null);
}
