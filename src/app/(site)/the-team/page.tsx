import type { Metadata } from "next";
import { getTeam } from "@/lib/data";
import { Img } from "@/components/site/img";
import { Reveal } from "@/components/site/reveal";
import { EmptyState, SystemPageHeader } from "@/components/site/system-page";

export const metadata: Metadata = { title: "The Team" };

function initials(name: string) {
  const parts = name
    .replace(/\(.*?\)/g, "")
    .replace(/\b(dr|mrs|mr|ms|miss|prof|engr|chief)\b\.?/gi, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.at(-1)?.[0] ?? "")).toUpperCase();
}

export default async function TeamPage() {
  const team = await getTeam();
  return (
    <>
      <SystemPageHeader slug="the-team" fallbackTitle="The Team" />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        {team.length ? (
          <ul className="flex flex-wrap justify-center gap-8">
            {team.map((m, i) => (
              <Reveal
                as="li"
                key={m.id}
                delay={(i % 3) * 80}
                className="w-full max-w-sm sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.4rem)]"
              >
                <div className="group h-full overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-brand-50 via-brand-100 to-accent-400/20">
                    {m.photo ? (
                      <Img
                        src={m.photo}
                        alt={m.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <span className="absolute inset-0 m-auto grid size-36 place-items-center rounded-full bg-white/70 font-display text-5xl text-brand-700 shadow-inner">
                        {initials(m.name)}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    {m.role && <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-600">{m.role}</p>}
                    <h3 className="mt-1.5 font-display text-2xl text-brand-800">{m.name}</h3>
                    {m.bio && <p className="mt-3 leading-relaxed text-muted">{m.bio}</p>}
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        ) : (
          <EmptyState>Team profiles are coming soon.</EmptyState>
        )}
      </section>
    </>
  );
}
