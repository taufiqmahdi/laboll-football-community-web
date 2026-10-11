"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { ArrowRight, Crown, LoaderCircle, RotateCcw } from "@/app/components/icons";
import { nextMembershipUntil } from "@/app/lib/auth";
import { formatDateLong, formatRupiah, formatTimestamp } from "@/app/lib/format";
import { createMembershipOrder, MEMBERSHIP_PRICE } from "@/app/lib/membership";
import { latestMemberOrder, orderStatus, subscribe } from "@/app/lib/orders";
import { useNow } from "@/app/lib/useNow";

const solid =
  "flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-blue-700 shadow-lg shadow-blue-900/20 transition hover:bg-blue-50 disabled:cursor-wait disabled:opacity-80";
const outline =
  "flex items-center justify-center gap-2 rounded-full border border-white/60 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10 disabled:cursor-wait disabled:opacity-80";

// The join / renew button, for the blue hero and the closing banner. Picks the right action for who's looking.
export default function MemberCta() {
  const router = useRouter();
  const { user, openAuth } = useAuth();
  const now = useNow();
  const order = useSyncExternalStore(subscribe, () => (user ? latestMemberOrder(user.email) : null), () => null);
  const [loading, setLoading] = useState(false);

  const pending = order && now !== null && orderStatus(order, now) === "pending" ? order : null;

  const start = () => {
    if (!user) return;
    setLoading(true);
    const created = createMembershipOrder(user);
    router.push(`/payment?booking=${created.id}`);
  };

  if (!user) {
    return (
      <Actions note="Masuk atau bikin akun dulu, terus bayar sekali buat setahun.">
        <button type="button" onClick={() => openAuth("register")} className={solid}>
          Daftar & Gabung
          <ArrowRight className="size-4" />
        </button>
        <button type="button" onClick={() => openAuth("login")} className={outline}>
          Udah punya akun? Masuk
        </button>
      </Actions>
    );
  }

  if (pending) {
    return (
      <Actions note={`Pesanan ${pending.id} nunggu dibayar sampai ${formatTimestamp(pending.expiresAt)}.`}>
        <Link href={`/payment?booking=${pending.id}`} className={solid}>
          Lanjutkan Pembayaran
          <ArrowRight className="size-4" />
        </Link>
      </Actions>
    );
  }

  if (user.isMember && user.membership) {
    return (
      <Actions
        note={`Kamu member aktif sampai ${formatDateLong(user.membership.until)}. Perpanjang sekarang, aktifnya jadi sampai ${formatDateLong(nextMembershipUntil(user.membership))}.`}
      >
        <button type="button" onClick={start} disabled={loading} className={outline}>
          {loading ? <LoaderCircle className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
          Perpanjang 1 Tahun · {formatRupiah(MEMBERSHIP_PRICE)}
        </button>
      </Actions>
    );
  }

  const lapsed = user.membership; // had one, it ran out
  return (
    <Actions
      note={
        lapsed
          ? `Membership kamu udah berakhir ${formatDateLong(lapsed.until)}. Aktifin lagi buat setahun ke depan.`
          : "Langsung aktif setahun begitu pembayaran masuk."
      }
    >
      <button type="button" onClick={start} disabled={loading} className={solid}>
        {loading ? <LoaderCircle className="size-4 animate-spin" /> : <Crown className="size-4" />}
        {lapsed ? "Aktifin Lagi" : "Gabung Sekarang"} · {formatRupiah(MEMBERSHIP_PRICE)}
      </button>
    </Actions>
  );
}

function Actions({ note, children }: { note: string; children: ReactNode }) {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">{children}</div>
      <p className="mt-3 text-sm text-blue-100" aria-live="polite">
        {note}
      </p>
    </div>
  );
}
