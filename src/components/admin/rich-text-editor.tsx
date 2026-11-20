"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import { useRef, useState } from "react";
import {
  Bold, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Loader2, Minus, Quote, Redo2, Undo2, Unlink,
} from "lucide-react";
import { uploadImage } from "@/app/admin/actions";

export function RichTextEditor({ name, defaultValue = "" }: { name: string; defaultValue?: string }) {
  const [html, setHtml] = useState(defaultValue);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: { openOnClick: false } }),
      Image,
      Placeholder.configure({ placeholder: "Start writing…" }),
    ],
    content: defaultValue,
    editorProps: { attributes: { class: "prose-content tiptap px-4 py-3" } },
    onUpdate: ({ editor }) => setHtml(editor.isEmpty ? "" : editor.getHTML()),
  });

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
      <input type="hidden" name={name} value={html} />
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const btn = (active: boolean) =>
    `grid size-8 place-items-center rounded-md transition ${active ? "bg-brand-100 text-brand-800" : "text-gray-600 hover:bg-gray-100"}`;

  async function onImage(file?: File) {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadImage(fd);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (res.url) editor.chain().focus().setImage({ src: res.url }).run();
    else alert(res.error);
  }

  function setLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (e.g. https://… or /contact)", prev ?? "https://");
    if (url === null) return;
    if (url === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const items: [React.ReactNode, string, () => void, boolean][] = [
    [<Bold key="b" className="size-4" />, "Bold", () => editor.chain().focus().toggleBold().run(), editor.isActive("bold")],
    [<Italic key="i" className="size-4" />, "Italic", () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic")],
    [<Heading2 key="h2" className="size-4" />, "Heading", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 })],
    [<Heading3 key="h3" className="size-4" />, "Subheading", () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 })],
    [<List key="ul" className="size-4" />, "Bullet list", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList")],
    [<ListOrdered key="ol" className="size-4" />, "Numbered list", () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList")],
    [<Quote key="q" className="size-4" />, "Quote", () => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote")],
    [<Minus key="hr" className="size-4" />, "Divider", () => editor.chain().focus().setHorizontalRule().run(), false],
    [<Link2 key="l" className="size-4" />, "Link", setLink, editor.isActive("link")],
    [<Unlink key="ul2" className="size-4" />, "Remove link", () => editor.chain().focus().unsetLink().run(), false],
  ];

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
      {items.map(([icon, label, onClick, active]) => (
        <button key={label} type="button" title={label} aria-label={label} onClick={onClick} className={btn(active)}>
          {icon}
        </button>
      ))}
      <button type="button" title="Insert image" aria-label="Insert image" onClick={() => fileRef.current?.click()} className={btn(false)} disabled={uploading}>
        {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onImage(e.target.files?.[0])} />
      <span className="mx-1 h-5 w-px bg-gray-300" />
      <button type="button" title="Undo" aria-label="Undo" onClick={() => editor.chain().focus().undo().run()} className={btn(false)}>
        <Undo2 className="size-4" />
      </button>
      <button type="button" title="Redo" aria-label="Redo" onClick={() => editor.chain().focus().redo().run()} className={btn(false)}>
        <Redo2 className="size-4" />
      </button>
    </div>
  );
}
