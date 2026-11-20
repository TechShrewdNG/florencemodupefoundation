import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getContentPageSlugs, getPage, getPostsByCategory } from "@/lib/data";
import { PostCard } from "@/components/site/post-card";
import { Img } from "@/components/site/img";
import { PageSidebar, getSection } from "@/components/site/page-sidebar";
import { Reveal } from "@/components/site/reveal";
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
  const [related, section] = await Promise.all([getPostsByCategory(page.title), getSection(`/${slug}`)]);
  const hasBody = page.body.replace(/<[^>]+>/g, "").trim().length > 0;
  return (
    <>
      <PageHero title={page.title} subtitle={page.subtitle} image={page.heroImage} crumb={section?.label} />
      {(hasBody || page.portrait) && (
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <article className="max-w-3xl">
            {page.portrait && (
              <figure className="mx-auto mb-10 w-60 sm:float-right sm:mb-6 sm:ml-10 sm:w-64">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl ring-8 ring-brand-50">
                  <Img src={page.portrait} alt={page.portraitCaption || page.title} fill sizes="256px" className="object-cover" />
                </div>
                {page.portraitCaption && (
                  <figcaption className="mt-4 text-center text-sm font-semibold text-brand-800">{page.portraitCaption}</figcaption>
                )}
              </figure>
            )}
            <RichText html={page.body} />
            <div className="clear-both" />
          </article>
          <PageSidebar path={`/${slug}`} />
        </div>
      )}
      {related.length > 0 && (
        <section className="bg-cream py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 80} className="h-full">
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
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
