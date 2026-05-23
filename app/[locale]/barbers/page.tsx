import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BarbersGrid from "@/components/barbers/BarbersGrid";
import { prisma } from "@/app/lib/prisma";

export default async function BarbersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const barbers = await prisma.barber.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { schedules: true },
  });

  return (
    <>
      <Header locale={locale} />
      <main className="min-h-screen bg-dark-bg pt-24">
        <BarbersGrid locale={locale} barbers={barbers} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
