import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { z } from "zod";

const ScheduleSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  isOff: z.boolean().default(false),
});

const BarberSchema = z.object({
  name: z.string().min(1),
  photoUrl: z.string().optional().nullable(),
  bioAr: z.string().default(""),
  bioEn: z.string().default(""),
  specialtyAr: z.string().default(""),
  specialtyEn: z.string().default(""),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  schedules: z.array(ScheduleSchema).optional(),
});

export async function GET() {
  const barbers = await prisma.barber.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { schedules: true },
  });
  return NextResponse.json({ barbers });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = BarberSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { schedules, ...barberData } = parsed.data;

  const barber = await prisma.barber.create({
    data: {
      ...barberData,
      schedules: schedules
        ? {
            create: schedules,
          }
        : undefined,
    },
    include: { schedules: true },
  });

  return NextResponse.json({ barber }, { status: 201 });
}
