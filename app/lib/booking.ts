import { prisma } from "./prisma";
import { format, addMinutes, parse, isAfter, isBefore, parseISO, startOfDay, endOfDay } from "date-fns";

const SLOT_INTERVAL = 15; // minutes

export type TimeSlot = {
  start: string; // "HH:mm"
  end: string;
  startDateTime: Date;
  endDateTime: Date;
  available: boolean;
};

export async function getAvailableSlots(
  barberId: string,
  serviceId: string,
  dateStr: string // "YYYY-MM-DD"
): Promise<TimeSlot[]> {
  const date = parseISO(dateStr);
  const dayOfWeek = date.getDay();

  // Check blocked date
  const blocked = await prisma.blockedDate.findFirst({
    where: { date: dateStr },
  });
  if (blocked) return [];

  // Get service duration
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) return [];
  const duration = service.durationMinutes;

  // Get barber schedule for day
  const schedule = await prisma.barberSchedule.findUnique({
    where: { barberId_dayOfWeek: { barberId, dayOfWeek } },
  });
  if (!schedule || schedule.isOff) return [];

  // Get existing bookings for barber on this date
  const bookings = await prisma.booking.findMany({
    where: {
      barberId,
      status: { in: ["pending", "confirmed"] },
      startTime: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
    },
  });

  // Generate slots
  const slots: TimeSlot[] = [];
  const [startH, startM] = schedule.startTime.split(":").map(Number);
  const [endH, endM] = schedule.endTime.split(":").map(Number);

  const dayStart = new Date(date);
  dayStart.setHours(startH, startM, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(endH, endM, 0, 0);

  let current = dayStart;
  const now = new Date();

  while (true) {
    const slotEnd = addMinutes(current, duration);
    if (isAfter(slotEnd, dayEnd)) break;

    const isPast = isBefore(current, now);

    const isBooked = bookings.some((b) => {
      const bStart = new Date(b.startTime);
      const bEnd = new Date(b.endTime);
      return current < bEnd && slotEnd > bStart;
    });

    slots.push({
      start: format(current, "HH:mm"),
      end: format(slotEnd, "HH:mm"),
      startDateTime: new Date(current),
      endDateTime: new Date(slotEnd),
      available: !isPast && !isBooked,
    });

    current = addMinutes(current, SLOT_INTERVAL);
  }

  return slots;
}
