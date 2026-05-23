"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { cn, formatPrice, formatDuration } from "@/app/lib/utils";
import type { Service } from "@prisma/client";

interface ServicesManagerProps {
  locale: string;
  services: Service[];
}

type ServiceForm = {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
};

const emptyForm: ServiceForm = {
  nameAr: "", nameEn: "", descriptionAr: "", descriptionEn: "",
  durationMinutes: 30, price: 0, isActive: true,
};

export default function ServicesManager({ locale, services }: ServicesManagerProps) {
  const isRTL = locale === "ar";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

  const handleSave = async () => {
    const url = editingId
      ? `/api/dashboard/services/${editingId}`
      : "/api/dashboard/services";
    const method = editingId ? "PATCH" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    startTransition(() => router.refresh());
  };

  const handleEdit = (s: Service) => {
    setForm({
      nameAr: s.nameAr, nameEn: s.nameEn,
      descriptionAr: s.descriptionAr, descriptionEn: s.descriptionEn,
      durationMinutes: s.durationMinutes, price: s.price, isActive: s.isActive,
    });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? "هل أنت متأكد من الحذف؟" : "Delete this service?")) return;
    await fetch(`/api/dashboard/services/${id}`, { method: "DELETE" });
    startTransition(() => router.refresh());
  };

  const inputClass = "w-full bg-white/5 border border-gold/10 rounded-xl px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold/40 placeholder-cream/20";
  const labelClass = "block text-cream/50 text-xs mb-1";

  return (
    <div>
      <div className={cn("flex items-center justify-between mb-6", isRTL && "flex-row-reverse")}>
        <h1 className="text-2xl font-serif font-bold text-cream">
          {isRTL ? "إدارة الخدمات" : "Manage Services"}
        </h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className={cn("btn-gold px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2", isRTL && "flex-row-reverse")}
        >
          <Plus className="w-4 h-4" />
          {isRTL ? "إضافة خدمة" : "Add Service"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="dark-card rounded-2xl p-6 mb-6 border border-gold/20">
          <div className={cn("flex items-center justify-between mb-5", isRTL && "flex-row-reverse")}>
            <h2 className="text-cream font-semibold">{editingId ? (isRTL ? "تعديل الخدمة" : "Edit Service") : (isRTL ? "خدمة جديدة" : "New Service")}</h2>
            <button onClick={() => setShowForm(false)} className="text-cream/40 hover:text-cream"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "nameEn", label: "Name (EN)" },
              { key: "nameAr", label: "الاسم (عربي)" },
              { key: "descriptionEn", label: "Description (EN)" },
              { key: "descriptionAr", label: "الوصف (عربي)" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className={labelClass}>{label}</label>
                <input
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className={inputClass}
                />
              </div>
            ))}
            <div>
              <label className={labelClass}>{isRTL ? "المدة (دقائق)" : "Duration (min)"}</label>
              <input type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: +e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{isRTL ? "السعر (ر.س)" : "Price (SAR)"}</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className={cn("flex items-center gap-3 mt-5", isRTL && "flex-row-reverse")}>
            <button onClick={handleSave} disabled={isPending} className="btn-gold px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              {isRTL ? "حفظ" : "Save"}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-outline-gold px-5 py-2 rounded-xl text-sm">
              {isRTL ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="dark-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/10 text-cream/40 text-xs uppercase">
                {[isRTL ? "الخدمة" : "Service", isRTL ? "المدة" : "Duration", isRTL ? "السعر" : "Price", isRTL ? "الحالة" : "Status", ""].map((h) => (
                  <th key={h} className={cn("px-4 py-3 font-medium", isRTL ? "text-right" : "text-left")}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-cream font-medium">{locale === "ar" ? s.nameAr : s.nameEn}</div>
                    <div className="text-cream/40 text-xs">{locale === "ar" ? s.descriptionAr : s.descriptionEn}</div>
                  </td>
                  <td className="px-4 py-3 text-cream/70">{formatDuration(s.durationMinutes, locale)}</td>
                  <td className="px-4 py-3 text-gold font-semibold">{formatPrice(s.price, locale)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs px-2.5 py-1 rounded-full border", s.isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20")}>
                      {s.isActive ? (isRTL ? "نشط" : "Active") : (isRTL ? "غير نشط" : "Inactive")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                      <button onClick={() => handleEdit(s)} className="text-cream/40 hover:text-gold transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(s.id)} className="text-cream/40 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
