import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/data";
import { ContactForm } from "@/components/site/contact-form";
import { SocialLinks } from "@/components/site/social-icons";
import { SystemPageHeader } from "@/components/site/system-page";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const s = await getSettings();
  const items = [
    s.address && { icon: MapPin, label: "Address", value: s.address },
    s.phone && { icon: Phone, label: "Phone", value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
    s.email && { icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <>
      <SystemPageHeader slug="contact" fallbackTitle="Contact" />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:py-20 lg:grid-cols-[1fr_1.5fr]">
        <div className="rounded-3xl bg-brand-800 p-8 text-white sm:p-10">
          <h2 className="font-display text-3xl">Get in touch</h2>
          <ul className="mt-8 space-y-6">
            {items.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-500">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block text-sm text-brand-200">{label}</span>
                  {href ? (
                    <a href={href} className="break-all text-lg hover:text-accent-400">
                      {value}
                    </a>
                  ) : (
                    <span className="text-lg">{value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <SocialLinks socials={s.socials} className="mt-10" />
        </div>
        <div>
          <h2 className="font-display text-3xl text-brand-800">Send us a message</h2>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
