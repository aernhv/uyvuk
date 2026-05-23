import { prisma } from "@/app/lib/prisma";
import BookingsTable from "@/components/dashboard/BookingsTable";

export default async function BookingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ date?: string; barberId?: string; status?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;

  const where: any = {};
  if (sp.status) where.status = sp.status;
  if (sp.barberId) where.barberId = sp.barberId;
  if (sp.date) {
    where.startTime = {
      gte: new Date(`${sp.date}T00:00:00`),
      lt: new Date(`${sp.date}T23:59:59`),
    };
  }

  const [bookings, barbers] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { service: true, barber: true },
      orderBy: { startTime: "desc" },
    }),
    prisma.barber.findMany({ where: { isActive: true } }),
  ]);

  return <BookingsTable locale={locale} bookings={bookings} barbers={barbers} />;
}
