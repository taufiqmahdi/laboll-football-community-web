"use client";

import { useState } from "react";
import { Landmark, Lock, QrCode, Wallet, type LucideIcon } from "@/app/components/icons";
import { formatRupiah } from "@/app/lib/format";
import { paymentMethods, startPayment, type Order, type PaymentGroup, type PaymentMethodId } from "@/app/lib/orders";

const groups: { id: PaymentGroup; title: string; note: string; Icon: LucideIcon }[] = [
  { id: "qris", title: "QRIS", note: "Scan pakai m-banking atau e-wallet apa aja.", Icon: QrCode },
  { id: "va", title: "Virtual Account", note: "Transfer lewat ATM, m-banking, atau internet banking.", Icon: Landmark },
  { id: "ewallet", title: "E-Wallet", note: "Konfirmasi langsung di aplikasinya.", Icon: Wallet },
];

export default function MethodPicker({ order }: { order: Order }) {
  const [method, setMethod] = useState<PaymentMethodId | null>(null);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">Pilih metode pembayaran</h2>
      <p className="mt-0.5 text-sm text-slate-500">Semua metode tanpa biaya tambahan.</p>

      <div className="mt-5 flex flex-col gap-5">
        {groups.map(({ id, title, note, Icon }) => (
          <fieldset key={id}>
            <legend className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Icon className="size-4 text-blue-600" />
              {title}
            </legend>
            <p className="mt-0.5 text-xs text-slate-500">{note}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {paymentMethods
                .filter((m) => m.group === id)
                .map((m) => (
                  <label key={m.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="method"
                      value={m.id}
                      checked={method === m.id}
                      onChange={() => setMethod(m.id)}
                      className="peer sr-only"
                    />
                    <span
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition peer-focus-visible:ring-4 peer-focus-visible:ring-blue-100 ${
                        method === m.id
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-300 bg-white text-slate-700 hover:border-blue-300"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
                          method === m.id ? "border-blue-500" : "border-slate-300"
                        }`}
                      >
                        {method === m.id && <span className="size-2 rounded-full bg-blue-500" />}
                      </span>
                      {m.label}
                    </span>
                  </label>
                ))}
            </div>
          </fieldset>
        ))}
      </div>

      <button
        type="button"
        disabled={!method}
        onClick={() => method && startPayment(order.id, method)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        <Lock className="size-4" />
        {method ? `Bayar ${formatRupiah(order.total)}` : "Pilih metode dulu, ya"}
      </button>
    </section>
  );
}
