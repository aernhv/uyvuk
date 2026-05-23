import { prisma } from "@/app/lib/prisma";
import BlockedDatesManager from "@/components/dashboard/BlockedDatesManager";

export default async function BlockedDatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dates = await prisma.blockedDate.findMany({ orderBy: { date: "asc" } });
  return <BlockedDatesManager locale={locale} dates={dates} />;
}
