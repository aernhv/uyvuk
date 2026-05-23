"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { cn, formatPrice, formatDuration } from "@/app/lib/utils";
import type { Service } from "@prisma/client";

interface ServicesGridProps {
  locale: string;
  services: Service[];
}

const serviceIcons = ["✂️", "🪒", "💈", "🧴", "🧖", "👔"];

export default function ServicesGrid({ locale, services }: ServicesGridProps) {
  const t = useTranslations("services");
  const isRTL = locale === "ar";

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={cn("mb-16", isRTL ? "text-right" : "text-center")}>
          <div className={cn("flex items-center gap-3 mb-4", isRTL ? "justify-end" : "justify-center")}>
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold text-xs tracking-widest uppercase font-semibold">
              {isRTL ? "خدماتنا الاحترافية" : "Professional Services"}
            </span>
            <div className="h-px w-10 bg-gold" />
          </div>
          <h1 className="text-5xl font-serif font-bold text-cream mb-4">{t("title")}</h1>
          <p className="text-cream/50 max-w-xl mx-auto text-lg">{t("subtitle")}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <article
              key={service.id}
              className="dark-card rounded-2xl p-7 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(201,168,76,0.12)] group flex flex-col"
            >
              {/* Icon + Price */}
              <div className={cn("flex items-start justify-between mb-5", isRTL && "flex-row-reverse")}>
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-2xl border border-gold/10 group-hover:bg-gold/20 transition-colors">
                  {serviceIcons[i % serviceIcons.length]}
                </div>
                <div className={isRTL ? "text-left" : "text-right"}>
                  <div className="text-gold font-bold text-xl">{formatPrice(service.price, locale)}</div>
                  <div className={cn("flex items-center gap-1 text-cream/40 text-xs mt-1", isRTL ? "flex-row-reverse" : "justify-end")}>
                    <Clock className="w-3 h-3" />
                    <span>{formatDuration(service.durationMinutes, locale)}</span>
                  </div>
                </div>
              </div>

              {/* Name */}
              <h2 className={cn("text-cream font-bold text-xl mb-2", isRTL && "text-right")}>
                {locale === "ar" ? service.nameAr : service.nameEn}
              </h2>

              {/* Description */}
              <p className={cn("text-cream/50 text-sm leading-relaxed flex-1 mb-6", isRTL && "text-right")}>
                {locale === "ar" ? service.descriptionAr : service.descriptionEn}
              </p>

              {/* CTA */}
              <Link
                href={`/${locale}/booking?service=${service.id}`}
                className={cn(
                  "btn-gold w-full py-3 rounded-xl text-sm font-bold text-center flex items-center justify-center gap-2",
                  isRTL && "flex-row-reverse"
                )}
              >
                {t("book")}
                <ArrowRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
