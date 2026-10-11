"use client";

import { useState } from "react";
import CopyButton from "@/app/components/payment/CopyButton";
import MockQr from "@/app/components/payment/MockQr";
import { CircleCheck, CircleX, FlaskConical, Hourglass, Info, LoaderCircle, RotateCcw, Search } from "@/app/components/icons";
import { formatRupiah, formatTimestamp } from "@/app/lib/format";
import {
  changeMethod,
  getMethod,
  simulateExpired,
  simulateFailed,
  simulatePaid,
  virtualAccountNumber,
  type Order,
  type PaymentMethodId,
} from "@/app/lib/orders";
import { formatPhone } from "@/app/lib/phone";

const VERIFY_MS = 1200;

// Waiting for the money: method-specific instructions, a status check, and demo controls standing in for the bank.
export default function AwaitingPayment({ order, method }: { order: Order; method: PaymentMethodId }) {
  const m = getMethod(method);
  const [verifying, setVerifying] = useState<string | null>(null); // what we're "talking to the gateway" about
  const [notYet, setNotYet] = useState(false);

  // Every check takes a moment, like a real gateway round trip.
  const withVerify = (label: string, then: () => void) => {
    setNotYet(false);
    setVerifying(label);
    setTimeout(() => {
      setVerifying(null);
      then();
    }, VERIFY_MS);
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Bayar pakai</p>
          <h2 className="text-lg font-bold text-slate-900">{m.label}</h2>
        </div>
        <p className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
          <Hourglass className="size-3.5" />
          Menunggu pembayaran
        </p>
      </div>
      <p className="mt-1 text-sm text-slate-600">Selesaikan sebelum {formatTimestamp(order.expiresAt)}.</p>

      {/* ---------- Instructions ---------- */}
      <div className="mt-5">
        {m.group === "qris" && (
          <div className="flex flex-col items-center gap-3 rounded-xl bg-slate-50 p-5 text-center">
            <div className="size-48 rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200 sm:size-56">
              <MockQr value={order.id} />
            </div>
            <p className="text-sm text-slate-700">
              Scan pakai m-banking atau e-wallet apa aja, cek nominalnya{" "}
              <span className="font-bold text-slate-900">{formatRupiah(order.total)}</span>, terus konfirmasi.
            </p>
            <p className="text-xs text-slate-400">Contoh QR (mode demo), nggak bisa di-scan beneran.</p>
          </div>
        )}

        {m.group === "va" && (
          <div className="flex flex-col gap-3">
            <CopyRow
              label="Nomor virtual account"
              value={virtualAccountNumber(order, method)}
              display={groupDigits(virtualAccountNumber(order, method))}
              mono
            />
            <CopyRow label="Jumlah transfer" value={String(order.total)} display={formatRupiah(order.total)} />
            <Steps
              items={[
                `Buka m-banking atau ATM ${m.label.replace(" Virtual Account", "")}, pilih menu transfer ke Virtual Account.`,
                "Masukin nomor virtual account di atas.",
                "Pastikan nama dan nominalnya sesuai, terus konfirmasi.",
              ]}
            />
          </div>
        )}

        {m.group === "ewallet" && (
          <div className="flex flex-col gap-3">
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              Permintaan pembayaran udah dikirim ke aplikasi <span className="font-semibold">{m.label}</span> di nomor{" "}
              <span className="font-semibold whitespace-nowrap">+62 {formatPhone(order.contact.phone)}</span>.
            </p>
            <Steps
              items={[
                `Buka aplikasi ${m.label} di HP kamu.`,
                "Buka notifikasi permintaan pembayaran dari Laboll.",
                `Cek nominalnya ${formatRupiah(order.total)}, terus konfirmasi pakai PIN.`,
              ]}
            />
          </div>
        )}
      </div>

      {/* ---------- Check / change ---------- */}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={verifying !== null}
          onClick={() => withVerify("Ngecek status pembayaran...", () => setNotYet(true))}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-blue-500 bg-blue-500 py-3 text-sm font-semibold text-white transition hover:border-blue-600 hover:bg-blue-600 disabled:cursor-wait disabled:opacity-80"
        >
          <Search className="size-4" />
          Cek Status Pembayaran
        </button>
        <button
          type="button"
          disabled={verifying !== null}
          onClick={() => changeMethod(order.id)}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-300 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RotateCcw className="size-4" />
          Ganti Metode
        </button>
      </div>

      <div aria-live="polite">
        {verifying && (
          <p className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-blue-700">
            <LoaderCircle className="size-4 animate-spin" />
            {verifying}
          </p>
        )}
        {notYet && !verifying && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            <Info className="mt-0.5 size-4 shrink-0 text-slate-400" />
            Belum ada pembayaran yang masuk. Selesaikan pembayarannya dulu, terus cek lagi, ya.
          </p>
        )}
      </div>

      {/* ---------- Demo controls (a real gateway would report this on its own) ---------- */}
      <div className="mt-6 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-amber-900">
          <FlaskConical className="size-4" />
          Mode demo
        </p>
        <p className="mt-0.5 text-xs text-amber-800">
          Di aplikasi asli, hasil pembayaran dikirim otomatis sama bank atau e-wallet. Di sini kamu yang nentuin.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <DemoButton
            disabled={verifying !== null}
            onClick={() => withVerify("Memverifikasi pembayaran...", () => simulatePaid(order.id))}
            Icon={CircleCheck}
            tone="text-emerald-700 ring-emerald-300 hover:bg-emerald-50"
          >
            Bayar berhasil
          </DemoButton>
          <DemoButton
            disabled={verifying !== null}
            onClick={() => withVerify("Memverifikasi pembayaran...", () => simulateFailed(order.id))}
            Icon={CircleX}
            tone="text-red-700 ring-red-300 hover:bg-red-50"
          >
            Bayar gagal
          </DemoButton>
          <DemoButton
            disabled={verifying !== null}
            onClick={() => simulateExpired(order.id)}
            Icon={Hourglass}
            tone="text-slate-700 ring-slate-300 hover:bg-slate-50"
          >
            Waktu habis
          </DemoButton>
        </div>
      </div>
    </section>
  );
}

// "8950881298765432" -> "8950 8812 9876 5432": easier to read off, and it only wraps between groups.
const groupDigits = (digits: string) => digits.replace(/(\d{4})(?=\d)/g, "$1 ");

function CopyRow({ label, value, display, mono }: { label: string; value: string; display?: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`text-base font-bold text-slate-900 sm:text-lg ${mono ? "font-mono tracking-wide" : ""}`}>
          {display ?? value}
        </p>
      </div>
      <CopyButton value={value} label={label.toLowerCase()} />
    </div>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2">
      {items.map((step, i) => (
        <li key={step} className="flex gap-3 text-sm text-slate-700">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
            {i + 1}
          </span>
          <span className="pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function DemoButton({
  disabled,
  onClick,
  Icon,
  tone,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  Icon: typeof CircleCheck;
  tone: string;
  children: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2.5 text-sm font-semibold ring-1 transition disabled:cursor-not-allowed disabled:opacity-50 ${tone}`}
    >
      <Icon className="size-4" />
      {children}
    </button>
  );
}
