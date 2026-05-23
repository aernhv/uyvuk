import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

import bcrypt from "bcryptjs";

const DB_URL = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaLibSql({ url: DB_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Owner account
  const passwordHash = await bcrypt.hash("admin123", 12);
  const owner = await prisma.user.upsert({
    where: { email: "admin@royalcuts.com" },
    update: {},
    create: {
      email: "admin@royalcuts.com",
      passwordHash,
      name: "Shop Owner",
      role: "owner",
    },
  });
  console.log("✅ Owner:", owner.email);

  // Services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: "svc-haircut" },
      update: {},
      create: {
        id: "svc-haircut",
        nameEn: "Classic Haircut",
        nameAr: "قصة شعر كلاسيكية",
        descriptionEn: "Precision cut tailored to your face shape and style preference. Includes wash and style.",
        descriptionAr: "قصة دقيقة مصممة حسب شكل وجهك وتفضيلاتك. تشمل الغسيل والتصفيف.",
        durationMinutes: 30,
        price: 60,
        isActive: true,
        sortOrder: 1,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc-fade" },
      update: {},
      create: {
        id: "svc-fade",
        nameEn: "Skin Fade",
        nameAr: "سكين فيد",
        descriptionEn: "Clean skin fade blended to perfection. Our signature technique.",
        descriptionAr: "فيد نظيف ومدمج بشكل مثالي. أسلوبنا المميز.",
        durationMinutes: 45,
        price: 80,
        isActive: true,
        sortOrder: 2,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc-beard" },
      update: {},
      create: {
        id: "svc-beard",
        nameEn: "Beard Trim & Shape",
        nameAr: "تشذيب وتشكيل اللحية",
        descriptionEn: "Expert beard sculpting using straight razor and precision trimmers.",
        descriptionAr: "تشكيل اللحية باحتراف باستخدام الموس المستقيم والمقصات الدقيقة.",
        durationMinutes: 30,
        price: 50,
        isActive: true,
        sortOrder: 3,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc-shave" },
      update: {},
      create: {
        id: "svc-shave",
        nameEn: "Hot Towel Shave",
        nameAr: "حلاقة بالمنشفة الساخنة",
        descriptionEn: "Traditional hot towel straight razor shave with premium pre and post-shave treatment.",
        descriptionAr: "حلاقة كلاسيكية بالموس المستقيم مع منشفة ساخنة وعناية فاخرة قبل وبعد الحلاقة.",
        durationMinutes: 60,
        price: 120,
        isActive: true,
        sortOrder: 4,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc-combo" },
      update: {},
      create: {
        id: "svc-combo",
        nameEn: "Full Grooming Package",
        nameAr: "باقة العناية الكاملة",
        descriptionEn: "Complete grooming experience: haircut + beard + hot towel shave + face mask.",
        descriptionAr: "تجربة عناية متكاملة: قصة شعر + لحية + حلاقة بمنشفة ساخنة + قناع للوجه.",
        durationMinutes: 90,
        price: 180,
        isActive: true,
        sortOrder: 5,
      },
    }),
  ]);
  console.log(`✅ ${services.length} services created`);

  // Barbers
  const barber1 = await prisma.barber.upsert({
    where: { id: "barber-khalid" },
    update: {},
    create: {
      id: "barber-khalid",
      name: "Khalid Al-Rashidi",
      photoUrl: null,
      bioEn: "Master barber with over 10 years of experience in classic and modern cuts. Khalid's precision and artistry set him apart.",
      bioAr: "حلاق ماهر بخبرة تزيد عن 10 سنوات في القصات الكلاسيكية والعصرية. يتميز خالد بدقته وفنه.",
      specialtyEn: "Fades & Tapers",
      specialtyAr: "الفيد والتيبر",
      isActive: true,
      sortOrder: 1,
    },
  });

  const barber2 = await prisma.barber.upsert({
    where: { id: "barber-omar" },
    update: {},
    create: {
      id: "barber-omar",
      name: "Omar Siddiqui",
      photoUrl: null,
      bioEn: "Specialist in beard sculpting and hot towel shaves. Omar brings a traditional barbering philosophy to every client.",
      bioAr: "متخصص في تشكيل اللحى والحلاقة بالمنشفة الساخنة. يحمل عمر فلسفة الحلاقة التقليدية لكل عميل.",
      specialtyEn: "Beard & Shave",
      specialtyAr: "اللحية والحلاقة",
      isActive: true,
      sortOrder: 2,
    },
  });

  const barber3 = await prisma.barber.upsert({
    where: { id: "barber-ahmed" },
    update: {},
    create: {
      id: "barber-ahmed",
      name: "Ahmed Mansour",
      photoUrl: null,
      bioEn: "Young master with fresh techniques and a passion for modern styles. Ahmed keeps up with the latest trends.",
      bioAr: "حلاق شاب موهوب بأساليب حديثة وشغف بالموضة المعاصرة. أحمد دائماً على اطلاع بأحدث الصيحات.",
      specialtyEn: "Modern Styles",
      specialtyAr: "الأساليب العصرية",
      isActive: true,
      sortOrder: 3,
    },
  });

  console.log("✅ 3 barbers created");

  // Schedules — Sat–Thu 9am–8pm, Friday off
  const scheduleData = [0, 1, 2, 3, 4, 6].map((day) => ({
    dayOfWeek: day,
    startTime: "09:00",
    endTime: "20:00",
    isOff: false,
  }));
  const fridayOff = { dayOfWeek: 5, startTime: "09:00", endTime: "20:00", isOff: true };

  for (const barber of [barber1, barber2, barber3]) {
    for (const sched of [...scheduleData, fridayOff]) {
      await prisma.barberSchedule.upsert({
        where: { barberId_dayOfWeek: { barberId: barber.id, dayOfWeek: sched.dayOfWeek } },
        update: sched,
        create: { barberId: barber.id, ...sched },
      });
    }
  }

  // barber2 starts later on Sundays
  await prisma.barberSchedule.upsert({
    where: { barberId_dayOfWeek: { barberId: barber2.id, dayOfWeek: 0 } },
    update: { startTime: "12:00" },
    create: { barberId: barber2.id, dayOfWeek: 0, startTime: "12:00", endTime: "20:00", isOff: false },
  });

  console.log("✅ Barber schedules set");

  // Sample bookings for today
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];

  const sampleBookings = [
    {
      customerName: "Mohammed Al-Zahrani",
      customerPhone: "+966501234567",
      serviceId: "svc-haircut",
      barberId: barber1.id,
      hour: 10,
      status: "confirmed",
    },
    {
      customerName: "Abdullah Hassan",
      customerPhone: "+966509876543",
      serviceId: "svc-fade",
      barberId: barber2.id,
      hour: 11,
      status: "pending",
    },
    {
      customerName: "Faisal Al-Otaibi",
      customerPhone: "+966505551234",
      serviceId: "svc-combo",
      barberId: barber3.id,
      hour: 14,
      status: "pending",
    },
  ];

  for (const b of sampleBookings) {
    const service = services.find((s) => s.id === b.serviceId)!;
    const startTime = new Date(`${dateStr}T${String(b.hour).padStart(2, "0")}:00:00`);
    const endTime = new Date(startTime.getTime() + service.durationMinutes * 60000);

    await prisma.booking.create({
      data: {
        customerName: b.customerName,
        customerPhone: b.customerPhone,
        serviceId: b.serviceId,
        barberId: b.barberId,
        startTime,
        endTime,
        status: b.status,
      },
    });
  }

  console.log("✅ Sample bookings created");
  console.log("\n🎉 Seeding complete!");
  console.log("   Owner login: admin@royalcuts.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
