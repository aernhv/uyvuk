"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface GalleryGridProps {
  locale: string;
}

// Placeholder gallery items (in production these come from DB or CMS)
const galleryItems = [
  { id: 1, label: "Classic Fade", labelAr: "تيبر كلاسيك", color: "from-stone-800 to-stone-900", emoji: "✂️" },
  { id: 2, label: "Beard Trim", labelAr: "تشذيب اللحية", color: "from-amber-950 to-stone-900", emoji: "🪒" },
  { id: 3, label: "Pompadour", labelAr: "بومبادور", color: "from-neutral-800 to-zinc-900", emoji: "💈" },
  { id: 4, label: "Skin Fade", labelAr: "سكين فيد", color: "from-stone-700 to-stone-900", emoji: "✂️" },
  { id: 5, label: "Crew Cut", labelAr: "كرو كت", color: "from-zinc-800 to-neutral-900", emoji: "💈" },
  { id: 6, label: "Hot Towel Shave", labelAr: "حلاقة بالمنشفة الساخنة", color: "from-amber-900 to-stone-900", emoji: "🪒" },
  { id: 7, label: "Taper Fade", labelAr: "تيبر فيد", color: "from-stone-800 to-zinc-900", emoji: "✂️" },
  { id: 8, label: "Afro Trim", labelAr: "قص أفرو", color: "from-neutral-700 to-stone-900", emoji: "💈" },
  { id: 9, label: "Line Up", labelAr: "لاين أب", color: "from-stone-900 to-zinc-900", emoji: "✂️" },
];

export default function GalleryGrid({ locale }: GalleryGridProps) {
  const t = useTranslations("gallery");
  const isRTL = locale === "ar";
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={cn("mb-16", isRTL ? "text-right" : "text-center")}>
          <div className={cn("flex items-center gap-3 mb-4", isRTL ? "justify-end" : "justify-center")}>
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold text-xs tracking-widest uppercase font-semibold">
              {isRTL ? "أعمالنا" : "Our Work"}
            </span>
            <div className="h-px w-10 bg-gold" />
          </div>
          <h1 className="text-5xl font-serif font-bold text-cream mb-4">{t("title")}</h1>
          <p className="text-cream/50 max-w-xl mx-auto text-lg">{t("subtitle")}</p>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {galleryItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={cn(
                "relative rounded-2xl overflow-hidden cursor-pointer group",
                i % 5 === 0 ? "col-span-2 aspect-video" : "aspect-square",
                "border border-gold/10 hover:border-gold/30 transition-all duration-300"
              )}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl opacity-30 group-hover:opacity-50 transition-opacity">
                  {item.emoji}
                </span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end p-4">
                <span className="text-cream/0 group-hover:text-cream text-sm font-medium transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  {isRTL ? item.labelAr : item.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 w-10 h-10 glass rounded-full flex items-center justify-center text-cream hover:text-gold transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          {(() => {
            const item = galleryItems.find((g) => g.id === selected)!;
            return (
              <div className={`w-full max-w-2xl rounded-2xl overflow-hidden bg-gradient-to-br ${item.color} aspect-video flex items-center justify-center`}>
                <div className="text-center">
                  <span className="text-8xl">{item.emoji}</span>
                  <p className="text-cream/60 mt-4">{isRTL ? item.labelAr : item.label}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </section>
  );
}
