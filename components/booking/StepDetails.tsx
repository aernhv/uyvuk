"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/app/lib/utils";
import type { BookingState } from "./BookingFlow";

interface StepDetailsProps {
  locale: string;
  booking: BookingState;
  onChange: (updates: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepDetails({ locale, booking, onChange, onNext, onBack }: StepDetailsProps) {
  const t = useTranslations("booking");
  const isRTL = locale === "ar";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking.customerName.trim() || !booking.customerPhone.trim()) return;
    onNext();
  };

  const inputClass = cn(
    "w-full bg-white/5 border border-gold/10 rounded-xl px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 transition-colors text-sm",
    isRTL && "text-right"
  );

  const labelClass = cn("block text-cream/60 text-xs mb-1.5", isRTL && "text-right");

  return (
    <form onSubmit={handleSubmit}>
      <h2 className={cn("text-xl font-semibold text-cream mb-6", isRTL && "text-right")}>
        {t("customerName")}
      </h2>

      <div className="dark-card rounded-2xl p-6 space-y-5">
        <div>
          <label className={labelClass}>{t("customerName")} *</label>
          <input
            type="text"
            value={booking.customerName}
            onChange={(e) => onChange({ customerName: e.target.value })}
            placeholder={t("namePlaceholder")}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("customerPhone")} *</label>
          <input
            type="tel"
            value={booking.customerPhone}
            onChange={(e) => onChange({ customerPhone: e.target.value })}
            placeholder={t("phonePlaceholder")}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("customerEmail")}</label>
          <input
            type="email"
            value={booking.customerEmail}
            onChange={(e) => onChange({ customerEmail: e.target.value })}
            placeholder={t("emailPlaceholder")}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("notes")}</label>
          <textarea
            value={booking.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder={t("notesPlaceholder")}
            rows={3}
            className={cn(inputClass, "resize-none")}
          />
        </div>
      </div>

      <div className={cn("flex items-center gap-3 mt-6", isRTL && "flex-row-reverse")}>
        <button type="button" onClick={onBack} className="btn-outline-gold px-6 py-3 rounded-xl text-sm">
          {t("back")}
        </button>
        <button type="submit" className="btn-gold flex-1 py-3 rounded-xl font-semibold">
          {t("next")}
        </button>
      </div>
    </form>
  );
}
