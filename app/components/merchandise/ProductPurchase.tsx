"use client";

import { useState, type ReactNode } from "react";
import { useAuth } from "@/app/components/auth/AuthProvider";
import ChoiceTile from "@/app/components/forms/ChoiceTile";
import { ErrorText, Field, InputShell } from "@/app/components/forms/Field";
import { statusInfo } from "@/app/components/merchandise/ProductCard";
import ShareButton from "@/app/components/news/ShareButton";
import { Crown, Hash, Hourglass, MessageCircle, Minus, Plus, Ruler, UserRound } from "@/app/components/icons";
import { MEMBER_DISCOUNT, memberPrice, type Product } from "@/app/data/merchandise";
import { SIZES, type ProductDetail, type Size } from "@/app/data/merchandiseDetails";
import { whatsappLink } from "@/app/data/site";
import { formatDateLong, formatRupiah } from "@/app/lib/format";
import { useToday } from "@/app/lib/useToday";

const MAX_QTY = 10;
const MAX_NAME = 12;

export default function ProductPurchase({ product: p, detail }: { product: Product; detail: ProductDetail }) {
  const { user, openAuth } = useAuth();
  const today = useToday();

  const [size, setSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const [backName, setBackName] = useState("");
  const [backNumber, setBackNumber] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const status = statusInfo[p.status];
  const isMember = user?.isMember === true;
  const unitPrice = isMember ? memberPrice(p.price) : p.price;
  const total = unitPrice * qty;
  // `today` is null until the browser knows the date, so the PO counts as open on the server render.
  const poClosed = Boolean(p.preorder && today && today > p.preorder.closes);
  const sizeError = submitted && !size ? "Pilih ukuran dulu, ya." : "";

  function order() {
    setSubmitted(true);
    if (!size) {
      document.getElementById("field-size")?.focus();
      return;
    }
    const lines = [
      `Halo Laboll, aku mau ${p.preorder ? "ikut pre-order" : "pesan"}:`,
      `• ${p.name}`,
      `• Ukuran: ${size}`,
      `• Jumlah: ${qty}`,
      backName.trim() && `• Nama punggung: ${backName.trim()}`,
      backNumber && `• Nomor punggung: ${backNumber}`,
      `• Total: ${formatRupiah(total)}${isMember ? " (harga member)" : ""}`,
      user && `Atas nama: ${user.name}`,
    ].filter(Boolean);
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      {/* ---------- Title + price ---------- */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${status.badge}`}>
            <status.Icon className="size-3.5" />
            {status.label}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {p.edition}
          </span>
        </div>
        <ShareButton title={p.name} path={`/merchandise/${p.id}`} />
      </div>

      <h1 className="mt-2 text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl">{p.name}</h1>

      <div className="mt-4">
        {isMember ? (
          <>
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-3xl font-extrabold text-slate-900">{formatRupiah(memberPrice(p.price))}</span>
              <span className="text-slate-400 line-through">{formatRupiah(p.price)}</span>
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-blue-600">
              <Crown className="size-4" />
              Harga member, hemat {MEMBER_DISCOUNT * 100}%
            </p>
          </>
        ) : (
          <>
            <p className="text-3xl font-extrabold text-slate-900">{formatRupiah(p.price)}</p>
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm text-slate-600">
              <Crown className="size-4 text-blue-600" />
              Member cuma <span className="font-semibold text-blue-600">{formatRupiah(memberPrice(p.price))}</span>
              {/* Separator and link wrap together, so the dot never dangles at a line end */}
              {!user && (
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <span aria-hidden className="text-slate-300">
                    ·
                  </span>
                  <button
                    type="button"
                    onClick={() => openAuth("login")}
                    className="font-semibold text-blue-600 underline-offset-2 hover:underline"
                  >
                    Masuk
                  </button>
                </span>
              )}
            </p>
          </>
        )}
      </div>

      {p.preorder && (
        <div
          className={`mt-5 flex gap-3 rounded-xl p-4 text-sm ring-1 ${
            poClosed ? "bg-slate-50 text-slate-600 ring-slate-200" : "bg-amber-50 text-amber-900 ring-amber-200"
          }`}
        >
          <Hourglass className={`mt-0.5 size-4 shrink-0 ${poClosed ? "text-slate-400" : "text-amber-500"}`} />
          <div>
            {poClosed ? (
              <p className="font-semibold">Pre-order udah ditutup</p>
            ) : (
              <p className="font-semibold">
                Pre-order sampai <time dateTime={p.preorder.closes}>{formatDateLong(p.preorder.closes)}</time>
              </p>
            )}
            <p className="mt-0.5 opacity-80">{p.preorder.ships}</p>
          </div>
        </div>
      )}

      {/* ---------- Size ---------- */}
      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <p id="size-label" className="text-sm font-semibold text-slate-700">
            Ukuran{size && <span className="font-normal text-slate-500">: {size}</span>}
          </p>
          <button
            type="button"
            onClick={() => setShowChart((v) => !v)}
            aria-expanded={showChart}
            aria-controls="size-chart"
            className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
          >
            <Ruler className="size-4" />
            Panduan ukuran
          </button>
        </div>
        <div
          role="radiogroup"
          aria-labelledby="size-label"
          aria-describedby="error-size"
          className="mt-2 grid grid-cols-5 gap-2"
        >
          {SIZES.map((s, i) => (
            <ChoiceTile
              key={s}
              id={i === 0 ? "field-size" : undefined}
              name="size"
              checked={size === s}
              onChange={() => setSize(s)}
              compact
            >
              {s}
            </ChoiceTile>
          ))}
        </div>
        <ErrorText id="error-size">{sizeError}</ErrorText>

        {showChart && (
          <div id="size-chart" className="mt-3 overflow-hidden rounded-xl ring-1 ring-slate-200">
            <table className="w-full text-sm">
              <caption className="bg-slate-50 px-4 py-2 text-left text-xs text-slate-500">
                Ukuran baju dalam cm, diukur rata di meja.
              </caption>
              <thead className="bg-slate-50 text-left text-xs text-slate-500 uppercase">
                <tr>
                  <th scope="col" className="px-4 py-2 font-semibold">Ukuran</th>
                  <th scope="col" className="px-4 py-2 text-right font-semibold">Lebar dada</th>
                  <th scope="col" className="px-4 py-2 text-right font-semibold">Panjang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SIZES.map((s) => (
                  <tr key={s} className={size === s ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-700"}>
                    <th scope="row" className="px-4 py-2 text-left font-semibold">{s}</th>
                    <td className="px-4 py-2 text-right tabular-nums">{detail.sizeChart[s].chest}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{detail.sizeChart[s].length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---------- Name + number printing ---------- */}
      {detail.customizable && (
        <fieldset className="mt-6">
          <legend className="text-sm font-semibold text-slate-700">
            Nama & nomor punggung
            <span className="ml-1 font-normal text-slate-400">(opsional, gratis)</span>
          </legend>
          <div className="mt-2 grid grid-cols-[1fr_7rem] gap-3">
            <Field id="back-name" label="Nama" hint={`Maksimal ${MAX_NAME} karakter.`}>
              <InputShell icon={<UserRound className="size-5" />} invalid={false}>
                <input
                  id="field-back-name"
                  value={backName}
                  onChange={(e) => setBackName(e.target.value.toUpperCase().replace(/[^A-Z .'-]/g, "").slice(0, MAX_NAME))}
                  placeholder="RIZKY"
                  autoComplete="off"
                  aria-describedby="hint-back-name"
                  className="w-full min-w-0 bg-transparent py-3 text-base uppercase outline-none placeholder:text-slate-400"
                />
              </InputShell>
            </Field>
            <Field id="back-number" label="Nomor">
              <InputShell icon={<Hash className="size-5" />} invalid={false}>
                <input
                  id="field-back-number"
                  value={backNumber}
                  onChange={(e) => setBackNumber(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  inputMode="numeric"
                  placeholder="10"
                  autoComplete="off"
                  className="w-full min-w-0 bg-transparent py-3 text-base tabular-nums outline-none placeholder:text-slate-400"
                />
              </InputShell>
            </Field>
          </div>
        </fieldset>
      )}

      {/* ---------- Quantity ---------- */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <p id="qty-label" className="text-sm font-semibold text-slate-700">
          Jumlah
          <span className="ml-1 font-normal text-slate-400">(maks. {MAX_QTY})</span>
        </p>
        <div role="group" aria-labelledby="qty-label" className="flex items-center gap-1">
          <StepButton label="Kurangi jumlah" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
            <Minus className="size-4" />
          </StepButton>
          <output aria-live="polite" className="w-10 text-center text-lg font-bold text-slate-900 tabular-nums">
            {qty}
          </output>
          <StepButton label="Tambah jumlah" disabled={qty >= MAX_QTY} onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}>
            <Plus className="size-4" />
          </StepButton>
        </div>
      </div>

      {/* ---------- Total + order ---------- */}
      <div className="mt-6 border-t border-dashed border-slate-200 pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-semibold text-slate-900">Total</span>
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums">{formatRupiah(total)}</span>
        </div>
        {isMember && (
          <p className="mt-1 text-right text-xs font-semibold text-emerald-600">
            Hemat {formatRupiah((p.price - unitPrice) * qty)} pakai harga member
          </p>
        )}

        <button
          type="button"
          onClick={order}
          disabled={poClosed}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          <MessageCircle className="size-5" />
          {poClosed ? "Pre-order udah ditutup" : p.preorder ? "Ikut Pre-order via WhatsApp" : "Pesan via WhatsApp"}
        </button>
        {submitted && !size && (
          <p role="alert" className="mt-3 text-center text-sm text-red-600">
            Ukurannya belum dipilih, cek lagi, ya.
          </p>
        )}
        <p className="mt-3 text-center text-xs text-slate-500">
          Admin Laboll bakal bantu proses pembayaran dan pengiriman lewat WhatsApp.
        </p>
      </div>
    </div>
  );
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-10 items-center justify-center rounded-full text-slate-700 ring-1 ring-slate-300 transition enabled:hover:text-blue-600 enabled:hover:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
