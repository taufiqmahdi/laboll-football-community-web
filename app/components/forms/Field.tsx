import type { ReactNode } from "react";

// Shared form pieces: label + hint/error wiring, an input frame with an icon, and live error text.
// Inputs inside should use id `field-${id}` and aria-describedby `error-${id} hint-${id}`.

export function Field({
  id,
  label,
  optional,
  hint,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string | false;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={`field-${id}`} className="text-sm font-semibold text-slate-700">
        {label}
        {optional && <span className="ml-1 font-normal text-slate-400">(opsional)</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <ErrorText id={`error-${id}`}>{error}</ErrorText>
      ) : (
        hint && (
          <p id={`hint-${id}`} className="mt-1.5 text-xs text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function InputShell({ icon, invalid, children }: { icon: ReactNode; invalid: boolean; children: ReactNode }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border bg-white px-3.5 text-slate-900 transition focus-within:ring-4 ${
        invalid
          ? "border-red-400 focus-within:ring-red-100"
          : "border-slate-300 focus-within:border-blue-500 focus-within:ring-blue-100"
      }`}
    >
      <span className="shrink-0 text-slate-400">{icon}</span>
      {children}
    </div>
  );
}

export function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-xs text-red-600" aria-live="polite">
      {children}
    </p>
  );
}
