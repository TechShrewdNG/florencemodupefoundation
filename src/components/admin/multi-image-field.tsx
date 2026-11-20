"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from "lucide-react";
import { uploadImage } from "@/app/admin/actions";

function parse(value: string): string[] {
  try {
    const v = JSON.parse(value || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** A list of images stored as a JSON array in a hidden input. */
export function MultiImageField({ name, defaultValue = "[]" }: { name: string; defaultValue?: string }) {
  const [urls, setUrls] = useState(() => parse(defaultValue));
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const list = Array.from(files);
    for (let i = 0; i < list.length; i++) {
      setProgress(`Uploading ${i + 1} of ${list.length}…`);
      const fd = new FormData();
      fd.set("file", list[i]);
      const res = await uploadImage(fd);
      if (res.url) setUrls((u) => [...u, res.url!]);
      else setError(`${list[i].name}: ${res.error}`);
    }
    setProgress(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  const move = (i: number, d: number) =>
    setUrls((u) => {
      const next = [...u];
      const j = i + d;
      if (j < 0 || j >= next.length) return u;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {urls.map((u, i) => (
            <div key={u + i} className="group relative overflow-hidden rounded-lg bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="aspect-square w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/50 p-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                <button type="button" onClick={() => move(i, -1)} className="text-white" aria-label="Move left">
                  <ArrowLeft className="size-4" />
                </button>
                <button type="button" onClick={() => setUrls(urls.filter((_, j) => j !== i))} className="text-white" aria-label="Remove">
                  <X className="size-4" />
                </button>
                <button type="button" onClick={() => move(i, 1)} className="text-white" aria-label="Move right">
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={!!progress}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-brand-500 hover:text-brand-600"
      >
        {progress ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
        {progress ?? "Add photos"}
      </button>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
