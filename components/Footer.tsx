import { useTranslations } from "next-intl";
import Link from "next/link";
import { Scissors, Share2, MessageCircle, Phone, MapPin } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations("nav");
  const tc = useTranslations("contact");
  const isRTL = locale === "ar";

  return (
    <footer className="bg-black border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-12", isRTL && "text-right")}>
          {/* Brand */}
          <div>
            <div className={cn("flex items-center gap-2 mb-4", isRTL && "justify-end")}>
              <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center">
                <Scissors className="w-4 h-4 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-serif font-bold text-gold-gradient">Royal Cuts</span>
            </div>
            <p className="text-cream/50 text-sm leading-relaxed max-w-xs">
              {isRTL
                ? "صالون حلاقة فاخر يجمع بين الأناقة الكلاسيكية والأسلوب العصري."
                : "Premium barbershop blending classic elegance with modern style."}
            </p>
            <div className={cn("flex items-center gap-3 mt-6", isRTL && "flex-row-reverse")}>
              <a href="#" className="w-9 h-9 rounded-full border border-gold/20 flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-gold/20 flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold font-semibold mb-4 tracking-wide uppercase text-xs">
              {isRTL ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              {[
                { href: `/${locale}`, label: t("home") },
                { href: `/${locale}/services`, label: t("services") },
                { href: `/${locale}/barbers`, label: t("barbers") },
                { href: `/${locale}/gallery`, label: t("gallery") },
                { href: `/${locale}/contact`, label: t("contact") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/50 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold font-semibold mb-4 tracking-wide uppercase text-xs">
              {tc("title")}
            </h3>
            <ul className="space-y-3">
              <li className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                <MapPin className="w-4 h-4 text-gold/60 mt-0.5 shrink-0" />
                <span className="text-cream/50 text-sm">{tc("addressValue")}</span>
              </li>
              <li className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <Phone className="w-4 h-4 text-gold/60 shrink-0" />
                <a href="tel:+966500000000" className="text-cream/50 hover:text-gold text-sm transition-colors">
                  {tc("phoneValue")}
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-gold/60 text-xs mb-1">{tc("hours")}</p>
              <p className="text-cream/50 text-xs">{tc("hoursSat")}</p>
              <p className="text-cream/50 text-xs">{tc("hoursFri")}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream/30 text-xs">
            © {new Date().getFullYear()} Royal Cuts. {isRTL ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <p className="text-cream/20 text-xs">
            {isRTL ? "صُنع بـ ♥" : "Crafted with ♥"}
          </p>
        </div>
      </div>
    </footer>
  );
}
