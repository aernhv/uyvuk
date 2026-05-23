import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getAvailableSlots } from "@/app/lib/booking";
import { parse, addMinutes } from "date-fns";
import { z } from "zod";

const BookingSchema = z.object({
  serviceId: z.string().min(1),
  barberId: z.string(), // empty string = any
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/),
  customerName: z.string().min(1),
  customerPhone: z.string().min(7),
  customerEmail: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = BookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    const { serviceId, barberId, date, timeSlot, customerName, customerPhone, customerEmail, notes } = parsed.data;

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    const startTime = parse(`${date} ${timeSlot}`, "yyyy-MM-dd HH:mm", new Date());
    const endTime = addMinutes(startTime, service.durationMinutes);

    let assignedBarberId = barberId;

    if (!barberId) {
      // Pick the available barber with fewest bookings that day
      const barbers = await prisma.barber.findMany({ where: { isActive: true } });
      let bestBarber: string | null = null;
      let minBookings = Infinity;

      for (const barber of barbers) {
        const slots = await getAvailableSlots(barber.id, serviceId, date);
        const slotAvailable = slots.find((s) => s.start === timeSlot && s.available);
        if (!slotAvailable) continue;

        const count = await prisma.booking.count({
          where: {
            barberId: barber.id,
            startTime: { gte: new Date(`${date}T00:00:00`), lt: new Date(`${date}T23:59:59`) },
            status: { in: ["pending", "confirmed"] },
          },
        });

        if (count < minBookings) {
          minBookings = count;
          bestBarber = barber.id;
        }
      }

      if (!bestBarber) {
        return NextResponse.json({ error: "No available barber for this slot" }, { status: 409 });
      }
      assignedBarberId = bestBarber;
    } else {
      // Verify the requested slot is still available
      const slots = await getAvailableSlots(barberId, serviceId, date);
      const slotAvailable = slots.find((s) => s.start === timeSlot && s.available);
      if (!slotAvailable) {
        return NextResponse.json({ error: "Selected slot is no longer available" }, { status: 409 });
      }
    }

    const booking = await prisma.booking.create({
      data: {
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        serviceId,
        barberId: assignedBarberId,
        startTime,
        endTime,
        status: "pending",
        notes: notes || null,
      },
    });

    return NextResponse.json({ id: booking.id, status: booking.status }, { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Dashboard use: list bookings with filters
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const barberId = searchParams.get("barberId");
  const date = searchParams.get("date");

  const where: any = {};
  if (status) where.status = status;
  if (barberId) where.barberId = barberId;
  if (date) {
    where.startTime = {
      gte: new Date(`${date}T00:00:00`),
      lt: new Date(`${date}T23:59:59`),
    };
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: { service: true, barber: true },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json({ bookings });
}
