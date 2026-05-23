import ShopSettingsManager from "@/components/dashboard/ShopSettingsManager";
import { prisma } from "@/app/lib/prisma";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const rawSettings = await prisma.shopSettings.findMany();
  const settings: Record<string, string> = {};
  for (const s of rawSettings) {
    settings[s.key] = s.value;
  }

  return <ShopSettingsManager locale={locale} settings={settings} />;
}
