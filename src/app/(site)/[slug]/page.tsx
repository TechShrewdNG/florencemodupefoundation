import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getContentPageSlugs, getPage } from "@/lib/data";
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
  return (
    <>
      <PageHero title={page.title} subtitle={page.subtitle} image={page.heroImage} />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <RichText html={page.body} />
      </article>
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
