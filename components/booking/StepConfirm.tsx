"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Calendar, Clock, User, Scissors, Phone } from "lucide-react";
import { cn, formatPrice, formatDuration } from "@/app/lib/utils";
import type { BookingState } from "./BookingFlow";
import type { Service, Barber } from "@prisma/client";

interface StepConfirmProps {
  locale: string;
  booking: BookingState;
  service: Service;
  barber?: Barber;
  onConfirm: () => Promise<void>;
  onBack: () => void;
}

export default function StepConfirm({ locale, booking, service, barber, onConfirm, onBack }: StepConfirmProps) {
  const t = useTranslations("booking");
  const isRTL = locale === "ar";
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  const rows = [
    { icon: Scissors, label: t("service"), value: locale === "ar" ? service?.nameAr : service?.nameEn },
    { icon: User, label: t("barber"), value: barber ? barber.name : (isRTL ? "أي حلاق متاح" : "Any Available") },
    { icon: Calendar, label: t("date"), value: booking.date },
    { icon: Clock, label: t("time"), value: booking.timeSlot },
    { icon: Clock, label: t("duration"), value: formatDuration(service?.durationMinutes ?? 0, locale) },
    { icon: Phone, label: t("phone"), value: booking.customerPhone },
  ];

  return (
    <div>
      <h2 className={cn("text-xl font-semibold text-cream mb-6", isRTL && "text-right")}>{t("summary")}</h2>

      <div className="dark-card rounded-2xl overflow-hidden mb-6">
        {/* Price header */}
        <div className="gold-gradient p-5 flex items-center justify-between">
          <span className="font-bold text-black text-lg">{isRTL ? "إجمالي الحجز" : "Booking Total"}</span>
          <span className="font-bold text-black text-2xl">{formatPrice(service?.price ?? 0, locale)}</span>
        </div>

        {/* Details */}
        <div className="divide-y divide-gold/5">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className={cn("flex items-center gap-3 px-5 py-3.5", isRTL && "flex-row-reverse")}>
              <Icon className="w-4 h-4 text-gold/50 shrink-0" />
              <span className="text-cream/40 text-sm w-24 shrink-0">{label}</span>
              <span className="text-cream text-sm font-medium">{value}</span>
            </div>
          ))}
          {booking.customerName && (
            <div className={cn("flex items-center gap-3 px-5 py-3.5", isRTL && "flex-row-reverse")}>
              <User className="w-4 h-4 text-gold/50 shrink-0" />
              <span className="text-cream/40 text-sm w-24 shrink-0">{t("name")}</span>
              <span className="text-cream text-sm font-medium">{booking.customerName}</span>
            </div>
          )}
          {booking.notes && (
            <div className={cn("flex items-start gap-3 px-5 py-3.5", isRTL && "flex-row-reverse")}>
              <span className="text-cream/40 text-sm w-24 shrink-0 mt-0.5">
                {isRTL ? "ملاحظات" : "Notes"}
              </span>
              <span className="text-cream/70 text-sm">{booking.notes}</span>
            </div>
          )}
        </div>
      </div>

      <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
        <button type="button" onClick={onBack} className="btn-outline-gold px-6 py-3 rounded-xl text-sm" disabled={loading}>
          {t("back")}
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={cn("btn-gold flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2", isRTL && "flex-row-reverse")}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isRTL ? "جار الحجز..." : "Booking..."}</span>
            </>
          ) : (
            t("confirm")
          )}
        </button>
      </div>
    </div>
  );
}
