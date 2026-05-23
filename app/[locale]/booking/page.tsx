import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingFlow from "@/components/booking/BookingFlow";
import { prisma } from "@/app/lib/prisma";

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string; barber?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;

  const [services, barbers] = await Promise.all([
    prisma.service.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.barber.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <>
      <Header locale={locale} />
      <main className="min-h-screen bg-dark-bg pt-24">
        <BookingFlow
          locale={locale}
          services={services}
          barbers={barbers}
          initialServiceId={sp.service}
          initialBarberId={sp.barber}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
