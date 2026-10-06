"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { Check, Copy, Lock } from "@/app/components/icons";

// The code only shows for logged-in members; everyone else sees it masked.
export default function VoucherCode({ code }: { code: string }) {
  const { user, openAuth } = useAuth();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard blocked: the code is still on screen to copy by hand.
    }
  }

  const unlocked = user?.isMember === true;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <p
          aria-label={unlocked ? `Kode voucher ${code}` : "Kode voucher tersembunyi"}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/50 bg-white/10 font-mono text-lg font-bold tracking-[0.2em]"
        >
          {unlocked ? (
            code
          ) : (
            <>
              <Lock className="size-4 shrink-0 opacity-80" />
              <span aria-hidden className="select-none">
                {"•".repeat(8)}
              </span>
            </>
          )}
        </p>

        {unlocked ? (
          <button
            type="button"
            onClick={copy}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Tersalin!" : "Salin Kode"}
          </button>
        ) : (
          !user && (
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="flex h-12 items-center justify-center rounded-full bg-white px-6 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Masuk buat Lihat Kode
            </button>
          )
        )}
      </div>

      <p role="status" className="mt-3 text-sm text-blue-100">
        {unlocked
          ? "Tunjukin kode ini ke kasir sebelum bayar, ya."
          : user
            ? "Voucher ini khusus member Laboll. Upgrade jadi member buat pakai, ya!"
            : "Voucher ini khusus member Laboll. Masuk pakai akun member buat lihat kodenya."}
      </p>
    </div>
  );
}
