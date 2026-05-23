import { prisma } from "@/app/lib/prisma";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";
import { Calendar, Users, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/app/lib/utils";
import Link from "next/link";
import { format } from "date-fns";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRTL = locale === "ar";
  const now = new Date();

  const [todayCount, weekCount, totalCount, pendingCount, recentBookings] = await Promise.all([
    prisma.booking.count({
      where: { startTime: { gte: startOfDay(now), lte: endOfDay(now) }, status: { not: "cancelled" } },
    }),
    prisma.booking.count({
      where: { startTime: { gte: startOfWeek(now), lte: endOfWeek(now) }, status: { not: "cancelled" } },
    }),
    prisma.booking.count({ where: { status: { not: "cancelled" } } }),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.booking.findMany({
      where: { startTime: { gte: startOfDay(now) } },
      include: { service: true, barber: true },
      orderBy: { startTime: "asc" },
      take: 10,
    }),
  ]);

  const stats = [
    { icon: Calendar, label: isRTL ? "حجوزات اليوم" : "Today's Bookings", value: todayCount, color: "text-blue-400" },
    { icon: TrendingUp, label: isRTL ? "هذا الأسبوع" : "This Week", value: weekCount, color: "text-green-400" },
    { icon: Users, label: isRTL ? "إجمالي الحجوزات" : "Total Bookings", value: totalCount, color: "text-gold" },
    { icon: Clock, label: isRTL ? "قيد الانتظار" : "Pending", value: pendingCount, color: "text-amber-400" },
  ];

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

  return (
    <div>
      <h1 className={cn("text-2xl font-serif font-bold text-cream mb-6", isRTL && "text-right")}>
        {isRTL ? "نظرة عامة" : "Dashboard Overview"}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="dark-card rounded-2xl p-5">
            <div className={cn("flex items-center gap-3 mb-2", isRTL && "flex-row-reverse")}>
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <span className="text-cream/50 text-xs">{label}</span>
            </div>
            <div className={cn("text-3xl font-bold text-cream", isRTL && "text-right")}>{value}</div>
          </div>
        ))}
      </div>

      {/* Today's bookings */}
      <div className="dark-card rounded-2xl overflow-hidden">
        <div className={cn("flex items-center justify-between px-5 py-4 border-b border-gold/10", isRTL && "flex-row-reverse")}>
          <h2 className="text-cream font-semibold">{isRTL ? "حجوزات اليوم وما بعده" : "Upcoming Bookings"}</h2>
          <Link href={`/${locale}/dashboard/bookings`} className="text-gold text-xs hover:underline">
            {isRTL ? "عرض الكل" : "View All"}
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <div className="py-12 text-center text-cream/30 text-sm">
            {isRTL ? "لا توجد حجوزات قادمة" : "No upcoming bookings"}
          </div>
        ) : (
          <div className="divide-y divide-gold/5">
            {recentBookings.map((booking) => (
              <div key={booking.id} className={cn("flex items-center gap-4 px-5 py-3.5", isRTL && "flex-row-reverse")}>
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
    </div>
  );
}
