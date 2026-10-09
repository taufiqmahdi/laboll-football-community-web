import type { Metadata } from "next";
import GalleryBrowser from "@/app/components/gallery/GalleryBrowser";
import { parseGalleryFilters } from "@/app/lib/galleryFilters";

export const metadata: Metadata = {
  title: "Galeri · Laboll",
  description: "Foto dan video dari tiap fun match, sparring, latihan bareng, sampai turnamen Laboll.",
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;

  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Galeri Main Bareng</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Foto dan video dari tiap game udah kita kumpulin di Google Drive. Cari sesi kamu, terus download buat feed!
        </p>

        <div className="mt-8">
          <GalleryBrowser initialFilters={parseGalleryFilters(query)} />
        </div>
      </div>
    </main>
  );
}
