import { useTranslations } from "next-intl";
import { cn } from "@/app/lib/utils";

interface AboutSectionProps {
  locale: string;
}

export default function AboutSection({ locale }: AboutSectionProps) {
  const t = useTranslations("home.about");
  const isRTL = locale === "ar";

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
  ];

  return (
    <section className="py-24 bg-black section-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-16 items-center", isRTL && "lg:grid-flow-col-dense")}>
          {/* Image side */}
          <div className={cn("relative", isRTL && "lg:col-start-2")}>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-charcoal to-deep border border-gold/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto gold-gradient rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">✂️</span>
                  </div>
                  <p className="text-gold/60 text-sm">{isRTL ? "صورة الصالون" : "Shop Photo"}</p>
                </div>
              </div>
              {/* Decorative border */}
              <div className="absolute inset-3 rounded-xl border border-gold/10" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-4 animate-gold-pulse">
              <div className="text-3xl font-serif font-bold text-gold">{stats[0].value}</div>
              <div className="text-xs text-cream/60">{stats[0].label}</div>
            </div>
          </div>

          {/* Text side */}
          <div className={cn(isRTL && "lg:col-start-1 text-right")}>
            <div className={cn("inline-flex items-center gap-2 mb-4", isRTL && "flex-row-reverse")}>
              <div className="h-px w-8 bg-gold" />
              <span className="text-gold text-xs tracking-widest uppercase">{t("badge")}</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-cream mb-6">
              {t("title")}
            </h2>

            <p className="text-cream/60 text-lg leading-relaxed mb-4">{t("text1")}</p>
            <p className="text-cream/60 leading-relaxed mb-10">{t("text2")}</p>

            {/* Stats row */}
            <div className={cn("flex flex-wrap gap-8", isRTL && "flex-row-reverse")}>
              {stats.slice(1).map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-serif font-bold text-gold">{stat.value}</div>
                  <div className="text-xs text-cream/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
