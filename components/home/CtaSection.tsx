import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface CtaSectionProps {
  locale: string;
}

export default function CtaSection({ locale }: CtaSectionProps) {
  const t = useTranslations("home.cta");
  const isRTL = locale === "ar";

  return (
    <section className="py-24 bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 gold-gradient opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-deep to-charcoal" />
          <div className="absolute inset-0 border border-gold/20 rounded-3xl" />

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-gold/10" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-gold/10" />

          <div className="relative py-20 px-8">
            <div className="w-16 h-16 mx-auto gold-gradient rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-7 h-7 text-black" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-cream mb-4">
              {t("title")}
            </h2>
            <p className="text-cream/50 text-lg mb-10 max-w-md mx-auto">{t("subtitle")}</p>
            <Link
              href={`/${locale}/booking`}
              className={cn("btn-gold inline-flex items-center gap-2 px-10 py-4 rounded-full text-lg font-bold", isRTL && "flex-row-reverse")}
            >
              {t("button")}
              <ArrowRight className={cn("w-5 h-5", isRTL && "rotate-180")} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
