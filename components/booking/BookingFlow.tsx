"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/app/lib/utils";
import StepIndicator from "./StepIndicator";
import StepService from "./StepService";
import StepBarber from "./StepBarber";
import StepDateTime from "./StepDateTime";
import StepDetails from "./StepDetails";
import StepConfirm from "./StepConfirm";
import BookingSuccess from "./BookingSuccess";
import type { Service, Barber } from "@prisma/client";

interface BookingFlowProps {
  locale: string;
  services: Service[];
  barbers: Barber[];
  initialServiceId?: string;
  initialBarberId?: string;
}

export interface BookingState {
  serviceId: string;
  barberId: string; // "" means "any"
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // "HH:mm"
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
}

const TOTAL_STEPS = 5;

export default function BookingFlow({
  locale,
  services,
  barbers,
  initialServiceId,
  initialBarberId,
}: BookingFlowProps) {
  const t = useTranslations("booking");
  const isRTL = locale === "ar";

  const [step, setStep] = useState(initialServiceId ? 2 : 1);
  const [completed, setCompleted] = useState(false);
  const [confirmationId, setConfirmationId] = useState("");

  const [booking, setBooking] = useState<BookingState>({
    serviceId: initialServiceId ?? "",
    barberId: initialBarberId ?? "",
    date: "",
    timeSlot: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    notes: "",
  });

  const updateBooking = (updates: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleConfirm = async () => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        setConfirmationId(data.id);
        setCompleted(true);
      } else {
        alert(data.error ?? "Booking failed");
      }
    } catch {
      alert("Network error");
    }
  };

  const selectedService = services.find((s) => s.id === booking.serviceId);
  const selectedBarber = barbers.find((b) => b.id === booking.barberId);

  if (completed) {
    return (
      <BookingSuccess
        locale={locale}
        booking={booking}
        service={selectedService!}
        barber={selectedBarber}
        confirmationId={confirmationId}
      />
    );
  }

  const stepLabels = [t("step1"), t("step2"), t("step3"), t("step4"), t("step5")];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className={cn("mb-10", isRTL ? "text-right" : "text-center")}>
        <h1 className="text-4xl font-serif font-bold text-cream mb-2">{t("title")}</h1>
        <p className="text-cream/50">{t("subtitle")}</p>
      </div>

      {/* Step indicator */}
      <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} labels={stepLabels} isRTL={isRTL} />

      {/* Step content */}
      <div className="mt-8 animate-fade-in">
        {step === 1 && (
          <StepService
            locale={locale}
            services={services}
            selectedId={booking.serviceId}
            onSelect={(id) => { updateBooking({ serviceId: id, date: "", timeSlot: "" }); handleNext(); }}
          />
        )}
        {step === 2 && (
          <StepBarber
            locale={locale}
            barbers={barbers}
            selectedId={booking.barberId}
            onSelect={(id) => { updateBooking({ barberId: id, date: "", timeSlot: "" }); handleNext(); }}
            onBack={handleBack}
          />
        )}
        {step === 3 && (
          <StepDateTime
            locale={locale}
            booking={booking}
            onSelect={(date, time) => { updateBooking({ date, timeSlot: time }); handleNext(); }}
            onBack={handleBack}
          />
        )}
        {step === 4 && (
          <StepDetails
            locale={locale}
            booking={booking}
            onChange={updateBooking}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 5 && (
          <StepConfirm
            locale={locale}
            booking={booking}
            service={selectedService!}
            barber={selectedBarber}
            onConfirm={handleConfirm}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
