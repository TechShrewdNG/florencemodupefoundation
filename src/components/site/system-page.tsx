import { notFound } from "next/navigation";
import { getPage } from "@/lib/data";
import { PageHero, RichText } from "./page-hero";
import { getSection } from "./page-sidebar";

/** Hero + optional intro text for built-in pages, editable under Admin → Pages. */
export async function SystemPageHeader({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const [page, section] = await Promise.all([getPage(slug), getSection(`/${slug}`)]);
  if (page === null && slug !== "news") notFound();
  return (
    <>
      <PageHero
        title={page?.title ?? fallbackTitle}
        subtitle={page?.subtitle}
        image={page?.heroImage}
        crumb={section?.label}
      />
      {page?.body && (
        <div className="mx-auto max-w-7xl px-4 pt-16 sm:pt-20">
          <div className="max-w-3xl">
            <RichText html={page.body} />
          </div>
        </div>
      )}
    </>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-3xl border border-dashed border-brand-200 bg-brand-50/50 px-6 py-14 text-center text-muted">{children}</p>;
}
