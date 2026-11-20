import Link from "next/link";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { getNavigation, getSettings, type NavItem } from "@/lib/data";

/** Finds the menu group a path belongs to (e.g. "/the-challenge" → "Our Work"). */
export async function getSection(path: string): Promise<{ label: string; items: NavItem[] } | null> {
  const nav = await getNavigation();
  for (const entry of nav) {
    if ("children" in entry && entry.children.some((c) => c.href === path)) {
      return { label: entry.label, items: entry.children };
    }
  }
  return null;
}

export async function PageSidebar({ path }: { path: string }) {
  const [section, s] = await Promise.all([getSection(path), getSettings()]);
  return (
    <aside className="space-y-6 lg:sticky lg:top-28">
      {section && (
        <nav aria-label={section.label} className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
          <p className="px-4 pb-2 pt-3 text-xs font-bold uppercase tracking-[0.2em] text-muted">{section.label}</p>
          <ul>
            {section.items.map((item) => {
              const current = item.href === path;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-[15px] transition ${current ? "bg-brand-50 font-semibold text-brand-700" : "text-ink hover:bg-gray-50 hover:text-brand-600"}`}
                  >
                    {item.label}
                    {current && <span className="size-1.5 rounded-full bg-accent-500" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
      <div className="relative overflow-hidden rounded-2xl bg-brand-800 p-6 text-white">
        <HeartHandshake className="size-8 text-accent-400" />
        <p className="mt-4 font-display text-xl leading-snug">{s.ctaHeading}</p>
        <p className="mt-2 text-sm leading-relaxed text-brand-100">{s.ctaText}</p>
        <Link
          href={s.ctaButtonHref}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold transition hover:bg-accent-600"
        >
          {s.ctaButtonLabel} <ArrowRight className="size-4" />
        </Link>
        <div className="pointer-events-none absolute -bottom-10 -right-10 size-32 rounded-full bg-white/5" />
      </div>
    </aside>
  );
}
