import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { mergeSettings } from "@/lib/site-settings";
import { PageHeader } from "@/components/admin/ui";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  await requireUser();
  const [row] = await db.select().from(schema.settings).where(eq(schema.settings.key, "site"));
  const settings = mergeSettings(row ? JSON.parse(row.value) : null);
  return (
    <>
      <PageHeader title="Site Settings" description="Contact details, social links and the text on the home page." />
      <SettingsForm settings={settings} />
    </>
  );
}
