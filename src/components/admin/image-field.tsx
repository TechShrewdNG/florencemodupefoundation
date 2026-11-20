"use client";

import { useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadImage } from "@/app/admin/actions";
import { inputClass } from "./ui";

export function ImageField({ name, defaultValue = "" }: { name: string; defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    const fd = new FormData();
    fd.set("file", file);
    start(async () => {
      const res = await uploadImage(fd);
      if (res.url) setUrl(res.url);
      else setError(res.error ?? "Upload failed");
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} />
      <div className="relative overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50">
        {url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="aspect-video w-full object-cover" />
            <button
              type="button"
              onClick={() => setUrl("")}
              className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex aspect-video w-full flex-col items-center justify-center gap-2 text-sm text-gray-500 hover:text-brand-600"
          >
            {pending ? <Loader2 className="size-6 animate-spin" /> : <ImagePlus className="size-6" />}
            {pending ? "Uploading…" : "Upload image"}
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="…or paste an image URL"
          className={`${inputClass} text-xs`}
        />
        {url && (
          <button type="button" onClick={() => fileRef.current?.click()} className="shrink-0 text-xs font-semibold text-brand-600 hover:underline" disabled={pending}>
            {pending ? "Uploading…" : "Replace"}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
