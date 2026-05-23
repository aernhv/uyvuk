import { useTranslations } from "next-intl";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { cn, formatPrice, formatDuration } from "@/app/lib/utils";
import type { Service } from "@prisma/client";

interface FeaturedServicesProps {
  locale: string;
  services: Service[];
}

export default function FeaturedServices({ locale, services }: FeaturedServicesProps) {
  const t = useTranslations("home.services");
  const ts = useTranslations("services");
  const isRTL = locale === "ar";

  return (
    <section className="py-24 bg-gradient-to-b from-charcoal to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className={cn("text-center mb-16", isRTL && "text-right")}>
          <div className={cn("inline-flex items-center gap-2 mb-4", isRTL && "flex-row-reverse")}>
            <div className="h-px w-8 bg-gold" />
            <span className="text-gold text-xs tracking-widest uppercase">{t("badge")}</span>
            <div className="h-px w-8 bg-gold" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-cream mb-4">{t("title")}</h2>
          <p className="text-cream/50 max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="dark-card rounded-2xl p-6 hover:border-gold/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(201,168,76,0.1)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-xl">
                  {i === 0 ? "✂️" : i === 1 ? "🪒" : "💈"}
                </div>
                <span className="text-gold font-bold text-lg">
                  {formatPrice(service.price, locale)}
                </span>
              </div>
              <h3 className={cn("text-cream font-semibold text-lg mb-2", isRTL && "text-right")}>
                {locale === "ar" ? service.nameAr : service.nameEn}
              </h3>
              <p className={cn("text-cream/50 text-sm mb-4 line-clamp-2", isRTL && "text-right")}>
                {locale === "ar" ? service.descriptionAr : service.descriptionEn}
              </p>
              <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-1 text-cream/40 text-xs", isRTL && "flex-row-reverse")}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDuration(service.durationMinutes, locale)}</span>
                </div>
                <Link
                  href={`/${locale}/booking?service=${service.id}`}
                  className={cn("text-gold text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all group", isRTL && "flex-row-reverse")}
                >
                  {ts("book")}
                  <ChevronRight className={cn("w-3.5 h-3.5", isRTL && "rotate-180")} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href={`/${locale}/services`} className="btn-outline-gold px-8 py-3 rounded-full text-sm">
            {isRTL ? "عرض جميع الخدمات" : "View All Services"}
          </Link>
        </div>
      </div>
    </section>
  );
}
