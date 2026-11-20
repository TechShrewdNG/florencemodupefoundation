import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import { getTeam } from "@/lib/data";
import { Img } from "@/components/site/img";
import { EmptyState, SystemPageHeader } from "@/components/site/system-page";

export const metadata: Metadata = { title: "The Team" };

export default async function TeamPage() {
  const team = await getTeam();
  return (
    <>
      <SystemPageHeader slug="the-team" fallbackTitle="The Team" />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        {team.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <div key={m.id} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
                <div className="relative aspect-[4/5] bg-brand-50">
                  {m.photo ? (
                    <Img src={m.photo} alt={m.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                  ) : (
                    <UserRound className="absolute inset-0 m-auto size-24 text-brand-200" />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-brand-800">{m.name}</h3>
                  {m.role && <p className="mt-1 font-semibold text-accent-600">{m.role}</p>}
                  {m.bio && <p className="mt-3 leading-relaxed text-muted">{m.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState>Team profiles are coming soon.</EmptyState>
        )}
      </section>
    </>
  );
}
