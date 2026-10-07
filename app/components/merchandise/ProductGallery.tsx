"use client";

import { useState } from "react";

// Big photo with thumbnails underneath (thumbnails only when there's more than one photo).
export default function ProductGallery({ name, images }: { name: string; images: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${name}, foto ${i + 1}`}
            aria-hidden={i !== active}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3" role="group" aria-label="Pilih foto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Lihat foto ${i + 1}`}
              aria-pressed={i === active}
              className={`size-20 overflow-hidden rounded-xl transition sm:size-24 ${
                i === active
                  ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50"
                  : "opacity-70 ring-1 ring-slate-200 hover:opacity-100"
              }`}
            >
              <img src={src} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
