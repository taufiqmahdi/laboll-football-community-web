"use client";

import { useState } from "react";
import { formatRupiah } from "@/app/lib/format";
import { MEMBERSHIP_PRICE } from "@/app/lib/membership";

// How much the 10% match discount saves in a year at a given playing rhythm, against the membership price.
export default function SavingsCalculator({ averageFee, discount }: { averageFee: number; discount: number }) {
  const [perMonth, setPerMonth] = useState(4);

  const perGame = Math.round(averageFee * discount);
  const yearly = perGame * perMonth * 12;
  const net = yearly - MEMBERSHIP_PRICE;
  const breakEven = Math.ceil(MEMBERSHIP_PRICE / perGame);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor="games-per-month" className="font-semibold text-slate-900">
          Berapa kali main sebulan?
        </label>
        <output htmlFor="games-per-month" className="text-2xl font-extrabold text-blue-600 tabular-nums">
          {perMonth}×
        </output>
      </div>
      <input
        id="games-per-month"
        type="range"
        min={1}
        max={12}
        value={perMonth}
        onChange={(e) => setPerMonth(Number(e.target.value))}
        aria-valuetext={`${perMonth} kali sebulan`}
        className="mt-4 w-full accent-blue-500"
      />
      <div className="mt-1 flex justify-between text-xs text-slate-400" aria-hidden>
        <span>1×</span>
        <span>12×</span>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
        <Figure label="Hemat per main" value={formatRupiah(perGame)} />
        <Figure label="Hemat setahun" value={formatRupiah(yearly)} />
        <Figure
          label={net >= 0 ? "Untung bersih" : "Kurang buat balik modal"}
          value={formatRupiah(Math.abs(net))}
          tone={net >= 0 ? "text-emerald-600" : "text-amber-600"}
        />
      </dl>

      <p className="mt-5 text-sm text-slate-600" aria-live="polite">
        Membership {formatRupiah(MEMBERSHIP_PRICE)} balik modal setelah {breakEven}× main dalam setahun
        {net >= 0 ? `, jadi main ${perMonth}× sebulan udah bikin kamu untung.` : "."}{" "}
        Dihitung dari rata-rata biaya main {formatRupiah(averageFee)} di semua jadwal, belum termasuk hemat dari merchandise
        dan voucher merchant.
      </p>
    </div>
  );
}

function Figure({ label, value, tone = "text-slate-900" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className={`mt-1 text-lg font-extrabold tabular-nums ${tone}`}>{value}</dd>
    </div>
  );
}
