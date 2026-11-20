import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getContentPageSlugs, getPage, getPostsByCategory } from "@/lib/data";
import { PostCard } from "@/components/site/post-card";
import { PageHero, RichText } from "@/components/site/page-hero";
import { PageSkeleton } from "@/components/site/skeleton";

export async function generateStaticParams() {
  const slugs = await getContentPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const page = await getPage((await params).slug);
  return page ? { title: page.title, description: page.subtitle || undefined } : {};
}

async function ContentPage({ params }: { params: PageProps<"/[slug]">["params"] }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page || page.system) notFound();
  // News posts whose category matches this page's title are listed under it (e.g. "Outreach").
  const related = await getPostsByCategory(page.title);
  return (
    <>
      <PageHero title={page.title} subtitle={page.subtitle} image={page.heroImage} />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <RichText html={page.body} />
      </article>
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function Page(props: PageProps<"/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ContentPage params={props.params} />
    </Suspense>
  );
}
