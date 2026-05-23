"use client";

import { useState } from "react";
import { Settings, Check, Loader2 } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface ShopSettingsManagerProps {
  locale: string;
  settings: Record<string, string>;
}

export default function ShopSettingsManager({ locale, settings }: ShopSettingsManagerProps) {
  const isRTL = locale === "ar";
  const [form, setForm] = useState({
    shopNameAr: settings.shopNameAr ?? "رويال كتس",
    shopNameEn: settings.shopNameEn ?? "Royal Cuts",
    phone: settings.phone ?? "+966 50 000 0000",
    addressAr: settings.addressAr ?? "١٢٣ شارع الحلاقين، الرياض",
    addressEn: settings.addressEn ?? "123 Barber Street, Riyadh",
    slotIntervalMinutes: settings.slotIntervalMinutes ?? "15",
    openTime: settings.openTime ?? "09:00",
    closeTime: settings.closeTime ?? "21:00",
    instagram: settings.instagram ?? "",
    whatsapp: settings.whatsapp ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/dashboard/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass = cn(
    "w-full bg-white/5 border border-gold/10 rounded-xl px-4 py-2.5 text-cream text-sm focus:outline-none focus:border-gold/40 placeholder-cream/20 transition-colors",
    isRTL && "text-right"
  );
  const labelClass = cn("block text-cream/50 text-xs mb-1", isRTL && "text-right");

  const sections = [
    {
      title: isRTL ? "معلومات الصالون" : "Shop Info",
      fields: [
        { key: "shopNameEn", label: "Shop Name (EN)", type: "text" },
        { key: "shopNameAr", label: "اسم الصالون (عربي)", type: "text" },
        { key: "phone", label: isRTL ? "رقم الجوال" : "Phone Number", type: "tel" },
        { key: "addressEn", label: "Address (EN)", type: "text" },
        { key: "addressAr", label: "العنوان (عربي)", type: "text" },
      ],
    },
    {
      title: isRTL ? "إعدادات الحجز" : "Booking Settings",
      fields: [
        { key: "openTime", label: isRTL ? "وقت الفتح" : "Opening Time", type: "time" },
        { key: "closeTime", label: isRTL ? "وقت الإغلاق" : "Closing Time", type: "time" },
        { key: "slotIntervalMinutes", label: isRTL ? "فترة المواعيد (دقائق)" : "Slot Interval (minutes)", type: "number" },
      ],
    },
    {
      title: isRTL ? "التواصل الاجتماعي" : "Social Media",
      fields: [
        { key: "instagram", label: "Instagram URL", type: "url" },
        { key: "whatsapp", label: "WhatsApp Number", type: "tel" },
      ],
    },
  ];

  return (
    <div>
      <div className={cn("flex items-center gap-3 mb-6", isRTL && "flex-row-reverse")}>
        <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-black" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-cream">
          {isRTL ? "إعدادات الصالون" : "Shop Settings"}
        </h1>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="dark-card rounded-2xl p-6">
            <h2 className={cn("text-cream font-semibold mb-5", isRTL && "text-right")}>{section.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className={labelClass}>{field.label}</label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={cn("flex items-center gap-3 mt-6", isRTL && "flex-row-reverse")}>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn("btn-gold px-6 py-3 rounded-xl font-semibold flex items-center gap-2", isRTL && "flex-row-reverse")}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : null}
          {saved ? (isRTL ? "تم الحفظ!" : "Saved!") : (isRTL ? "حفظ الإعدادات" : "Save Settings")}
        </button>
      </div>
    </div>
  );
}
