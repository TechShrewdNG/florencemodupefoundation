import type { Metadata } from "next";
import { getCoreValues } from "@/lib/data";
import { ValueCard } from "@/components/site/value-card";
import { EmptyState, SystemPageHeader } from "@/components/site/system-page";

export const metadata: Metadata = { title: "Core Values" };

export default async function CoreValuesPage() {
  const values = await getCoreValues();
  return (
    <>
      <SystemPageHeader slug="core-values" fallbackTitle="Core Values" />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        {values.length ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <ValueCard key={v.id} value={v} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState>Our core values will be published soon.</EmptyState>
        )}
      </section>
    </>
  );
}
