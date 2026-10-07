"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { ErrorText, Field, InputShell } from "@/app/components/forms/Field";
import { themes } from "@/app/components/tournament/theme";
import {
  CalendarDays,
  Check,
  LoaderCircle,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Shield,
  Trophy,
  UserRound,
  Users,
  X,
} from "@/app/components/icons";
import { totalPrize, type Tournament } from "@/app/data/tournaments";
import { newBookingId } from "@/app/lib/bookingId";
import { formatDate, formatDayMonth, formatJuta, formatRupiah } from "@/app/lib/format";
import { formatPhone, isValidPhone, normalizePhone } from "@/app/lib/phone";
import { countdownLabel, registrationState } from "@/app/lib/tournamentStatus";
import { useToday } from "@/app/lib/useToday";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TEAM_NAME = 30;

type Player = { id: number; number: string; name: string };

export default function TournamentRegistration({
  tournament: t,
  takenNames,
  minPlayers,
  maxPlayers,
  technicalMeeting,
}: {
  tournament: Tournament;
  takenNames: string[]; // teams already registered
  minPlayers: number;
  maxPlayers: number;
  technicalMeeting: string;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { state, daysLeft } = registrationState(t, useToday());
  const nextPlayerId = useRef(0);
  const focusPlayerId = useRef<number | null>(null);

  const [teamName, setTeamName] = useState("");
  const [area, setArea] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // When someone logs in (or arrives logged in), fill whatever they haven't typed yet.
  const [prefilledFor, setPrefilledFor] = useState<string | null>(null);
  if (user && prefilledFor !== user.email) {
    setPrefilledFor(user.email);
    setName((v) => v || user.name);
    setEmail((v) => v || user.email);
    setPhone((v) => v || user.phone);
  }

  // Errors in on-screen order, so the first key is the first field to fix.
  const errors: Record<string, string> = {};
  const trimmedTeam = teamName.trim();
  if (trimmedTeam.length < 3) errors["team-name"] = "Nama tim minimal 3 karakter, ya.";
  else if (takenNames.some((n) => n.toLowerCase() === trimmedTeam.toLowerCase()))
    errors["team-name"] = "Nama tim ini udah dipakai tim lain. Coba nama lain, ya.";
  if (name.trim().length < 2) errors.name = "Nama kapten wajib diisi, ya.";
  if (email && !EMAIL_RE.test(email)) errors.email = "Format email-nya kayaknya belum bener.";
  if (!phone) errors.phone = "Nomor HP wajib diisi buat konfirmasi pendaftaran.";
  else if (!isValidPhone(phone)) errors.phone = "Nomor HP-nya belum valid. Contoh: 812-3456-7890";
  const seenNumbers = new Set<string>();
  players.forEach((p, i) => {
    if (!p.number) errors[`player-number-${p.id}`] = `Isi nomor punggung pemain ${i + 1}.`;
    else if (seenNumbers.has(String(Number(p.number))))
      errors[`player-number-${p.id}`] = `Nomor ${Number(p.number)} udah dipakai pemain lain.`;
    if (p.number) seenNumbers.add(String(Number(p.number)));
    if (p.name.trim().length < 2) errors[`player-name-${p.id}`] = `Isi nama pemain ${i + 1}.`;
  });
  if (!agreed) errors.agree = "Centang dulu persetujuan peraturannya, ya.";

  const showError = (field: string) => (submitted || touched[field]) && errors[field];
  const touch = (field: string) => setTouched((all) => ({ ...all, [field]: true }));

  const updatePlayer = (id: number, patch: Partial<Player>) =>
    setPlayers((all) => all.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const addPlayer = () => {
    if (players.length >= maxPlayers) return;
    const id = nextPlayerId.current++;
    focusPlayerId.current = id;
    setPlayers((all) => [...all, { id, number: "", name: "" }]);
  };
  const removePlayer = (id: number) => setPlayers((all) => all.filter((p) => p.id !== id));

  // Focus a newly added row's number field right after it renders. An effect (not requestAnimationFrame)
  // so it still happens when the tab isn't painting, e.g. in the background.
  useEffect(() => {
    if (focusPlayerId.current === null) return;
    document.getElementById(`field-player-number-${focusPlayerId.current}`)?.focus();
    focusPlayerId.current = null;
  }, [players]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (state !== "open") return;
    setSubmitted(true);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      document.getElementById(`field-${firstError}`)?.focus();
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // pretend to create the registration
    router.push(`/payment?booking=${newBookingId()}`);
  };

  const slotsLeft = t.teamsTotal - t.teamsRegistered;
  // Only rows with both a number and a name count towards the minimum.
  const completePlayers = players.filter((p) => p.number && p.name.trim().length >= 2).length;
  const playersNote =
    completePlayers >= minPlayers
      ? `Udah ${completePlayers} pemain lengkap, minimal ${minPlayers} terpenuhi.`
      : `Minimal ${minPlayers} pemain, bisa dilengkapi sampai technical meeting (${formatDate(technicalMeeting)}).`;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
      {/* ---------- Left: team, captain, players ---------- */}
      <div className="flex min-w-0 flex-col gap-6">
        <Panel title="Data tim" subtitle="Nama ini yang bakal muncul di bagan dan papan skor.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="team-name"
              label="Nama tim"
              hint={`Maksimal ${MAX_TEAM_NAME} karakter.`}
              error={showError("team-name")}
              className="sm:col-span-2"
            >
              <InputShell icon={<Shield className="size-5" />} invalid={Boolean(showError("team-name"))}>
                <input
                  id="field-team-name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value.slice(0, MAX_TEAM_NAME))}
                  onBlur={() => touch("team-name")}
                  autoComplete="off"
                  placeholder="Contoh: Garuda Muda"
                  aria-invalid={Boolean(showError("team-name"))}
                  aria-describedby="error-team-name hint-team-name"
                  className="w-full bg-transparent py-3 text-base outline-none placeholder:text-slate-400"
                />
              </InputShell>
            </Field>

            <Field id="area" label="Asal tim" optional hint="Kota atau area basecamp tim." className="sm:col-span-2">
              <InputShell icon={<MapPin className="size-5" />} invalid={false}>
                <input
                  id="field-area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Contoh: Kemang, Jakarta Selatan"
                  aria-describedby="hint-area"
                  className="w-full bg-transparent py-3 text-base outline-none placeholder:text-slate-400"
                />
              </InputShell>
            </Field>
          </div>
        </Panel>

        <Panel title="Kontak kapten" subtitle="Admin bakal ngabarin soal pendaftaran dan jadwal lewat kontak ini.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="name" label="Nama kapten" error={showError("name")} className="sm:col-span-2">
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

            <Field id="email" label="Email" optional hint="Buat kirim bukti pendaftaran." error={showError("email")}>
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
                  className="w-full min-w-0 bg-transparent py-3 text-base tabular-nums outline-none placeholder:text-slate-400"
                />
              </InputShell>
            </Field>
          </div>
        </Panel>

        <Panel title="Daftar pemain" subtitle={playersNote} aside={`${players.length}/${maxPlayers}`}>
          {players.length > 0 && (
            <>
              <div aria-hidden className="mb-2 grid grid-cols-[4rem_1fr_2.25rem] gap-2 text-xs font-semibold text-slate-500">
                <span className="text-center">No.</span>
                <span>Nama pemain</span>
              </div>
              <ol className="flex flex-col gap-3">
                {players.map((p, i) => {
                  const numberError = showError(`player-number-${p.id}`);
                  const nameError = showError(`player-name-${p.id}`);
                  return (
                    <li key={p.id}>
                      <div className="grid grid-cols-[4rem_1fr_2.25rem] items-center gap-2">
                        <label htmlFor={`field-player-number-${p.id}`} className="sr-only">
                          Nomor punggung pemain {i + 1}
                        </label>
                        <input
                          id={`field-player-number-${p.id}`}
                          value={p.number}
                          onChange={(e) => updatePlayer(p.id, { number: e.target.value.replace(/\D/g, "").slice(0, 2) })}
                          onBlur={() => touch(`player-number-${p.id}`)}
                          inputMode="numeric"
                          placeholder="10"
                          aria-invalid={Boolean(numberError)}
                          aria-describedby={`error-player-${p.id}`}
                          className={`w-full rounded-xl border bg-white py-3 text-center text-base tabular-nums outline-none placeholder:text-slate-400 focus:ring-4 ${
                            numberError ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                          }`}
                        />
                        <label htmlFor={`field-player-name-${p.id}`} className="sr-only">
                          Nama pemain {i + 1}
                        </label>
                        <input
                          id={`field-player-name-${p.id}`}
                          value={p.name}
                          onChange={(e) => updatePlayer(p.id, { name: e.target.value })}
                          onBlur={() => touch(`player-name-${p.id}`)}
                          autoComplete="off"
                          placeholder={`Pemain ${i + 1}`}
                          aria-invalid={Boolean(nameError)}
                          aria-describedby={`error-player-${p.id}`}
                          className={`w-full min-w-0 rounded-xl border bg-white px-3.5 py-3 text-base outline-none placeholder:text-slate-400 focus:ring-4 ${
                            nameError ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => removePlayer(p.id)}
                          aria-label={`Hapus pemain ${i + 1}`}
                          className="flex size-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <ErrorText id={`error-player-${p.id}`}>
                        {[numberError, nameError].filter(Boolean).join(" ")}
                      </ErrorText>
                    </li>
                  );
                })}
              </ol>
            </>
          )}

          <button
            type="button"
            onClick={addPlayer}
            disabled={players.length >= maxPlayers}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent ${
              players.length > 0 ? "mt-4" : ""
            }`}
          >
            <Plus className="size-4" />
            {players.length >= maxPlayers ? `Udah maksimal ${maxPlayers} pemain` : "Tambah pemain"}
          </button>
        </Panel>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              id="field-agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              aria-invalid={Boolean(showError("agree"))}
              aria-describedby="error-agree"
              className="peer sr-only"
            />
            <span
              aria-hidden
              className={`flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition peer-focus-visible:ring-4 peer-focus-visible:ring-blue-100 ${
                agreed ? "border-blue-500 bg-blue-500 text-white" : showError("agree") ? "border-red-400" : "border-slate-300"
              }`}
            >
              {agreed && <Check className="size-3.5" />}
            </span>
            <span className="text-sm text-slate-700">
              Tim kami udah baca dan setuju sama{" "}
              <Link href={`/tournament/${t.id}`} target="_blank" className="font-semibold text-blue-600 hover:underline">
                peraturan turnamen
              </Link>
              , termasuk soal pembayaran dan fair play.
            </span>
          </label>
          <ErrorText id="error-agree">{showError("agree")}</ErrorText>
        </section>
      </div>

      {/* ---------- Right: summary ---------- */}
      <aside className="lg:sticky lg:top-28">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="relative isolate p-5 text-white">
            <img src={t.image} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
            <div className={`absolute inset-0 -z-10 bg-linear-to-t ${themes[t.theme].poster}`} />
            <div className="absolute inset-0 -z-10 bg-slate-950/30" />
            <p className="text-[11px] font-semibold tracking-[0.2em] text-white/80 uppercase">{t.edition}</p>
            <p className="mt-1 text-2xl leading-none font-black tracking-tight uppercase italic">{t.name}</p>
            <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold">
              <Trophy className="size-4" />
              Total hadiah Rp {formatJuta(totalPrize(t))}
            </p>
          </div>

          <div className="border-b border-slate-100 p-5">
            <ul className="space-y-1.5 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" />
                {formatDayMonth(t.startDate)} – {formatDayMonth(t.endDate)}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />
                {t.location}
              </li>
              <li className="flex items-start gap-2">
                <Users className="mt-0.5 size-4 shrink-0 text-slate-400" />
                Sisa {slotsLeft} dari {t.teamsTotal} slot tim
              </li>
            </ul>
          </div>

          <div className="p-5">
            <dl className="space-y-2 text-sm">
              <Row label="Biaya pendaftaran" value={formatRupiah(t.entryFee)} />
              {state === "open" && daysLeft !== null && <Row label="Pendaftaran tutup" value={countdownLabel(daysLeft)} warn />}
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-slate-200 pt-4">
              <span className="font-semibold text-slate-900">Total bayar</span>
              <span className="text-2xl font-extrabold text-slate-900">{formatRupiah(t.entryFee)}</span>
            </div>

            {state === "open" ? (
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
                    Daftar & Bayar {formatRupiah(t.entryFee)}
                  </>
                )}
              </button>
            ) : (
              <p role="status" className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-600">
                Pendaftaran udah ditutup.
              </p>
            )}
            {submitted && Object.keys(errors).length > 0 && (
              <p role="alert" className="mt-3 text-center text-sm text-red-600">
                Masih ada data yang belum lengkap, cek lagi, ya.
              </p>
            )}
            <p className="mt-3 text-center text-xs text-slate-500">
              Slot tim dikunci begitu pembayaran masuk, maksimal 3 hari setelah daftar.
            </p>
          </div>
        </div>
      </aside>
    </form>
  );
}

function Panel({ title, subtitle, aside, children }: { title: string; subtitle: string; aside?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {aside && <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{aside}</span>}
      </div>
      <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Row({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-600">{label}</dt>
      <dd className={`font-semibold ${warn ? "text-red-600" : "text-slate-900"}`}>{value}</dd>
    </div>
  );
}
