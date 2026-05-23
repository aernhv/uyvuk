"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday, isBefore, startOfDay } from "date-fns";
import type { BookingState } from "./BookingFlow";

interface StepDateTimeProps {
  locale: string;
  booking: BookingState;
  onSelect: (date: string, time: string) => void;
  onBack: () => void;
}

type Slot = { start: string; end: string; available: boolean };

export default function StepDateTime({ locale, booking, onSelect, onBack }: StepDateTimeProps) {
  const t = useTranslations("booking");
  const isRTL = locale === "ar";

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");

  const dayNames = isRTL
    ? ["أح", "اث", "ثل", "أر", "خم", "جم", "سب"]
    : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot("");

    const params = new URLSearchParams({
      barberId: booking.barberId,
      serviceId: booking.serviceId,
      date: dateStr,
    });

    fetch(`/api/slots?${params}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, booking.barberId, booking.serviceId]);

  const handleDateClick = (day: Date) => {
    if (isBefore(day, startOfDay(new Date()))) return;
    setSelectedDate(day);
  };

  const handleSlotSelect = (slot: Slot) => {
    if (!slot.available || !selectedDate) return;
    setSelectedSlot(slot.start);
    onSelect(format(selectedDate, "yyyy-MM-dd"), slot.start);
  };

  const availableSlots = slots.filter((s) => s.available);

  return (
    <div>
      <h2 className={cn("text-xl font-semibold text-cream mb-6", isRTL && "text-right")}>{t("selectDate")}</h2>

      {/* Calendar */}
      <div className="dark-card rounded-2xl p-5 mb-6">
        {/* Month nav */}
        <div className={cn("flex items-center justify-between mb-4", isRTL && "flex-row-reverse")}>
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="w-8 h-8 rounded-lg hover:bg-gold/10 text-cream/60 hover:text-gold flex items-center justify-center transition-colors"
          >
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <span className="text-cream font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="w-8 h-8 rounded-lg hover:bg-gold/10 text-cream/60 hover:text-gold flex items-center justify-center transition-colors"
          >
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map((d) => (
            <div key={d} className="text-center text-cream/30 text-xs py-1">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-0.5">
          {days.map((day, i) => {
            const isPast = isBefore(day, startOfDay(new Date()));
            const inMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            const todayDay = isToday(day);

            return (
              <button
                key={i}
                onClick={() => !isPast && inMonth && handleDateClick(day)}
                disabled={isPast || !inMonth}
                className={cn(
                  "aspect-square rounded-xl text-sm font-medium transition-all duration-150",
                  !inMonth && "opacity-0 pointer-events-none",
                  isPast && inMonth && "text-cream/20 cursor-not-allowed",
                  !isPast && inMonth && "hover:bg-gold/10 hover:text-gold cursor-pointer text-cream/70",
                  todayDay && !isSelected && "border border-gold/30 text-gold",
                  isSelected && "gold-gradient text-black font-bold shadow-[0_0_15px_rgba(201,168,76,0.4)]"
                )}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="dark-card rounded-2xl p-5 mb-6">
          <h3 className={cn("text-cream font-semibold mb-4", isRTL && "text-right")}>{t("selectTime")}</h3>
          {loadingSlots ? (
            <div className="flex items-center justify-center py-8 gap-2 text-cream/40">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">{isRTL ? "جار التحميل..." : "Loading slots..."}</span>
            </div>
          ) : availableSlots.length === 0 ? (
            <p className={cn("text-cream/40 text-sm py-4", isRTL && "text-right")}>{t("noSlots")}</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.start}
                  onClick={() => handleSlotSelect(slot)}
                  className={cn(
                    "py-2.5 px-2 rounded-xl text-sm font-medium transition-all duration-150 border",
                    selectedSlot === slot.start
                      ? "gold-gradient text-black border-gold font-bold"
                      : "border-gold/10 text-cream/60 hover:border-gold/40 hover:text-gold bg-white/3"
                  )}
                >
                  {slot.start}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-start">
        <button onClick={onBack} className="btn-outline-gold px-6 py-2.5 rounded-xl text-sm">
          {t("back")}
        </button>
      </div>
    </div>
  );
}
