"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/db/schema";
import { Img } from "./img";

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const n = images.length;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % n));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + n) % n));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, n]);

  return (
    <>
      <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
        {images.map((g, i) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative mb-3 block w-full overflow-hidden rounded-xl"
          >
            <Img
              src={g.src}
              alt={g.caption || `Gallery photo ${i + 1}`}
              width={600}
              height={400}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="h-auto w-full transition duration-500 group-hover:scale-105"
            />
            {g.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-sm text-white opacity-0 transition group-hover:opacity-100">
                {g.caption}
              </span>
            )}
          </button>
        ))}
      </div>
      {open !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal onClick={() => setOpen(null)}>
          <button className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Close">
            <X />
          </button>
          <button
            className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white sm:left-6"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((open - 1 + n) % n);
            }}
          >
            <ChevronLeft />
          </button>
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Img src={images[open].src} alt={images[open].caption || ""} width={1600} height={1067} className="max-h-[80vh] w-auto rounded-lg object-contain" />
            {images[open].caption && <figcaption className="mt-3 text-center text-white/80">{images[open].caption}</figcaption>}
          </figure>
          <button
            className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white sm:right-6"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((open + 1) % n);
            }}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
