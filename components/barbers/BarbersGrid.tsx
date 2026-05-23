"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { UserCircle2, Scissors } from "lucide-react";
import { cn } from "@/app/lib/utils";
import type { Barber, BarberSchedule } from "@prisma/client";

type BarberWithSchedules = Barber & { schedules: BarberSchedule[] };

interface BarbersGridProps {
  locale: string;
  barbers: BarberWithSchedules[];
}

const dayNames = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ar: ["أحد", "اثن", "ثلا", "أرب", "خمي", "جمع", "سبت"],
};

export default function BarbersGrid({ locale, barbers }: BarbersGridProps) {
  const t = useTranslations("barbers");
  const isRTL = locale === "ar";
  const days = dayNames[locale as keyof typeof dayNames] ?? dayNames.en;

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={cn("mb-16", isRTL ? "text-right" : "text-center")}>
          <div className={cn("flex items-center gap-3 mb-4", isRTL ? "justify-end" : "justify-center")}>
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold text-xs tracking-widest uppercase font-semibold">
              {isRTL ? "فريقنا المتميز" : "Our Expert Team"}
            </span>
            <div className="h-px w-10 bg-gold" />
          </div>
          <h1 className="text-5xl font-serif font-bold text-cream mb-4">{t("title")}</h1>
          <p className="text-cream/50 max-w-xl mx-auto text-lg">{t("subtitle")}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barbers.map((barber) => {
            const workDays = barber.schedules
              .filter((s) => !s.isOff)
              .map((s) => s.dayOfWeek);

            return (
              <article
                key={barber.id}
                className="dark-card rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(201,168,76,0.12)] group"
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-charcoal to-deep overflow-hidden">
                  {barber.photoUrl ? (
                    <Image
                      src={barber.photoUrl}
                      alt={barber.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <UserCircle2 className="w-24 h-24 text-gold/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {/* Scissors badge */}
                  <div className="absolute top-4 right-4 w-8 h-8 gold-gradient rounded-full flex items-center justify-center">
                    <Scissors className="w-4 h-4 text-black" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Info */}
                <div className={cn("p-6", isRTL && "text-right")}>
                  <h2 className="text-cream font-bold text-xl mb-1">{barber.name}</h2>
                  <p className="text-gold text-sm font-medium mb-3">
                    {locale === "ar" ? barber.specialtyAr : barber.specialtyEn}
                  </p>
                  <p className="text-cream/50 text-sm leading-relaxed mb-5 line-clamp-2">
                    {locale === "ar" ? barber.bioAr : barber.bioEn}
                  </p>

                  {/* Work days */}
                  <div className={cn("flex flex-wrap gap-1 mb-5", isRTL && "flex-row-reverse")}>
                    {days.map((day, idx) => (
                      <span
                        key={idx}
                        className={cn(
                          "text-[10px] px-2 py-1 rounded-md font-medium transition-colors",
                          workDays.includes(idx)
                            ? "bg-gold/20 text-gold border border-gold/20"
                            : "bg-white/5 text-cream/20 border border-white/5"
                        )}
                      >
                        {day}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/${locale}/booking?barber=${barber.id}`}
                    className={cn(
                      "btn-outline-gold w-full py-2.5 rounded-xl text-sm font-semibold text-center block",
                    )}
                  >
                    {t("book")} {barber.name}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
