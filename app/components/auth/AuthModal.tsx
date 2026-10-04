"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { AuthMode } from "@/app/components/auth/AuthProvider";
import { Field, InputShell } from "@/app/components/forms/Field";
import { Eye, EyeOff, LoaderCircle, Lock, Mail, Phone, UserRound, X } from "@/app/components/icons";
import { DEMO_ACCOUNT, login, register, type User } from "@/app/lib/auth";
import { formatPhone, isValidPhone, normalizePhone } from "@/app/lib/phone";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

// Login + register in one native <dialog>: focus trapping, Esc to close and the
// backdrop come from the browser.
export default function AuthModal({
  mode,
  onModeChange,
  onClose,
  onSuccess,
}: {
  mode: AuthMode | null;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onSuccess: (user: User, isNew: boolean) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (mode && !dialog.open) dialog.showModal();
    if (!mode && dialog.open) dialog.close();
    // React doesn't render the `autofocus` attribute, so focus the form's first field ourselves.
    if (mode) dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    document.documentElement.classList.toggle("overflow-hidden", Boolean(mode));
  }, [mode]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="auth-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // click on the backdrop
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl bg-white p-0 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm open:animate-[auth-pop_150ms_ease-out]"
    >
      {mode && (
        <div className="p-6 sm:p-8">
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-5" />
          </button>

          <img src="/logo.svg" alt="" className="size-11 rounded-full" />
          <h2 id="auth-title" className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            {mode === "login" ? "Masuk dulu, yuk!" : "Bikin akun Laboll"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {mode === "login"
              ? "Biar bisa booking lebih cepet, pakai voucher, dan dapet promo member."
              : "Gratis, cuma butuh semenit. Habis itu langsung bisa booking jadwal."}
          </p>

          {/* Switch between the two forms */}
          <div role="group" aria-label="Masuk atau daftar" className="mt-6 grid grid-cols-2 rounded-full bg-slate-100 p-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => onModeChange(m)}
                className={`rounded-full py-2 text-sm font-semibold transition ${
                  mode === m ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {m === "login" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          {/* key: switching tabs starts with a fresh form */}
          {mode === "login" ? (
            <LoginForm key="login" onSuccess={(u) => onSuccess(u, false)} onSwitch={() => onModeChange("register")} />
          ) : (
            <RegisterForm key="register" onSuccess={(u) => onSuccess(u, true)} onSwitch={() => onModeChange("login")} />
          )}
        </div>
      )}
    </dialog>
  );
}

function LoginForm({ onSuccess, onSwitch }: { onSuccess: (user: User) => void; onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const errors: Record<string, string> = {};
  if (!EMAIL_RE.test(email)) errors["auth-email"] = email ? "Format email-nya kayaknya belum bener." : "Email wajib diisi, ya.";
  if (!password) errors["auth-password"] = "Password wajib diisi, ya.";
  const show = (field: string) => submitted && errors[field];

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");
    const first = Object.keys(errors)[0];
    if (first) return document.getElementById(`field-${first}`)?.focus();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) onSuccess(result.user);
    else setServerError(result.error);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
      <EmailField value={email} onChange={setEmail} error={show("auth-email")} autoFocus />
      <PasswordField value={password} onChange={setPassword} error={show("auth-password")} autoComplete="current-password" />

      {serverError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {serverError}
        </p>
      )}

      <SubmitButton loading={loading} label="Masuk" loadingLabel="Lagi masuk..." />

      <p className="rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-800">
        Mau coba dulu? Pakai akun demo <span className="font-mono font-semibold">{DEMO_ACCOUNT.email}</span> /{" "}
        <span className="font-mono font-semibold">{DEMO_ACCOUNT.password}</span> (udah member).
      </p>

      <SwitchLine text="Belum punya akun?" action="Daftar sekarang" onClick={onSwitch} />
    </form>
  );
}

function RegisterForm({ onSuccess, onSwitch }: { onSuccess: (user: User) => void; onSwitch: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const errors: Record<string, string> = {};
  if (name.trim().length < 2) errors["auth-name"] = "Nama wajib diisi, ya.";
  if (!EMAIL_RE.test(email)) errors["auth-email"] = email ? "Format email-nya kayaknya belum bener." : "Email wajib diisi, ya.";
  if (!isValidPhone(phone)) errors["auth-phone"] = phone ? "Nomor HP-nya belum valid. Contoh: 812-3456-7890" : "Nomor HP wajib diisi, ya.";
  if (password.length < MIN_PASSWORD) errors["auth-password"] = `Password minimal ${MIN_PASSWORD} karakter, ya.`;
  const show = (field: string) => submitted && errors[field];

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");
    const first = Object.keys(errors)[0];
    if (first) return document.getElementById(`field-${first}`)?.focus();
    setLoading(true);
    const result = await register({ name, email, phone, password });
    setLoading(false);
    if (result.ok) onSuccess(result.user);
    else setServerError(result.error);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
      <Field id="auth-name" label="Nama lengkap" error={show("auth-name")}>
        <InputShell icon={<UserRound className="size-5" />} invalid={Boolean(show("auth-name"))}>
          <input
            id="field-auth-name"
            data-autofocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Contoh: Rizky Pratama"
            aria-invalid={Boolean(show("auth-name"))}
            aria-describedby="error-auth-name"
            className="w-full bg-transparent py-3 text-base outline-none placeholder:text-slate-400"
          />
        </InputShell>
      </Field>

      <EmailField value={email} onChange={setEmail} error={show("auth-email")} />

      <Field id="auth-phone" label="Nomor HP (WhatsApp)" error={show("auth-phone")}>
        <InputShell icon={<Phone className="size-5" />} invalid={Boolean(show("auth-phone"))}>
          <span className="text-base font-medium text-slate-500">+62</span>
          <input
            id="field-auth-phone"
            type="tel"
            inputMode="numeric"
            value={formatPhone(phone)}
            onChange={(e) => setPhone(normalizePhone(e.target.value))}
            autoComplete="tel-national"
            placeholder="812-3456-7890"
            aria-invalid={Boolean(show("auth-phone"))}
            aria-describedby="error-auth-phone"
            className="w-full bg-transparent py-3 text-base tabular-nums outline-none placeholder:text-slate-400"
          />
        </InputShell>
      </Field>

      <PasswordField
        value={password}
        onChange={setPassword}
        error={show("auth-password")}
        autoComplete="new-password"
        hint={`Minimal ${MIN_PASSWORD} karakter.`}
      />

      {serverError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {serverError}{" "}
          <button type="button" onClick={onSwitch} className="font-semibold underline">
            Masuk
          </button>
        </p>
      )}

      <SubmitButton loading={loading} label="Daftar" loadingLabel="Lagi bikin akun..." />
      <SwitchLine text="Udah punya akun?" action="Masuk aja" onClick={onSwitch} />
    </form>
  );
}

// ---------- shared bits ----------

function EmailField({
  value,
  onChange,
  error,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string | false;
  autoFocus?: boolean;
}) {
  return (
    <Field id="auth-email" label="Email" error={error}>
      <InputShell icon={<Mail className="size-5" />} invalid={Boolean(error)}>
        <input
          id="field-auth-email"
          type="email"
          data-autofocus={autoFocus || undefined}
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          autoComplete="email"
          placeholder="kamu@email.com"
          aria-invalid={Boolean(error)}
          aria-describedby="error-auth-email"
          className="w-full bg-transparent py-3 text-base outline-none placeholder:text-slate-400"
        />
      </InputShell>
    </Field>
  );
}

function PasswordField({
  value,
  onChange,
  error,
  autoComplete,
  hint,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string | false;
  autoComplete: "current-password" | "new-password";
  hint?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <Field id="auth-password" label="Password" error={error} hint={hint}>
      <InputShell icon={<Lock className="size-5" />} invalid={Boolean(error)}>
        <input
          id="field-auth-password"
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder="••••••••"
          aria-invalid={Boolean(error)}
          aria-describedby="error-auth-password hint-auth-password"
          className="w-full bg-transparent py-3 text-base outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Sembunyikan password" : "Lihat password"}
          aria-pressed={visible}
          className="-mr-1 flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:text-slate-700"
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </InputShell>
    </Field>
  );
}

function SubmitButton({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-1 flex items-center justify-center gap-2 rounded-full bg-blue-500 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600 disabled:cursor-wait disabled:opacity-80"
    >
      {loading && <LoaderCircle className="size-5 animate-spin" />}
      {loading ? loadingLabel : label}
    </button>
  );
}

function SwitchLine({ text, action, onClick }: { text: string; action: string; onClick: () => void }) {
  return (
    <p className="text-center text-sm text-slate-600">
      {text}{" "}
      <button type="button" onClick={onClick} className="font-semibold text-blue-600 hover:underline">
        {action}
      </button>
    </p>
  );
}

