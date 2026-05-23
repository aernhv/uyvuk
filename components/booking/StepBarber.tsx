import { useTranslations } from "next-intl";
import { UserCircle2, Check, Users } from "lucide-react";
import Image from "next/image";
import { cn } from "@/app/lib/utils";
import type { Barber } from "@prisma/client";

interface StepBarberProps {
  locale: string;
  barbers: Barber[];
  selectedId: string;
  onSelect: (id: string) => void;
  onBack: () => void;
}

export default function StepBarber({ locale, barbers, selectedId, onSelect, onBack }: StepBarberProps) {
  const t = useTranslations("booking");
  const isRTL = locale === "ar";

  const handleSelect = (id: string) => onSelect(id);

  return (
    <div>
      <h2 className={cn("text-xl font-semibold text-cream mb-6", isRTL && "text-right")}>{t("selectBarber")}</h2>

      {/* Any barber option */}
      <button
        onClick={() => handleSelect("")}
        className={cn(
          "w-full text-left p-5 rounded-2xl border mb-4 transition-all duration-200",
          isRTL && "text-right",
          selectedId === ""
            ? "border-gold bg-gold/10 shadow-[0_0_20px_rgba(201,168,76,0.15)]"
            : "border-gold/10 bg-white/5 hover:border-gold/30"
        )}
      >
        <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-gold/60" />
          </div>
          <div className="flex-1">
            <div className="text-cream font-semibold">{t("anyBarber")}</div>
            <div className="text-cream/40 text-sm">{t("anyBarberDesc")}</div>
          </div>
          {selectedId === "" && (
            <div className="w-5 h-5 gold-gradient rounded-full flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-black" />
            </div>
          )}
        </div>
      </button>

      {/* Barbers list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {barbers.map((barber) => {
          const isSelected = barber.id === selectedId;
          return (
            <button
              key={barber.id}
              onClick={() => handleSelect(barber.id)}
              className={cn(
                "text-left p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5",
                isRTL && "text-right",
                isSelected
                  ? "border-gold bg-gold/10 shadow-[0_0_20px_rgba(201,168,76,0.2)]"
                  : "border-gold/10 bg-white/5 hover:border-gold/30"
              )}
            >
              <div className={cn("flex items-center gap-3 mb-2", isRTL && "flex-row-reverse")}>
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-charcoal shrink-0">
                  {barber.photoUrl ? (
                    <Image src={barber.photoUrl} alt={barber.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserCircle2 className="w-8 h-8 text-gold/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-cream font-semibold truncate">{barber.name}</div>
                  <div className="text-gold/70 text-xs truncate">
                    {locale === "ar" ? barber.specialtyAr : barber.specialtyEn}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 gold-gradient rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                )}
              </div>
              <p className="text-cream/40 text-xs line-clamp-2">
                {locale === "ar" ? barber.bioAr : barber.bioEn}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-start">
        <button onClick={onBack} className="btn-outline-gold px-6 py-2.5 rounded-xl text-sm">
          {t("back")}
        </button>
      </div>
    </div>
  );
}
