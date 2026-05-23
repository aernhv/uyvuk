"use client";

import { useTranslations } from "next-intl";
import { MapPin, Phone, Clock, Share2, MessageCircle } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useState } from "react";

interface ContactSectionProps {
  locale: string;
}

export default function ContactSection({ locale }: ContactSectionProps) {
  const t = useTranslations("contact");
  const isRTL = locale === "ar";
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={cn("mb-16", isRTL ? "text-right" : "text-center")}>
          <div className={cn("flex items-center gap-3 mb-4", isRTL ? "justify-end" : "justify-center")}>
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold text-xs tracking-widest uppercase font-semibold">
              {isRTL ? "ابقَ على تواصل" : "Get In Touch"}
            </span>
            <div className="h-px w-10 bg-gold" />
          </div>
          <h1 className="text-5xl font-serif font-bold text-cream mb-4">{t("title")}</h1>
          <p className="text-cream/50 max-w-xl mx-auto text-lg">{t("subtitle")}</p>
        </div>

        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-12 items-start")}>
          {/* Info */}
          <div className={cn("space-y-8", isRTL && "text-right lg:order-2")}>
            <div className="dark-card rounded-2xl p-7 space-y-6">
              {[
                { icon: MapPin, label: t("address"), value: t("addressValue") },
                { icon: Phone, label: t("phone"), value: t("phoneValue"), href: "tel:+966500000000" },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className={cn("flex items-start gap-4", isRTL && "flex-row-reverse")}>
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-cream/40 text-xs uppercase tracking-wide mb-1">{label}</p>
                    {href ? (
                      <a href={href} className="text-cream hover:text-gold transition-colors">{value}</a>
                    ) : (
                      <p className="text-cream">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="dark-card rounded-2xl p-7">
              <div className={cn("flex items-center gap-3 mb-4", isRTL && "flex-row-reverse")}>
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-cream font-semibold">{t("hours")}</h3>
              </div>
              <p className="text-cream/60 text-sm mb-2">{t("hoursSat")}</p>
              <p className="text-cream/60 text-sm">{t("hoursFri")}</p>
            </div>

            {/* Social */}
            <div className="dark-card rounded-2xl p-7">
              <h3 className={cn("text-cream font-semibold mb-4", isRTL && "text-right")}>{t("social")}</h3>
              <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                {[
                  { icon: Share2, label: "Instagram" },
                  { icon: MessageCircle, label: "WhatsApp" },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="flex items-center gap-2 text-cream/50 hover:text-gold transition-colors text-sm"
                  >
                    <div className="w-9 h-9 rounded-full border border-gold/20 hover:border-gold flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Map placeholder + Contact form */}
          <div className={cn("space-y-6", isRTL && "lg:order-1")}>
            {/* Map placeholder */}
            <div className="dark-card rounded-2xl overflow-hidden h-56 flex items-center justify-center border border-gold/10">
              <div className="text-center">
                <MapPin className="w-10 h-10 text-gold/30 mx-auto mb-2" />
                <p className="text-cream/30 text-sm">
                  {isRTL ? "خريطة الموقع" : "Map Location"}
                </p>
                <p className="text-cream/20 text-xs mt-1">
                  {isRTL ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div className="dark-card rounded-2xl p-7">
              <h3 className={cn("text-cream font-semibold text-lg mb-5", isRTL && "text-right")}>
                {t("sendMessage")}
              </h3>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">✓</span>
                  </div>
                  <p className="text-cream font-medium">
                    {isRTL ? "تم إرسال رسالتك بنجاح!" : "Message sent successfully!"}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { name: "name", label: t("yourName"), type: "text", placeholder: isRTL ? "اسمك الكامل" : "Your full name" },
                    { name: "phone", label: t("yourPhone"), type: "tel", placeholder: isRTL ? "05XXXXXXXX" : "+966 5XX XXX XXXX" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className={cn("block text-cream/60 text-xs mb-1.5", isRTL && "text-right")}>{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        required
                        className={cn(
                          "w-full bg-white/5 border border-gold/10 rounded-xl px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 transition-colors text-sm",
                          isRTL && "text-right"
                        )}
                      />
                    </div>
                  ))}
                  <div>
                    <label className={cn("block text-cream/60 text-xs mb-1.5", isRTL && "text-right")}>{t("yourMessage")}</label>
                    <textarea
                      rows={4}
                      placeholder={isRTL ? "رسالتك..." : "Your message..."}
                      required
                      className={cn(
                        "w-full bg-white/5 border border-gold/10 rounded-xl px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 transition-colors text-sm resize-none",
                        isRTL && "text-right"
                      )}
                    />
                  </div>
                  <button type="submit" className="btn-gold w-full py-3 rounded-xl font-semibold">
                    {t("send")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
