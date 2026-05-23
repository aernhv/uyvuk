"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Calendar, Scissors, Users, CalendarX, Settings, LogOut } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface DashboardSidebarProps {
  locale: string;
}

export default function DashboardSidebar({ locale }: DashboardSidebarProps) {
  const pathname = usePathname();
  const isRTL = locale === "ar";

  const navItems = [
    { href: `/${locale}/dashboard`, icon: LayoutDashboard, label: isRTL ? "نظرة عامة" : "Overview", exact: true },
    { href: `/${locale}/dashboard/bookings`, icon: Calendar, label: isRTL ? "الحجوزات" : "Bookings" },
    { href: `/${locale}/dashboard/services`, icon: Scissors, label: isRTL ? "الخدمات" : "Services" },
    { href: `/${locale}/dashboard/barbers`, icon: Users, label: isRTL ? "الحلاقون" : "Barbers" },
    { href: `/${locale}/dashboard/blocked-dates`, icon: CalendarX, label: isRTL ? "الأيام المحظورة" : "Blocked Dates" },
    { href: `/${locale}/dashboard/settings`, icon: Settings, label: isRTL ? "الإعدادات" : "Settings" },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className={cn(
      "w-56 shrink-0 bg-black border-gold/10 min-h-screen flex flex-col",
      isRTL ? "border-l" : "border-r"
    )}>
      {/* Logo */}
      <div className="p-5 border-b border-gold/10">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-2">
          <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center">
            <Scissors className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm font-bold text-gold-gradient font-serif">Royal Cuts</div>
            <div className="text-[9px] text-gold/40 uppercase tracking-wider">
              {isRTL ? "لوحة التحكم" : "Dashboard"}
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, icon: Icon, label, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
                isRTL && "flex-row-reverse",
                active
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-cream/50 hover:text-cream hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gold/10 space-y-2">
        <Link
          href={`/${locale}`}
          className={cn("flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-cream/40 hover:text-cream transition-colors", isRTL && "flex-row-reverse")}
        >
          {isRTL ? "← العودة للموقع" : "← Back to Site"}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}/dashboard/login` })}
          className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream/50 hover:text-red-400 hover:bg-red-500/5 transition-all", isRTL && "flex-row-reverse")}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {isRTL ? "تسجيل الخروج" : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
