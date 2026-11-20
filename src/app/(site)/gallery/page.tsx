import type { Metadata } from "next";
import { getGallery } from "@/lib/data";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { EmptyState, SystemPageHeader } from "@/components/site/system-page";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const images = await getGallery();
  return (
    <>
      <SystemPageHeader slug="gallery" fallbackTitle="Gallery" />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        {images.length ? <GalleryGrid images={images} /> : <EmptyState>Photos coming soon.</EmptyState>}
      </section>
    </>
  );
}
