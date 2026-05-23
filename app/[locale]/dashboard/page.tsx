import { prisma } from "@/app/lib/prisma";
import {
  startOfDay, endOfDay, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, format, subDays,
} from "date-fns";
import { Calendar, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn, formatPrice } from "@/app/lib/utils";
import Link from "next/link";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRTL = locale === "ar";
  const now = new Date();

  const [
    todayCount,
    weekCount,
    monthCount,
    pendingCount,
    completedCount,
    cancelledCount,
    recentBookings,
    topServices,
    topBarbers,
    revenue,
  ] = await Promise.all([
    prisma.booking.count({
      where: { startTime: { gte: startOfDay(now), lte: endOfDay(now) }, status: { not: "cancelled" } },
    }),
    prisma.booking.count({
      where: { startTime: { gte: startOfWeek(now), lte: endOfWeek(now) }, status: { not: "cancelled" } },
    }),
    prisma.booking.count({
      where: { startTime: { gte: startOfMonth(now), lte: endOfMonth(now) }, status: { not: "cancelled" } },
    }),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.booking.count({ where: { status: "completed" } }),
    prisma.booking.count({ where: { status: "cancelled" } }),
    prisma.booking.findMany({
      where: { startTime: { gte: startOfDay(now) } },
      include: { service: true, barber: true },
      orderBy: { startTime: "asc" },
      take: 8,
    }),
    prisma.booking.groupBy({
      by: ["serviceId"],
      where: { status: { in: ["completed", "confirmed"] } },
      _count: { serviceId: true },
      orderBy: { _count: { serviceId: "desc" } },
      take: 3,
    }),
    prisma.booking.groupBy({
      by: ["barberId"],
      where: { status: { in: ["completed", "confirmed"] } },
      _count: { barberId: true },
      orderBy: { _count: { barberId: "desc" } },
      take: 3,
    }),
    prisma.booking.findMany({
      where: { status: "completed" },
      include: { service: true },
    }),
  ]);

  const totalRevenue = revenue.reduce((sum, b) => sum + b.service.price, 0);
  const monthRevenue = revenue
    .filter((b) => new Date(b.startTime) >= startOfMonth(now))
    .reduce((sum, b) => sum + b.service.price, 0);

  // Resolve service/barber names for groupBy results
  const [serviceDetails, barberDetails] = await Promise.all([
    prisma.service.findMany({ where: { id: { in: topServices.map((s) => s.serviceId) } } }),
    prisma.barber.findMany({ where: { id: { in: topBarbers.map((b) => b.barberId) } } }),
  ]);

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    no_show: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  const statusLabels: Record<string, string> = {
    pending: isRTL ? "معلق" : "Pending",
    confirmed: isRTL ? "مؤكد" : "Confirmed",
    completed: isRTL ? "مكتمل" : "Completed",
    cancelled: isRTL ? "ملغي" : "Cancelled",
    no_show: isRTL ? "لم يحضر" : "No Show",
  };

  const mainStats = [
    { icon: Calendar, label: isRTL ? "حجوزات اليوم" : "Today", value: todayCount, color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: TrendingUp, label: isRTL ? "هذا الأسبوع" : "This Week", value: weekCount, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { icon: Users, label: isRTL ? "هذا الشهر" : "This Month", value: monthCount, color: "text-gold", bg: "bg-gold/10" },
    { icon: Clock, label: isRTL ? "قيد الانتظار" : "Pending", value: pendingCount, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  const statusStats = [
    { icon: CheckCircle, label: isRTL ? "مكتملة" : "Completed", value: completedCount, color: "text-green-400" },
    { icon: XCircle, label: isRTL ? "ملغاة" : "Cancelled", value: cancelledCount, color: "text-red-400" },
  ];

  return (
    <div className={cn(isRTL && "text-right")}>
      <div className={cn("flex items-center justify-between mb-6", isRTL && "flex-row-reverse")}>
        <div>
          <h1 className="text-2xl font-serif font-bold text-cream">
            {isRTL ? "نظرة عامة" : "Dashboard Overview"}
          </h1>
          <p className="text-cream/40 text-sm mt-0.5">
            {format(now, "EEEE, d MMMM yyyy")}
          </p>
        </div>
        <Link href={`/${locale}/dashboard/bookings`} className="btn-gold px-4 py-2 rounded-xl text-sm font-semibold">
          {isRTL ? "عرض الحجوزات" : "All Bookings"}
        </Link>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {[
          { label: isRTL ? "إجمالي الإيرادات" : "Total Revenue", value: formatPrice(totalRevenue, locale), sub: isRTL ? "من الحجوزات المكتملة" : "from completed bookings" },
          { label: isRTL ? "إيرادات الشهر" : "Month Revenue", value: formatPrice(monthRevenue, locale), sub: format(now, "MMMM yyyy") },
        ].map((card) => (
          <div key={card.label} className="dark-card rounded-2xl p-5">
            <p className="text-cream/40 text-xs mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-gold">{card.value}</p>
            <p className="text-cream/30 text-xs mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {mainStats.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="dark-card rounded-2xl p-5">
            <div className={cn("flex items-center gap-3 mb-2", isRTL && "flex-row-reverse")}>
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <span className="text-cream/50 text-xs">{label}</span>
            </div>
            <div className="text-3xl font-bold text-cream">{value}</div>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {statusStats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="dark-card rounded-2xl p-4 flex items-center gap-3">
            <Icon className={cn("w-5 h-5 shrink-0", color)} />
            <div>
              <div className="text-cream font-semibold text-lg">{value}</div>
              <div className="text-cream/40 text-xs">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's bookings */}
        <div className="dark-card rounded-2xl overflow-hidden lg:col-span-2">
          <div className={cn("flex items-center justify-between px-5 py-4 border-b border-gold/10", isRTL && "flex-row-reverse")}>
            <h2 className="text-cream font-semibold">{isRTL ? "حجوزات اليوم وما بعده" : "Upcoming Today"}</h2>
            <Link href={`/${locale}/dashboard/bookings`} className="text-gold text-xs hover:underline">
              {isRTL ? "عرض الكل" : "View All"}
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="py-12 text-center text-cream/30 text-sm">
              {isRTL ? "لا توجد حجوزات" : "No upcoming bookings today"}
            </div>
          ) : (
            <div className="divide-y divide-gold/5">
              {recentBookings.map((booking) => (
                <div key={booking.id} className={cn("flex items-center gap-4 px-5 py-3", isRTL && "flex-row-reverse")}>
                  <div className="text-center w-14 shrink-0">
                    <div className="text-gold font-bold text-sm">{format(new Date(booking.startTime), "HH:mm")}</div>
                    <div className="text-cream/30 text-xs">{format(new Date(booking.startTime), "dd MMM")}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-cream text-sm font-medium truncate">{booking.customerName}</div>
                    <div className="text-cream/40 text-xs truncate">
                      {locale === "ar" ? booking.service.nameAr : booking.service.nameEn} · {booking.barber.name}
                    </div>
                  </div>
                  <span className={cn("text-xs px-2.5 py-1 rounded-full border shrink-0", statusColors[booking.status] ?? "")}>
                    {statusLabels[booking.status] ?? booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top services + barbers */}
        <div className="space-y-4">
          <div className="dark-card rounded-2xl p-5">
            <h3 className={cn("text-cream font-semibold mb-4 text-sm", isRTL && "text-right")}>
              {isRTL ? "أكثر الخدمات حجزاً" : "Top Services"}
            </h3>
            {topServices.length === 0 ? (
              <p className="text-cream/30 text-xs">{isRTL ? "لا بيانات بعد" : "No data yet"}</p>
            ) : (
              <div className="space-y-3">
                {topServices.map((ts, i) => {
                  const svc = serviceDetails.find((s) => s.id === ts.serviceId);
                  if (!svc) return null;
                  return (
                    <div key={ts.serviceId} className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                      <span className="text-gold/60 text-xs font-bold w-4">#{i + 1}</span>
                      <span className="flex-1 text-cream/70 text-xs truncate">
                        {locale === "ar" ? svc.nameAr : svc.nameEn}
                      </span>
                      <span className="text-gold text-xs font-semibold">{ts._count.serviceId}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="dark-card rounded-2xl p-5">
            <h3 className={cn("text-cream font-semibold mb-4 text-sm", isRTL && "text-right")}>
              {isRTL ? "أكثر الحلاقين حجزاً" : "Top Barbers"}
            </h3>
            {topBarbers.length === 0 ? (
              <p className="text-cream/30 text-xs">{isRTL ? "لا بيانات بعد" : "No data yet"}</p>
            ) : (
              <div className="space-y-3">
                {topBarbers.map((tb, i) => {
                  const barber = barberDetails.find((b) => b.id === tb.barberId);
                  if (!barber) return null;
                  return (
                    <div key={tb.barberId} className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                      <span className="text-gold/60 text-xs font-bold w-4">#{i + 1}</span>
                      <span className="flex-1 text-cream/70 text-xs truncate">{barber.name}</span>
                      <span className="text-gold text-xs font-semibold">{tb._count.barberId}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
