"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, X, Check, UserCircle2 } from "lucide-react";
import { cn } from "@/app/lib/utils";
import type { Barber, BarberSchedule } from "@prisma/client";

type BarberWithSchedules = Barber & { schedules: BarberSchedule[] };

interface BarbersManagerProps {
  locale: string;
  barbers: BarberWithSchedules[];
}

const DEFAULT_SCHEDULES = Array.from({ length: 7 }, (_, i) => ({
  dayOfWeek: i,
  startTime: "09:00",
  endTime: "20:00",
  isOff: i === 5, // Friday off
}));

export default function BarbersManager({ locale, barbers }: BarbersManagerProps) {
  const isRTL = locale === "ar";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", photoUrl: "", bioAr: "", bioEn: "", specialtyAr: "", specialtyEn: "" });
  const [schedules, setSchedules] = useState(DEFAULT_SCHEDULES);

  const dayNames = isRTL
    ? ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
    : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleSave = async () => {
    const url = editingId ? `/api/dashboard/barbers/${editingId}` : "/api/dashboard/barbers";
    const method = editingId ? "PATCH" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, schedules }),
    });
    setShowForm(false);
    setEditingId(null);
    startTransition(() => router.refresh());
  };

  const handleEdit = (b: BarberWithSchedules) => {
    setForm({ name: b.name, photoUrl: b.photoUrl ?? "", bioAr: b.bioAr, bioEn: b.bioEn, specialtyAr: b.specialtyAr, specialtyEn: b.specialtyEn });
    setSchedules(DEFAULT_SCHEDULES.map((d) => {
      const existing = b.schedules.find((s) => s.dayOfWeek === d.dayOfWeek);
      return existing ? { dayOfWeek: existing.dayOfWeek, startTime: existing.startTime, endTime: existing.endTime, isOff: existing.isOff } : d;
    }));
    setEditingId(b.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? "هل أنت متأكد من الحذف؟" : "Delete this barber?")) return;
    await fetch(`/api/dashboard/barbers/${id}`, { method: "DELETE" });
    startTransition(() => router.refresh());
  };

  const inputClass = "w-full bg-white/5 border border-gold/10 rounded-xl px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold/40 placeholder-cream/20";
  const labelClass = "block text-cream/50 text-xs mb-1";

  return (
    <div>
      <div className={cn("flex items-center justify-between mb-6", isRTL && "flex-row-reverse")}>
        <h1 className="text-2xl font-serif font-bold text-cream">{isRTL ? "إدارة الحلاقين" : "Manage Barbers"}</h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: "", photoUrl: "", bioAr: "", bioEn: "", specialtyAr: "", specialtyEn: "" }); setSchedules(DEFAULT_SCHEDULES); }}
          className={cn("btn-gold px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2", isRTL && "flex-row-reverse")}
        >
          <Plus className="w-4 h-4" />
          {isRTL ? "إضافة حلاق" : "Add Barber"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="dark-card rounded-2xl p-6 mb-6 border border-gold/20">
          <div className={cn("flex items-center justify-between mb-5", isRTL && "flex-row-reverse")}>
            <h2 className="text-cream font-semibold">{editingId ? (isRTL ? "تعديل الحلاق" : "Edit Barber") : (isRTL ? "حلاق جديد" : "New Barber")}</h2>
            <button onClick={() => setShowForm(false)} className="text-cream/40 hover:text-cream"><X className="w-4 h-4" /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { key: "name", label: isRTL ? "الاسم" : "Name" },
              { key: "photoUrl", label: isRTL ? "رابط الصورة" : "Photo URL" },
              { key: "specialtyEn", label: "Specialty (EN)" },
              { key: "specialtyAr", label: "التخصص (عربي)" },
              { key: "bioEn", label: "Bio (EN)" },
              { key: "bioAr", label: "النبذة (عربي)" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className={labelClass}>{label}</label>
                <input value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={inputClass} />
              </div>
            ))}
          </div>

          {/* Schedule */}
          <h3 className={cn("text-cream/70 text-sm font-semibold mb-3", isRTL && "text-right")}>{isRTL ? "جدول العمل" : "Work Schedule"}</h3>
          <div className="space-y-2">
            {schedules.map((s, i) => (
              <div key={i} className={cn("flex items-center gap-3 text-sm", isRTL && "flex-row-reverse")}>
                <span className="text-cream/50 w-24 shrink-0 text-xs">{dayNames[s.dayOfWeek]}</span>
                <label className={cn("flex items-center gap-1.5 cursor-pointer", isRTL && "flex-row-reverse")}>
                  <input
                    type="checkbox"
                    checked={s.isOff}
                    onChange={(e) => setSchedules(schedules.map((sch, j) => j === i ? { ...sch, isOff: e.target.checked } : sch))}
                    className="accent-gold"
                  />
                  <span className="text-cream/40 text-xs">{isRTL ? "إجازة" : "Off"}</span>
                </label>
                {!s.isOff && (
                  <>
                    <input type="time" value={s.startTime} onChange={(e) => setSchedules(schedules.map((sch, j) => j === i ? { ...sch, startTime: e.target.value } : sch))} className="bg-white/5 border border-gold/10 rounded-lg px-2 py-1 text-cream text-xs focus:outline-none" />
                    <span className="text-cream/30 text-xs">→</span>
                    <input type="time" value={s.endTime} onChange={(e) => setSchedules(schedules.map((sch, j) => j === i ? { ...sch, endTime: e.target.value } : sch))} className="bg-white/5 border border-gold/10 rounded-lg px-2 py-1 text-cream text-xs focus:outline-none" />
                  </>
                )}
              </div>
            ))}
          </div>

          <div className={cn("flex items-center gap-3 mt-5", isRTL && "flex-row-reverse")}>
            <button onClick={handleSave} disabled={isPending} className="btn-gold px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              {isRTL ? "حفظ" : "Save"}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-outline-gold px-5 py-2 rounded-xl text-sm">{isRTL ? "إلغاء" : "Cancel"}</button>
          </div>
        </div>
      )}

      {/* Barbers grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {barbers.map((b) => (
          <div key={b.id} className="dark-card rounded-2xl p-5 hover:border-gold/20 transition-colors">
            <div className={cn("flex items-center gap-3 mb-3", isRTL && "flex-row-reverse")}>
              <div className="w-12 h-12 rounded-xl bg-charcoal border border-gold/10 flex items-center justify-center shrink-0 overflow-hidden">
                {b.photoUrl ? (
                  <img src={b.photoUrl} alt={b.name} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle2 className="w-7 h-7 text-gold/30" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-cream font-semibold truncate">{b.name}</div>
                <div className="text-gold/70 text-xs">{locale === "ar" ? b.specialtyAr : b.specialtyEn}</div>
              </div>
              <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                <button onClick={() => handleEdit(b)} className="text-cream/40 hover:text-gold p-1 transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(b.id)} className="text-cream/40 hover:text-red-400 p-1 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <p className={cn("text-cream/40 text-xs line-clamp-2", isRTL && "text-right")}>{locale === "ar" ? b.bioAr : b.bioEn}</p>
            <div className={cn("flex flex-wrap gap-1 mt-3", isRTL && "flex-row-reverse")}>
              {b.schedules.filter((s) => !s.isOff).map((s) => (
                <span key={s.dayOfWeek} className="text-[10px] bg-gold/10 text-gold/70 px-1.5 py-0.5 rounded border border-gold/10">
                  {["Su","Mo","Tu","We","Th","Fr","Sa"][s.dayOfWeek]}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
