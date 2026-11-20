import { asc } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/admin/ui";
import { GalleryManager } from "./gallery-manager";

export default async function GalleryAdmin() {
  await requireUser();
  const images = await db.select().from(schema.galleryImages).orderBy(asc(schema.galleryImages.sortOrder));
  return (
    <>
      <PageHeader title="Gallery" description="Photos shown on the Gallery page and the home page (first 5)." />
      <GalleryManager images={images} />
    </>
  );
}
