import type { ReactNode } from "react";

// A real radio input (keyboard + screen readers) styled as a tile.
export default function ChoiceTile({
  id,
  name,
  checked,
  onChange,
  compact,
  children,
}: {
  id?: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="cursor-pointer">
      <input id={id} type="radio" name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`flex flex-col items-center justify-center rounded-xl border text-sm transition peer-focus-visible:ring-4 peer-focus-visible:ring-blue-100 ${
          compact ? "px-1 py-2 font-semibold sm:min-w-12 sm:px-3" : "px-3 py-2.5"
        } ${
          checked
            ? "border-blue-500 bg-blue-500 text-white"
            : "border-slate-300 bg-white text-slate-700 hover:border-blue-300"
        }`}
      >
        {children}
      </span>
    </label>
  );
}
