import { useTranslations } from "next-intl";
import Link from "next/link";
import { CheckCircle, Calendar, Scissors, User, Clock } from "lucide-react";
import { cn, formatPrice, formatDuration } from "@/app/lib/utils";
import type { BookingState } from "./BookingFlow";
import type { Service, Barber } from "@prisma/client";

interface BookingSuccessProps {
  locale: string;
  booking: BookingState;
  service: Service;
  barber?: Barber;
  confirmationId: string;
}

export default function BookingSuccess({ locale, booking, service, barber, confirmationId }: BookingSuccessProps) {
  const t = useTranslations("booking");
  const isRTL = locale === "ar";

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      {/* Success icon */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 gold-gradient rounded-full opacity-20 animate-ping" />
        <div className="relative w-24 h-24 gold-gradient rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-black" />
        </div>
      </div>

      <h1 className="text-3xl font-serif font-bold text-cream mb-2">{t("successTitle")}</h1>
      <p className="text-cream/50 mb-1">{t("successSubtitle")}</p>
      <p className="text-cream/40 text-sm mb-8">{t("successMessage")}</p>

      {/* Confirmation card */}
      <div className="dark-card rounded-2xl overflow-hidden mb-8 text-left">
        <div className="bg-gold/10 border-b border-gold/20 px-5 py-3 flex items-center justify-between">
          <span className="text-gold text-xs font-semibold uppercase tracking-wide">
            {isRTL ? "رقم الحجز" : "Booking ID"}
          </span>
          <span className="text-cream/50 text-xs font-mono">{confirmationId.slice(-8).toUpperCase()}</span>
        </div>
        <div className="divide-y divide-gold/5">
          {[
            { icon: Scissors, label: locale === "ar" ? "الخدمة" : "Service", value: locale === "ar" ? service.nameAr : service.nameEn },
            { icon: User, label: locale === "ar" ? "الحلاق" : "Barber", value: barber ? barber.name : (isRTL ? "أي حلاق" : "Any Barber") },
            { icon: Calendar, label: locale === "ar" ? "التاريخ" : "Date", value: booking.date },
            { icon: Clock, label: locale === "ar" ? "الوقت" : "Time", value: booking.timeSlot },
            { icon: Clock, label: locale === "ar" ? "المدة" : "Duration", value: formatDuration(service.durationMinutes, locale) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className={cn("flex items-center gap-3 px-5 py-3", isRTL && "flex-row-reverse")}>
              <Icon className="w-4 h-4 text-gold/50 shrink-0" />
              <span className="text-cream/40 text-sm w-20 shrink-0">{label}</span>
              <span className="text-cream text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 bg-gold/5 border-t border-gold/10 flex items-center justify-between">
          <span className="text-cream/40 text-sm">{isRTL ? "الإجمالي" : "Total"}</span>
          <span className="text-gold font-bold text-lg">{formatPrice(service.price, locale)}</span>
        </div>
      </div>

      <Link
        href={`/${locale}/booking`}
        className="btn-outline-gold inline-block px-8 py-3 rounded-full text-sm"
      >
        {t("bookAnother")}
      </Link>
    </div>
  );
}
