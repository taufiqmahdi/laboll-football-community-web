"use client";

import { useEffect, useState } from "react";
import { Check, Share2 } from "@/app/components/icons";

// Native share sheet where the browser has one, otherwise copy the link.
// Icon-only by default; pass `label` for a pill with text.
export default function ShareButton({ title, path, label }: { title: string; path: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function share() {
    const url = new URL(path, window.location.origin).toString();
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        // Closing the share sheet isn't a failure.
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard blocked: nothing sensible left to do.
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={share}
        aria-label={label ? undefined : `Bagikan: ${title}`}
        className={`flex h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold ring-1 transition ${
          label ? "px-5" : "w-11"
        } ${
          copied ? "bg-emerald-50 text-emerald-600 ring-emerald-300" : "text-slate-500 ring-slate-200 hover:text-blue-600 hover:ring-blue-300"
        }`}
      >
        {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
        {label}
      </button>
      <span
        role="status"
        className={`pointer-events-none absolute right-0 bottom-full mb-2 rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-white transition ${
          copied ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        {copied ? "Link disalin!" : ""}
      </span>
    </div>
  );
}
