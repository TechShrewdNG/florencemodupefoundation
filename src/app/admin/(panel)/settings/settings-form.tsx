"use client";

import { useActionState, useState } from "react";
import { Loader2, Plus, Save, X } from "lucide-react";
import { saveSettings, type ActionState } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/site-settings";
import { ImageField } from "@/components/admin/image-field";
import { btn, Card, Flash, inputClass } from "@/components/admin/ui";

export function SettingsForm({ settings: s }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSettings, null);
  const [stats, setStats] = useState(s.stats.length ? s.stats : []);

  return (
    <form action={action} className="space-y-6">
      {state && <Flash tone={state.ok ? "success" : "error"} message={state.message} />}

      <Section title="General">
        <Text name="siteName" label="Site name" value={s.siteName} />
        <Text name="tagline" label="Tagline" value={s.tagline} />
        <div className="sm:col-span-2">
          <Label>Logo</Label>
          <div className="max-w-xs">
            <ImageField name="logo" defaultValue={s.logo} />
          </div>
        </div>
      </Section>

      <Section title="Contact details" hint="Shown in the header, footer and on the Contact page. Leave blank to hide.">
        <Text name="email" label="Email" value={s.email} />
        <Text name="phone" label="Phone" value={s.phone} />
        <Text name="address" label="Address" value={s.address} full />
      </Section>

      <Section title="Social media" hint="Paste full profile links. Leave blank to hide an icon.">
        <Text name="facebook" label="Facebook" value={s.socials.facebook} />
        <Text name="instagram" label="Instagram" value={s.socials.instagram} />
        <Text name="twitter" label="X / Twitter" value={s.socials.twitter} />
        <Text name="youtube" label="YouTube" value={s.socials.youtube} />
        <Text name="linkedin" label="LinkedIn" value={s.socials.linkedin} />
      </Section>

      <Section title="Home page: About section">
        <Text name="aboutEyebrow" label="Small heading" value={s.aboutEyebrow} />
        <Text name="aboutHeading" label="Heading" value={s.aboutHeading} />
        <Area name="aboutText" label="Text" value={s.aboutText} />
        <div className="sm:col-span-2">
          <Label>Image</Label>
          <div className="max-w-sm">
            <ImageField name="aboutImage" defaultValue={s.aboutImage} />
          </div>
        </div>
        <div className="sm:col-span-2">
          <Label>Impact numbers</Label>
          <p className="mb-2 text-xs text-gray-500">e.g. “500+” / “Children supported”. Leave empty to hide.</p>
          <div className="space-y-2">
            {stats.map((st, i) => (
              <div key={i} className="flex gap-2">
                <input name="statValue" defaultValue={st.value} placeholder="Number" className={`${inputClass} w-32`} />
                <input name="statLabel" defaultValue={st.label} placeholder="Label" className={inputClass} />
                <button type="button" onClick={() => setStats(stats.filter((_, j) => j !== i))} className="px-2 text-gray-400 hover:text-red-600" aria-label="Remove">
                  <X className="size-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setStats([...stats, { value: "", label: "" }])} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
              <Plus className="size-4" /> Add number
            </button>
          </div>
        </div>
      </Section>

      <Section title="Home page: Statements">
        <Area name="vision" label="Vision statement" value={s.vision} />
        <Area name="mission" label="Mission statement" value={s.mission} />
      </Section>

      <Section title="Call to action banner" hint="The orange banner near the bottom of the home page, and the button in the menu.">
        <Text name="ctaHeading" label="Heading" value={s.ctaHeading} />
        <Text name="ctaButtonLabel" label="Button label" value={s.ctaButtonLabel} />
        <Area name="ctaText" label="Text" value={s.ctaText} />
        <Text name="ctaButtonHref" label="Button link" value={s.ctaButtonHref} />
      </Section>

      <Section title="Footer & newsletter">
        <Area name="footerText" label="Footer text" value={s.footerText} />
        <Text name="newsletterHeading" label="Newsletter heading" value={s.newsletterHeading} />
        <Text name="newsletterText" label="Newsletter text" value={s.newsletterText} />
      </Section>

      <div className="sticky bottom-4 flex justify-end">
        <button className={`${btn.primary} px-6 py-2.5 shadow-lg`} disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {pending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <h2 className="font-semibold">{title}</h2>
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </Card>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-1.5 text-sm font-medium text-gray-800">{children}</p>;
}

function Text({ name, label, value, full }: { name: string; label: string; value: string; full?: boolean }) {
  return (
    <label className={`block space-y-1.5 text-sm font-medium text-gray-800 ${full ? "sm:col-span-2" : ""}`}>
      {label}
      <input name={name} defaultValue={value} className={inputClass} />
    </label>
  );
}

function Area({ name, label, value }: { name: string; label: string; value: string }) {
  return (
    <label className="block space-y-1.5 text-sm font-medium text-gray-800 sm:col-span-2">
      {label}
      <textarea name={name} defaultValue={value} rows={3} className={inputClass} />
    </label>
  );
}
