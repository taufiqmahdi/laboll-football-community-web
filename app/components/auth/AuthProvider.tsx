"use client";

import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import AuthModal from "@/app/components/auth/AuthModal";
import { CircleCheck } from "@/app/components/icons";
import { getCurrentUser, logout as logoutUser, subscribe, type User } from "@/app/lib/auth";

export type AuthMode = "login" | "register";

type AuthContextValue = {
  user: User | null;
  openAuth: (mode: AuthMode) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  // The server never knows who's logged in, so it renders the logged-out state.
  const user = useSyncExternalStore(subscribe, getCurrentUser, () => null);
  const [mode, setMode] = useState<AuthMode | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const openAuth = useCallback((next: AuthMode) => setMode(next), []);
  const logout = useCallback(() => {
    logoutUser();
    setToast("Kamu udah keluar. Sampai ketemu lagi!");
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <AuthContext.Provider value={{ user, openAuth, logout }}>
      {children}

      <AuthModal
        mode={mode}
        onModeChange={setMode}
        onClose={() => setMode(null)}
        onSuccess={(signedIn, isNew) => {
          setMode(null);
          const firstName = signedIn.name.split(" ")[0];
          setToast(isNew ? `Akun kamu udah jadi, ${firstName}! Selamat gabung.` : `Hai ${firstName}, selamat datang lagi!`);
        }}
      />

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
        {toast && (
          <p className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">
            <CircleCheck className="size-5 shrink-0 text-emerald-400" />
            {toast}
          </p>
        )}
      </div>
    </AuthContext.Provider>
  );
}
