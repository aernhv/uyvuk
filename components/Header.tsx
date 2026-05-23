"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Menu, X, Scissors } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations("nav");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isRTL = locale === "ar";
  const otherLocale = locale === "ar" ? "en" : "ar";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/services`, label: t("services") },
    { href: `/${locale}/barbers`, label: t("barbers") },
    { href: `/${locale}/gallery`, label: t("gallery") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "nav-blur bg-black/80 border-b border-gold/10 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="w-9 h-9 gold-gradient rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Scissors className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <span className="block text-lg font-serif font-bold text-gold-gradient leading-none">
                Royal Cuts
              </span>
              <span className="block text-[9px] tracking-widest text-gold/60 uppercase">
                {isRTL ? "صالون حلاقة فاخر" : "Premium Barbershop"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className={cn("hidden md:flex items-center gap-1", isRTL && "flex-row-reverse")}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-cream/70 hover:text-gold transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gold transition-all duration-300 group-hover:w-4/5" />
              </Link>
            ))}
          </nav>

          {/* CTA + Lang switcher */}
          <div className={cn("hidden md:flex items-center gap-3", isRTL && "flex-row-reverse")}>
            <Link
              href={`/${otherLocale}`}
              className="text-xs text-cream/50 hover:text-gold transition-colors border border-gold/20 hover:border-gold/50 px-3 py-1.5 rounded-full"
            >
              {locale === "ar" ? "EN" : "عربي"}
            </Link>
            <Link
              href={`/${locale}/booking`}
              className="btn-gold px-5 py-2 rounded-full text-sm font-semibold"
            >
              {t("booking")}
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className={cn("flex md:hidden items-center gap-2", isRTL && "flex-row-reverse")}>
            <Link
              href={`/${otherLocale}`}
              className="text-xs text-cream/50 hover:text-gold transition-colors px-2"
            >
              {locale === "ar" ? "EN" : "عربي"}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-cream/70 hover:text-gold transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-t border-gold/10 nav-blur animate-slide-down">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-4 py-3 text-cream/70 hover:text-gold hover:bg-gold/5 rounded-lg transition-all",
                  isRTL && "text-right"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/booking`}
              onClick={() => setIsOpen(false)}
              className="btn-gold mt-2 px-5 py-3 rounded-xl text-center font-semibold"
            >
              {t("booking")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
