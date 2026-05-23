import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Header locale={locale} />
      <main className="min-h-screen bg-dark-bg pt-24">
        <GalleryGrid locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
