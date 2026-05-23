"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, CalendarX } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { format } from "date-fns";
import type { BlockedDate } from "@prisma/client";

interface BlockedDatesManagerProps {
  locale: string;
  dates: BlockedDate[];
}

export default function BlockedDatesManager({ locale, dates }: BlockedDatesManagerProps) {
  const isRTL = locale === "ar";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!newDate) return;
    setAdding(true);
    await fetch("/api/dashboard/blocked-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate, reason: newReason || undefined }),
    });
    setNewDate("");
    setNewReason("");
    setAdding(false);
    startTransition(() => router.refresh());
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/dashboard/blocked-dates?id=${id}`, { method: "DELETE" });
    startTransition(() => router.refresh());
  };

  return (
    <div>
      <div className={cn("flex items-center gap-3 mb-6", isRTL && "flex-row-reverse")}>
        <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
          <CalendarX className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-cream">
            {isRTL ? "الأيام المحظورة" : "Blocked Dates"}
          </h1>
          <p className="text-cream/40 text-sm">
            {isRTL ? "إضافة إجازات وأيام إغلاق الصالون" : "Add holidays and closure days"}
          </p>
        </div>
      </div>

      {/* Add form */}
      <div className="dark-card rounded-2xl p-6 mb-6 border border-gold/20">
        <h2 className={cn("text-cream font-semibold mb-4", isRTL && "text-right")}>
          {isRTL ? "إضافة يوم محظور" : "Block a Date"}
        </h2>
        <div className={cn("flex flex-col sm:flex-row gap-3", isRTL && "sm:flex-row-reverse")}>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="bg-white/5 border border-gold/10 rounded-xl px-4 py-2.5 text-cream text-sm focus:outline-none focus:border-gold/40"
          />
          <input
            type="text"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            placeholder={isRTL ? "السبب (اختياري)" : "Reason (optional)"}
            className={cn(
              "flex-1 bg-white/5 border border-gold/10 rounded-xl px-4 py-2.5 text-cream text-sm focus:outline-none focus:border-gold/40 placeholder-cream/20",
              isRTL && "text-right"
            )}
          />
          <button
            onClick={handleAdd}
            disabled={!newDate || adding}
            className={cn("btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shrink-0", isRTL && "flex-row-reverse")}
          >
            <Plus className="w-4 h-4" />
            {isRTL ? "إضافة" : "Block Date"}
          </button>
        </div>
      </div>

      {/* List */}
      {dates.length === 0 ? (
        <div className="dark-card rounded-2xl py-16 text-center">
          <CalendarX className="w-10 h-10 text-gold/20 mx-auto mb-3" />
          <p className="text-cream/30 text-sm">
            {isRTL ? "لا توجد أيام محظورة" : "No blocked dates"}
          </p>
        </div>
      ) : (
        <div className="dark-card rounded-2xl overflow-hidden">
          <div className="divide-y divide-gold/5">
            {dates.map((d) => (
              <div key={d.id} className={cn("flex items-center justify-between px-5 py-4", isRTL && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    <CalendarX className="w-5 h-5 text-red-400" />
                  </div>
                  <div className={cn(isRTL && "text-right")}>
                    <div className="text-cream font-medium text-sm">{d.date}</div>
                    {d.reason && <div className="text-cream/40 text-xs mt-0.5">{d.reason}</div>}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(d.id)}
                  disabled={isPending}
                  className="text-cream/30 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
