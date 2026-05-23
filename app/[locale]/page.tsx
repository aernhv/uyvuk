import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturedServices from "@/components/home/FeaturedServices";
import CtaSection from "@/components/home/CtaSection";
import { prisma } from "@/app/lib/prisma";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 3,
  });

  return (
    <>
      <Header locale={locale} />
      <main>
        <HeroSection locale={locale} />
        <AboutSection locale={locale} />
        <FeaturedServices locale={locale} services={services} />
        <CtaSection locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
