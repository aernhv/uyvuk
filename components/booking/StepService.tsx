import { useTranslations } from "next-intl";
import { Clock, Check } from "lucide-react";
import { cn, formatPrice, formatDuration } from "@/app/lib/utils";
import type { Service } from "@prisma/client";

interface StepServiceProps {
  locale: string;
  services: Service[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function StepService({ locale, services, selectedId, onSelect }: StepServiceProps) {
  const t = useTranslations("booking");
  const isRTL = locale === "ar";

  return (
    <div>
      <h2 className={cn("text-xl font-semibold text-cream mb-6", isRTL && "text-right")}>{t("selectService")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service) => {
          const isSelected = service.id === selectedId;
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={cn(
                "text-left p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5",
                isRTL && "text-right",
                isSelected
                  ? "border-gold bg-gold/10 shadow-[0_0_20px_rgba(201,168,76,0.2)]"
                  : "border-gold/10 bg-white/5 hover:border-gold/30"
              )}
            >
              <div className={cn("flex items-start justify-between mb-2", isRTL && "flex-row-reverse")}>
                <span className="text-cream font-semibold">
                  {locale === "ar" ? service.nameAr : service.nameEn}
                </span>
                {isSelected && (
                  <div className="w-5 h-5 gold-gradient rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                )}
              </div>
              <p className="text-cream/40 text-sm mb-3 line-clamp-2">
                {locale === "ar" ? service.descriptionAr : service.descriptionEn}
              </p>
              <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-1 text-cream/50 text-xs", isRTL && "flex-row-reverse")}>
                  <Clock className="w-3 h-3" />
                  <span>{formatDuration(service.durationMinutes, locale)}</span>
                </div>
                <span className="text-gold font-bold">{formatPrice(service.price, locale)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
