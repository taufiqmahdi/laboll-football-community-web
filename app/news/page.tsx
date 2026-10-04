import ComingSoon from "@/app/components/ComingSoon";

export default function NewsPage() {
  return (
    <ComingSoon
      title="Berita seru lagi kita kumpulin"
      message="Kabar terbaru dari lapangan dan komunitas bakal muncul di sini. Tungguin, ya!"
      backHref="/#berita"
      backLabel="Balik ke berita"
    />
  );
}
