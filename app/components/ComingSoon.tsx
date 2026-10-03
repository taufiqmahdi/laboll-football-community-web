import Link from "next/link";
import { SoccerBall } from "@/app/components/icons";
import type { ReactNode } from "react";

// Friendly placeholder for pages that aren't built yet.
export default function ComingSoon({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <main className="flex w-full flex-1 items-center justify-center bg-slate-50 px-4 py-20">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <SoccerBall className="size-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 md:text-3xl">{title}</h1>
        <p className="mt-2 text-slate-600">{message}</p>
        {children}
        <Link
          href="/#jadwal"
          className="mt-8 inline-block rounded-full bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
        >
          Balik ke jadwal
        </Link>
      </div>
    </main>
  );
}
