import { prisma } from "@/app/lib/prisma";
import ServicesManager from "@/components/dashboard/ServicesManager";

export default async function DashboardServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  return <ServicesManager locale={locale} services={services} />;
}
