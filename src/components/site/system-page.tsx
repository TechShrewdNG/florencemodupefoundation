import { notFound } from "next/navigation";
import { getPage } from "@/lib/data";
import { PageHero, RichText } from "./page-hero";

/** Hero + optional intro text for built-in pages, editable under Admin → Pages. */
export async function SystemPageHeader({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const page = await getPage(slug);
  if (page === null && slug !== "news") notFound();
  return (
    <>
      <PageHero title={page?.title ?? fallbackTitle} subtitle={page?.subtitle} image={page?.heroImage} />
      {page?.body && (
        <div className="mx-auto max-w-3xl px-4 pt-16 text-center">
          <RichText html={page.body} />
        </div>
      )}
    </>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl bg-cream px-6 py-12 text-center text-muted">{children}</p>;
}
