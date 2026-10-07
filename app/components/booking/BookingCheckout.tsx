"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/auth/AuthProvider";
import BrandAvatar from "@/app/components/BrandAvatar";
import ChoiceTile from "@/app/components/forms/ChoiceTile";
import { ErrorText, Field, InputShell } from "@/app/components/forms/Field";
import {
  CalendarDays,
  Clock,
  LoaderCircle,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Ticket,
  UserRound,
  Users,
  X,
} from "@/app/components/icons";
import type { Community, Schedule } from "@/app/data/schedules";
import { newBookingId } from "@/app/lib/bookingId";
import { formatDate, formatRupiah } from "@/app/lib/format";
import { formatPhone, isValidPhone, normalizePhone } from "@/app/lib/phone";
import { findVoucher, priceBreakdown, type Position, type Voucher } from "@/app/lib/pricing";

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
type Size = (typeof SIZES)[number];
type Slot = { id: number; position: Position; size: Size | null };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BookingCheckout({
  schedule: s,
  community,
  initialPosition,
  maxSlots,
  outfit,
}: {
  schedule: Schedule;
  community: Community;
  initialPosition: Position;
  maxSlots: number;
  outfit: "jersey" | "rompi";
}) {
  const router = useRouter();
  const nextSlotId = useRef(1);

  const { user, openAuth } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // When someone logs in (or arrives logged in), fill whatever they haven't typed yet.
  const [prefilledFor, setPrefilledFor] = useState<string | null>(null);
  if (user && prefilledFor !== user.email) {
    setPrefilledFor(user.email);
    setName((v) => v || user.name);
    setEmail((v) => v || user.email);
    setPhone((v) => v || user.phone);
  }
  const [slots, setSlots] = useState<Slot[]>([{ id: 0, position: initialPosition, size: null }]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [voucherInput, setVoucherInput] = useState("");
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [voucherError, setVoucherError] = useState("");

  const errors: Record<string, string> = {};
  if (name.trim().length < 2) errors.name = "Nama wajib diisi, ya.";
  if (email && !EMAIL_RE.test(email)) errors.email = "Format email-nya kayaknya belum bener.";
  if (!phone) errors.phone = "Nomor HP wajib diisi buat konfirmasi booking.";
  else if (!isValidPhone(phone)) errors.phone = "Nomor HP-nya belum valid. Contoh: 812-3456-7890";
  slots.forEach((slot) => {
    if (!slot.size) errors[`size-${slot.id}`] = `Pilih ukuran ${outfit} dulu, ya.`;
  });
  const showError = (field: string) => (submitted || touched[field]) && errors[field];
  const touch = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const price = priceBreakdown(
    s,
    slots.map((slot) => slot.position),
    { isMember: Boolean(user?.isMember), voucher: user ? voucher : null },
  );

  const updateSlot = (id: number, patch: Partial<Slot>) =>
    setSlots((all) => all.map((slot) => (slot.id === id ? { ...slot, ...patch } : slot)));
  const addSlot = () =>
    setSlots((all) => (all.length >= maxSlots ? all : [...all, { id: nextSlotId.current++, position: "Player", size: null }]));
  const removeSlot = (id: number) => setSlots((all) => all.filter((slot) => slot.id !== id));

  const applyVoucher = () => {
    const found = findVoucher(voucherInput);
    if (!found) {
      setVoucherError("Kode vouchernya nggak valid, nih. Coba cek lagi, ya.");
      return;
    }
    setVoucher(found);
    setVoucherError("");
    setVoucherInput("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      document.getElementById(`field-${firstError}`)?.focus();
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // pretend to create the booking
    router.push(`/payment?booking=${newBookingId()}`);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
      {/* ---------- Left: personal info + slots ---------- */}
      <div className="flex flex-col gap-6">
        <Panel title="Data diri" subtitle="Biar admin gampang ngehubungin kamu soal booking ini.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="name" label="Nama lengkap" error={showError("name")} className="sm:col-span-2">
              <InputShell icon={<UserRound className="size-5" />} invalid={Boolean(showError("name"))}>
                <input
                  id="field-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => touch("name")}
                  autoComplete="name"
                  placeholder="Contoh: Rizky Pratama"
                  aria-invalid={Boolean(showError("name"))}
                  aria-describedby="error-name"
                  className="w-full bg-transparent py-3 text-base outline-none placeholder:text-slate-400"
                />
              </InputShell>
            </Field>

            <Field id="email" label="Email" optional hint="Buat kirim bukti booking." error={showError("email")}>
              <InputShell icon={<Mail className="size-5" />} invalid={Boolean(showError("email"))}>
                <input
                  id="field-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  onBlur={() => touch("email")}
                  autoComplete="email"
                  placeholder="kamu@email.com"
                  aria-invalid={Boolean(showError("email"))}
                  aria-describedby="error-email hint-email"
                  className="w-full bg-transparent py-3 text-base outline-none placeholder:text-slate-400"
                />
              </InputShell>
            </Field>

            <Field id="phone" label="Nomor HP (WhatsApp)" hint="Konfirmasi dikirim ke sini." error={showError("phone")}>
              <InputShell icon={<Phone className="size-5" />} invalid={Boolean(showError("phone"))}>
                <span className="text-base font-medium text-slate-500">+62</span>
                <input
                  id="field-phone"
                  type="tel"
                  inputMode="numeric"
                  value={formatPhone(phone)}
                  onChange={(e) => setPhone(normalizePhone(e.target.value))}
                  onBlur={() => touch("phone")}
                  autoComplete="tel-national"
                  placeholder="812-3456-7890"
                  aria-invalid={Boolean(showError("phone"))}
                  aria-describedby="error-phone hint-phone"
                  className="w-full bg-transparent py-3 text-base tabular-nums outline-none placeholder:text-slate-400"
                />
              </InputShell>
            </Field>
          </div>
        </Panel>

        <Panel
          title="Slot main"
          subtitle={`Mau ajak teman? Tambahin slot, maksimal ${maxSlots} slot per booking.`}
        >
          <div className="flex flex-col gap-4">
            {slots.map((slot, i) => (
              <fieldset key={slot.id} className="relative rounded-xl border border-slate-200 p-4">
                <legend className="float-left font-bold text-slate-900">
                  Slot {i + 1}
                  <span className="ml-2 text-sm font-medium text-slate-500">{i === 0 ? "Kamu" : "Teman"}</span>
                </legend>
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => removeSlot(slot.id)}
                    aria-label={`Hapus slot ${i + 1}`}
                    className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="size-4" />
                  </button>
                )}

                <p className="clear-left pt-3 text-sm font-semibold text-slate-700">Posisi</p>
                <div role="radiogroup" aria-label={`Posisi slot ${i + 1}`} className="mt-2 grid grid-cols-2 gap-2">
                  {(["Player", "GK"] as const).map((position) => (
                    <ChoiceTile
                      key={position}
                      name={`position-${slot.id}`}
                      checked={slot.position === position}
                      onChange={() => updateSlot(slot.id, { position })}
                    >
                      <span className="font-semibold">{position === "GK" ? "Kiper (GK)" : "Player"}</span>
                      <span className="text-xs opacity-80">
                        {formatRupiah(position === "GK" ? s.gkFee : s.playerFee)}
                      </span>
                    </ChoiceTile>
                  ))}
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-700">Ukuran {outfit}</p>
                <div
                  role="radiogroup"
                  aria-label={`Ukuran ${outfit} slot ${i + 1}`}
                  aria-describedby={`error-size-${slot.id}`}
                  className="mt-2 grid grid-cols-5 gap-1.5 sm:flex sm:gap-2"
                >
                  {SIZES.map((size, sizeIndex) => (
                    <ChoiceTile
                      key={size}
                      id={sizeIndex === 0 ? `field-size-${slot.id}` : undefined}
                      name={`size-${slot.id}`}
                      checked={slot.size === size}
                      onChange={() => updateSlot(slot.id, { size })}
                      compact
                    >
                      {size}
                    </ChoiceTile>
                  ))}
                </div>
                <ErrorText id={`error-size-${slot.id}`}>{showError(`size-${slot.id}`)}</ErrorText>
              </fieldset>
            ))}

            <button
              type="button"
              onClick={addSlot}
              disabled={slots.length >= maxSlots}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent"
            >
              <Plus className="size-4" />
              {slots.length >= maxSlots ? `Udah maksimal ${maxSlots} slot` : "Tambah slot buat teman"}
            </button>
          </div>
        </Panel>
      </div>

      {/* ---------- Right: order summary ---------- */}
      <aside className="lg:sticky lg:top-28">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-bold text-slate-900">Ringkasan booking</h2>
            <div className="mt-4 flex gap-3">
              <img src={s.image} alt="" className="size-16 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="leading-snug font-bold text-slate-900">{s.title}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                  <BrandAvatar brand={community} size="xs" />
                  {community.name}
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CalendarDays className="size-4 shrink-0 text-slate-400" />
                {formatDate(s.date)}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4 shrink-0 text-slate-400" />
                {s.startTime} – {s.endTime} WIB
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-slate-400" />
                <span className="truncate">{s.location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="size-4 shrink-0 text-slate-400" />
                {slots.length} slot ·{" "}
                {[price.players && `${price.players} Player`, price.keepers && `${price.keepers} GK`]
                  .filter(Boolean)
                  .join(", ")}
              </li>
            </ul>
          </div>

          {/* Voucher: logged-in users only */}
          <div className="border-b border-slate-100 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Ticket className="size-4 text-blue-600" />
              Kode voucher
            </p>
            {!user ? (
              <p className="mt-2 text-sm text-slate-500">
                <button
                  type="button"
                  onClick={() => openAuth("login")}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Masuk dulu
                </button>{" "}
                buat pakai voucher dan dapet diskon member 10%.
              </p>
            ) : voucher ? (
              <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm ring-1 ring-emerald-200">
                <span>
                  <span className="font-mono font-bold text-emerald-700">{voucher.code}</span>
                  <span className="block text-xs text-emerald-700/80">{voucher.label}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setVoucher(null)}
                  aria-label="Hapus voucher"
                  className="flex size-7 items-center justify-center rounded-full text-emerald-700 hover:bg-emerald-100"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="mt-2 flex gap-2">
                  <input
                    value={voucherInput}
                    onChange={(e) => {
                      setVoucherInput(e.target.value.toUpperCase());
                      setVoucherError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        applyVoucher();
                      }
                    }}
                    placeholder="Masukin kode"
                    aria-label="Kode voucher"
                    aria-invalid={Boolean(voucherError)}
                    className={`min-w-0 flex-1 rounded-lg border px-3 py-2 text-base uppercase outline-none placeholder:normal-case focus:ring-4 ${
                      voucherError ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={applyVoucher}
                    disabled={!voucherInput.trim()}
                    className="rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-300"
                  >
                    Pakai
                  </button>
                </div>
                <ErrorText id="error-voucher">{voucherError}</ErrorText>
              </>
            )}
          </div>

          {/* Price details */}
          <div className="p-5">
            <p className="text-sm font-semibold text-slate-700">Rincian harga</p>
            <dl className="mt-3 space-y-2 text-sm">
              {price.players > 0 && (
                <Row label={`Player × ${price.players}`} value={formatRupiah(price.players * s.playerFee)} />
              )}
              {price.keepers > 0 && (
                <Row label={`Kiper (GK) × ${price.keepers}`} value={formatRupiah(price.keepers * s.gkFee)} />
              )}
              {price.memberDiscount > 0 && (
                <Row label="Diskon member 10%" value={`− ${formatRupiah(price.memberDiscount)}`} positive />
              )}
              {user &&
                voucher &&
                (price.voucherBlocked ? (
                  <p className="text-xs text-amber-700">
                    Voucher {voucher.code} butuh minimal {voucher.minSlots} slot, tambahin slot dulu, ya.
                  </p>
                ) : (
                  <Row label={`Voucher ${voucher.code}`} value={`− ${formatRupiah(price.voucherDiscount)}`} positive />
                ))}
              <Row label="Biaya layanan" value={formatRupiah(price.serviceFee)} />
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-slate-200 pt-4">
              <span className="font-semibold text-slate-900">Total bayar</span>
              <span className="text-2xl font-extrabold text-slate-900">{formatRupiah(price.total)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600 disabled:cursor-wait disabled:opacity-80"
            >
              {loading ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" />
                  Lagi proses...
                </>
              ) : (
                <>
                  <Lock className="size-4" />
                  Bayar {formatRupiah(price.total)}
                </>
              )}
            </button>
            {submitted && Object.keys(errors).length > 0 && (
              <p role="alert" className="mt-3 text-center text-sm text-red-600">
                Masih ada data yang belum lengkap, cek lagi, ya.
              </p>
            )}
            <p className="mt-3 text-center text-xs text-slate-500">
              Dengan lanjut bayar, kamu setuju sama peraturan main jadwal ini.
            </p>
          </div>
        </div>
      </aside>
    </form>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Row({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-600">{label}</dt>
      <dd className={`font-semibold ${positive ? "text-emerald-600" : "text-slate-900"}`}>{value}</dd>
    </div>
  );
}
