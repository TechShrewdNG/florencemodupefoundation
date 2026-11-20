import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { getNavigation, getSettings } from "@/lib/data";
import { Img } from "./img";
import { NavMenu } from "./nav-menu";

export async function SiteHeader() {
  const [s, nav] = await Promise.all([getSettings(), getNavigation()]);
  return (
    <header className="sticky top-0 z-40 bg-white/95 shadow-sm backdrop-blur">
      <div className="hidden bg-brand-800 text-sm text-brand-50 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <p className="font-script text-lg leading-none">{s.tagline}</p>
          <div className="flex items-center gap-6">
            {s.phone && (
              <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-white">
                <Phone className="size-4" /> {s.phone}
              </a>
            )}
            {s.email && (
              <a href={`mailto:${s.email}`} className="flex items-center gap-2 hover:text-white">
                <Mail className="size-4" /> {s.email}
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="shrink-0" aria-label={`${s.siteName} home`}>
          <Img src={s.logo} alt={s.siteName} width={400} height={155} priority className="h-14 w-auto" />
        </Link>
        <NavMenu nav={nav} cta={{ label: s.ctaButtonLabel, href: s.ctaButtonHref }} />
      </div>
    </header>
  );
}
