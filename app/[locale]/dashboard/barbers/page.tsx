import { prisma } from "@/app/lib/prisma";
import BarbersManager from "@/components/dashboard/BarbersManager";

export default async function DashboardBarbersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const barbers = await prisma.barber.findMany({
    orderBy: { sortOrder: "asc" },
    include: { schedules: true },
  });
  return <BarbersManager locale={locale} barbers={barbers} />;
}
