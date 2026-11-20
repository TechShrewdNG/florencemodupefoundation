import type { Metadata } from "next";
import { getMilestones } from "@/lib/data";
import { Img } from "@/components/site/img";
import { EmptyState, SystemPageHeader } from "@/components/site/system-page";

export const metadata: Metadata = { title: "Milestones" };

export default async function MilestonesPage() {
  const items = await getMilestones();
  return (
    <>
      <SystemPageHeader slug="milestones" fallbackTitle="Milestones" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        {items.length ? (
          <ol className="relative space-y-12 border-l-2 border-brand-100 pl-8 sm:pl-12">
            {items.map((m) => (
              <li key={m.id} className="relative">
                <span className="absolute -left-[41px] top-1 size-5 rounded-full border-4 border-white bg-accent-500 shadow sm:-left-[57px]" />
                {m.date && <p className="font-script text-2xl text-accent-600">{m.date}</p>}
                <h3 className="font-display text-2xl text-brand-800">{m.title}</h3>
                {m.description && <p className="mt-2 leading-relaxed text-muted">{m.description}</p>}
                {m.image && (
                  <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-2xl">
                    <Img src={m.image} alt="" fill sizes="(min-width: 896px) 800px, 100vw" className="object-cover" />
                  </div>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState>Our milestones will be published soon.</EmptyState>
        )}
      </section>
    </>
  );
}
