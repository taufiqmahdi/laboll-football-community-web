"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Hourglass, PackageCheck, type LucideIcon } from "@/app/components/icons";
import { memberPrice, type MerchStatus, type Product } from "@/app/data/merchandise";
import { formatDayMonth, formatRupiah } from "@/app/lib/format";

export const statusInfo: Record<MerchStatus, { label: string; Icon: LucideIcon; badge: string }> = {
  ready: { label: "Ready Stock", Icon: PackageCheck, badge: "bg-emerald-500 text-white" },
  preorder: { label: "Pre-order", Icon: Hourglass, badge: "bg-amber-400 text-amber-950" },
};

// Shop card with swipeable photos. The caller sets width/visibility via className (it must include a display class).
export default function ProductCard({
  product: p,
  className,
  showPreorderInfo = false,
}: {
  product: Product;
  className: string;
  showPreorderInfo?: boolean;
}) {
  const [photo, setPhoto] = useState(0);
  const status = statusInfo[p.status];

  return (
    <article
      className={`flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md ${className}`}
    >
      {/* Photos */}
      <div className="relative aspect-square bg-slate-100">
        {p.images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${p.name}, foto ${i + 1}`}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${
              i === photo ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <span
          className={`absolute top-2 left-2 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold sm:top-3 sm:left-3 sm:text-xs ${status.badge}`}
        >
          <status.Icon className="size-3.5" />
          {status.label}
        </span>

        {p.images.length > 1 && (
          <div className="absolute inset-x-0 bottom-1 flex justify-center">
            {p.images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPhoto(i)}
                aria-label={`Lihat foto ${i + 1}`}
                aria-pressed={i === photo}
                className="p-1.5"
              >
                <span
                  className={`block h-2 rounded-full shadow ring-1 ring-black/10 transition-all ${
                    i === photo ? "w-5 bg-white" : "w-2 bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <h3 className="leading-snug font-bold text-slate-900 sm:text-lg">{p.name}</h3>

        <div>
          <p className="text-lg font-extrabold text-slate-900 sm:text-xl">{formatRupiah(p.price)}</p>
          <p className="text-xs font-semibold text-blue-600">Member {formatRupiah(memberPrice(p.price))}</p>
        </div>

        {showPreorderInfo && p.preorder && (
          <p className="flex items-start gap-1.5 text-xs text-slate-500">
            <Clock className="mt-px size-3.5 shrink-0 text-amber-500" />
            <span>
              PO sampai <span className="font-semibold text-slate-700">{formatDayMonth(p.preorder.closes)}</span>
              <span className="block">{p.preorder.ships}</span>
            </span>
          </p>
        )}

        <Link
          href={`/merchandise/${p.id}`}
          className="mt-auto rounded-full bg-blue-500 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          {p.preorder ? "Ikut Pre-order" : "Beli Sekarang"}
        </Link>
      </div>
    </article>
  );
}
