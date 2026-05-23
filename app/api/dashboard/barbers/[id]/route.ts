import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { schedules, ...barberData } = await request.json();

  const barber = await prisma.barber.update({
    where: { id },
    data: barberData,
  });

  if (schedules) {
    // Upsert schedules
    for (const s of schedules) {
      await prisma.barberSchedule.upsert({
        where: { barberId_dayOfWeek: { barberId: id, dayOfWeek: s.dayOfWeek } },
        create: { barberId: id, ...s },
        update: s,
      });
    }
  }

  return NextResponse.json({ barber });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.barber.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
