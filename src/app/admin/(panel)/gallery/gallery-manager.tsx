"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Trash2, Upload } from "lucide-react";
import type { GalleryImage } from "@/db/schema";
import { addGalleryImage, deleteGalleryImage, updateGalleryImage, uploadImage } from "@/app/admin/actions";
import { btn, Card, Flash, inputClass } from "@/components/admin/ui";

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const errs: string[] = [];
    const list = Array.from(files);
    for (let i = 0; i < list.length; i++) {
      setProgress(`Uploading ${i + 1} of ${list.length}…`);
      const fd = new FormData();
      fd.set("file", list[i]);
      const res = await uploadImage(fd);
      if (res.url) await addGalleryImage(res.url);
      else errs.push(`${list[i].name}: ${res.error}`);
    }
    setProgress(null);
    setErrors(errs);
    if (fileRef.current) fileRef.current.value = "";
    router.refresh();
  }

  return (
    <>
      {errors.map((e) => (
        <Flash key={e} tone="error" message={e} />
      ))}
      <Card className="mb-6 flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="text-sm text-gray-600">Upload JPG, PNG or WebP photos (max 8 MB each). You can select several at once.</p>
        <button type="button" className={btn.primary} onClick={() => fileRef.current?.click()} disabled={!!progress}>
          {progress ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {progress ?? "Upload photos"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
      </Card>
      {images.length === 0 ? (
        <Card className="p-10 text-center text-sm text-gray-500">No photos yet.</Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <GalleryItem key={img.id} image={img} />
          ))}
        </div>
      )}
    </>
  );
}

function GalleryItem({ image }: { image: GalleryImage }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  return (
    <Card className="overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.caption} className="aspect-[4/3] w-full object-cover" />
      <form
        className="space-y-2 p-3"
        action={(fd) =>
          start(async () => {
            await updateGalleryImage(image.id, fd);
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
            router.refresh();
          })
        }
      >
        <input name="caption" defaultValue={image.caption} placeholder="Caption (optional)" className={inputClass} />
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-gray-500">
            Order
            <input name="sortOrder" type="number" defaultValue={image.sortOrder} className={`${inputClass} w-20`} />
          </label>
          <button className={`${btn.secondary} ml-auto px-3 py-1.5`} disabled={pending}>
            {saved ? <Check className="size-4 text-emerald-600" /> : pending ? <Loader2 className="size-4 animate-spin" /> : "Save"}
          </button>
          <button
            type="button"
            className={`${btn.danger} px-3 py-1.5`}
            disabled={pending}
            aria-label="Delete photo"
            onClick={() => {
              if (confirm("Delete this photo?")) start(async () => {
                await deleteGalleryImage(image.id);
                router.refresh();
              });
            }}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </form>
    </Card>
  );
}
