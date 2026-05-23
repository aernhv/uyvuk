"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/app/lib/utils";
import type { Booking, Service, Barber } from "@prisma/client";

type BookingWithRelations = Booking & { service: Service; barber: Barber };

interface BookingsTableProps {
  locale: string;
  bookings: BookingWithRelations[];
  barbers: Barber[];
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  no_show: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function BookingsTable({ locale, bookings, barbers }: BookingsTableProps) {
  const isRTL = locale === "ar";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const statusLabels: Record<string, string> = {
    pending: isRTL ? "معلق" : "Pending",
    confirmed: isRTL ? "مؤكد" : "Confirmed",
    completed: isRTL ? "مكتمل" : "Completed",
    cancelled: isRTL ? "ملغي" : "Cancelled",
    no_show: isRTL ? "لم يحضر" : "No Show",
  };

  const updateStatus = async (bookingId: string, status: string) => {
    await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    startTransition(() => router.refresh());
  };

  const actionButtons = [
    { status: "confirmed", label: isRTL ? "تأكيد" : "Confirm", color: "text-blue-400 hover:bg-blue-500/10" },
    { status: "completed", label: isRTL ? "مكتمل" : "Complete", color: "text-green-400 hover:bg-green-500/10" },
    { status: "no_show", label: isRTL ? "لم يحضر" : "No Show", color: "text-gray-400 hover:bg-gray-500/10" },
    { status: "cancelled", label: isRTL ? "إلغاء" : "Cancel", color: "text-red-400 hover:bg-red-500/10" },
  ];

  return (
    <div>
      <h1 className={cn("text-2xl font-serif font-bold text-cream mb-6", isRTL && "text-right")}>
        {isRTL ? "الحجوزات" : "Bookings"}
      </h1>

      {bookings.length === 0 ? (
        <div className="dark-card rounded-2xl py-20 text-center text-cream/30">
          {isRTL ? "لا توجد حجوزات" : "No bookings found"}
        </div>
      ) : (
        <div className="dark-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/10 text-cream/40 text-xs uppercase tracking-wide">
                  {[
                    isRTL ? "العميل" : "Customer",
                    isRTL ? "الخدمة" : "Service",
                    isRTL ? "الحلاق" : "Barber",
                    isRTL ? "الموعد" : "Time",
                    isRTL ? "الحالة" : "Status",
                    isRTL ? "الإجراءات" : "Actions",
                  ].map((h) => (
                    <th key={h} className={cn("px-4 py-3 font-medium", isRTL ? "text-right" : "text-left")}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-cream font-medium">{booking.customerName}</div>
                      <div className="text-cream/40 text-xs">{booking.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-cream/70">
                      {locale === "ar" ? booking.service.nameAr : booking.service.nameEn}
                    </td>
                    <td className="px-4 py-3 text-cream/70">{booking.barber.name}</td>
                    <td className="px-4 py-3">
                      <div className="text-cream text-xs font-mono">{format(new Date(booking.startTime), "dd MMM, HH:mm")}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2.5 py-1 rounded-full border", STATUS_STYLES[booking.status] ?? "")}>
                        {statusLabels[booking.status] ?? booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        {actionButtons
                          .filter((a) => a.status !== booking.status)
                          .map((action) => (
                            <button
                              key={action.status}
                              onClick={() => updateStatus(booking.id, action.status)}
                              disabled={isPending}
                              className={cn("text-xs px-2 py-1 rounded-lg border border-transparent transition-colors", action.color)}
                            >
                              {action.label}
                            </button>
                          ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
