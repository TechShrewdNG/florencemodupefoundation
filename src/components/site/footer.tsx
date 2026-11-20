import Link from "next/link";
import { cacheLife } from "next/cache";
import { Mail, MapPin, Phone } from "lucide-react";
import { getNavigation, getSettings } from "@/lib/data";
import { NewsletterForm } from "./newsletter-form";
import { SocialLinks } from "./social-icons";

export async function SiteFooter() {
  const [s, nav] = await Promise.all([getSettings(), getNavigation()]);
  const links = nav.flatMap((e) => ("children" in e ? e.children : [e])).slice(0, 8);
  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <p className="font-display text-2xl text-white">{s.siteName}</p>
          <p className="mt-3 leading-relaxed text-brand-200">{s.footerText}</p>
          <SocialLinks socials={s.socials} className="mt-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold uppercase tracking-wider text-white">Explore</h3>
          <ul className="mt-4 grid gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-accent-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold uppercase tracking-wider text-white">Contact</h3>
          <ul className="mt-4 grid gap-3">
            {s.address && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-accent-400" /> {s.address}
              </li>
            )}
            {s.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-accent-400" />
                <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {s.phone}
                </a>
              </li>
            )}
            {s.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-accent-400" />
                <a href={`mailto:${s.email}`} className="break-all hover:text-white">
                  {s.email}
                </a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold uppercase tracking-wider text-white">{s.newsletterHeading}</h3>
          <p className="mt-4 text-brand-200">{s.newsletterText}</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-brand-200 sm:flex-row">
          <p>
            © <CopyrightYear /> {s.siteName}. All rights reserved.
          </p>
          <Link href="/admin" className="hover:text-white">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
