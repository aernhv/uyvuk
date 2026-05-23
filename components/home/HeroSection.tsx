"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight, Star, Clock, Scissors } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations("home.hero");
  const isRTL = locale === "ar";

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-charcoal to-deep" />

      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full border border-gold/20 animate-pulse" />
        <div className="absolute top-32 right-32 w-64 h-64 rounded-full border border-gold/10" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full border border-gold/10" />
      </div>

      {/* Gold radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />

      {/* Scissors decorative */}
      <div className="absolute top-1/4 right-1/4 opacity-5">
        <Scissors className="w-64 h-64 text-gold rotate-45" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-32">
        <div className={cn("max-w-3xl", isRTL && "ml-auto text-right")}>
          {/* Badge */}
          <div className={cn("inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 animate-fade-in", isRTL && "flex-row-reverse")}>
            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
            <span className="text-gold text-xs tracking-widest uppercase font-semibold">{t("badge")}</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold leading-tight mb-6 animate-slide-up">
            <span className="text-cream/90">{t("title")}</span>
            <br />
            <span className="text-gold-gradient">{t("titleHighlight")}</span>
          </h1>

          <p className={cn("text-cream/60 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl animate-slide-up", isRTL && "mr-0 ml-auto")}>
            {t("subtitle")}
          </p>

          {/* CTAs */}
          <div className={cn("flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-slide-up", isRTL && "flex-row-reverse sm:justify-end")}>
            <Link
              href={`/${locale}/booking`}
              className={cn("btn-gold px-8 py-4 rounded-full text-base font-bold flex items-center gap-2", isRTL && "flex-row-reverse")}
            >
              {t("cta")}
              <ArrowRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
            </Link>
            <Link
              href={`/${locale}/services`}
              className="btn-outline-gold px-8 py-4 rounded-full text-base"
            >
              {t("ctaSecondary")}
            </Link>
          </div>

          {/* Stats */}
          <div className={cn("flex flex-wrap items-center gap-8 mt-16 pt-8 border-t border-gold/10 animate-fade-in", isRTL && "flex-row-reverse")}>
            {[
              { value: "10+", label: isRTL ? "سنوات خبرة" : "Years Experience" },
              { value: "5K+", label: isRTL ? "عميل سعيد" : "Happy Clients" },
              { value: "★4.9", label: isRTL ? "تقييم العملاء" : "Client Rating" },
            ].map((stat) => (
              <div key={stat.label} className={cn("text-center", isRTL && "text-right")}>
                <div className="text-3xl font-serif font-bold text-gold">{stat.value}</div>
                <div className="text-xs text-cream/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent" />
      </div>
    </section>
  );
}
