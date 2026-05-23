import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesGrid from "@/components/services/ServicesGrid";
import { prisma } from "@/app/lib/prisma";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <Header locale={locale} />
      <main className="min-h-screen bg-dark-bg pt-24">
        <ServicesGrid locale={locale} services={services} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
