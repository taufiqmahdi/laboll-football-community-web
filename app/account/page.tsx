import type { Metadata } from "next";
import AccountView from "@/app/components/account/AccountView";

export const metadata: Metadata = {
  title: "Akun Saya · Laboll",
  robots: { index: false }, // personal page
};

export default function AccountPage() {
  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      <div className="mx-auto max-w-5xl px-4 pt-8 md:px-8 md:pt-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Akun Saya</h1>
        <div className="mt-6">
          <AccountView />
        </div>
      </div>
    </main>
  );
}
