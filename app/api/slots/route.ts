import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/app/lib/booking";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const barberId = searchParams.get("barberId") ?? "";
  const serviceId = searchParams.get("serviceId") ?? "";
  const date = searchParams.get("date") ?? "";

  if (!serviceId || !date) {
    return NextResponse.json({ error: "serviceId and date are required" }, { status: 400 });
  }

  try {
    if (barberId) {
      const slots = await getAvailableSlots(barberId, serviceId, date);
      return NextResponse.json({ slots });
    }

    // "Any barber" — get union of available slots across all barbers
    const barbers = await prisma.barber.findMany({ where: { isActive: true } });
    const allSlotsMap = new Map<string, { start: string; end: string; available: boolean }>();

    for (const barber of barbers) {
      const slots = await getAvailableSlots(barber.id, serviceId, date);
      for (const slot of slots) {
        if (!allSlotsMap.has(slot.start) && slot.available) {
          allSlotsMap.set(slot.start, { start: slot.start, end: slot.end, available: true });
        }
      }
    }

    const slots = Array.from(allSlotsMap.values()).sort((a, b) =>
      a.start.localeCompare(b.start)
    );

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Slots API error:", error);
    return NextResponse.json({ error: "Failed to get slots" }, { status: 500 });
  }
}
