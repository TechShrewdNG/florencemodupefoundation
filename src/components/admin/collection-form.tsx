"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import type { ActionState } from "@/app/admin/actions";
import type { Field } from "@/lib/admin/fields";
import { ImageField } from "./image-field";
import { RichTextEditor } from "./rich-text-editor";
import { btn, Card, Flash, inputClass } from "./ui";

type Values = Record<string, unknown>;

export function CollectionForm({
  fields,
  values,
  action,
  lockedFields = [],
  footer,
}: {
  fields: Field[];
  values: Values;
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  lockedFields?: string[];
  footer?: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const main = fields.filter((f) => !f.side);
  const side = fields.filter((f) => f.side);

  return (
    <form action={formAction}>
      {state && !state.ok && <Flash tone="error" message={state.message} />}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-5 p-6">
          {main.map((f) => (
            <FieldInput key={f.name} field={f} value={values[f.name]} locked={lockedFields.includes(f.name)} />
          ))}
        </Card>
        <div className="space-y-6">
          <Card className="space-y-5 p-5">
            <button className={`${btn.primary} w-full`} disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {pending ? "Saving…" : "Save"}
            </button>
            {side.map((f) => (
              <FieldInput key={f.name} field={f} value={values[f.name]} locked={lockedFields.includes(f.name)} />
            ))}
          </Card>
          {footer}
        </div>
      </div>
    </form>
  );
}

function FieldInput({ field: f, value, locked }: { field: Field; value: unknown; locked: boolean }) {
  const id = `f-${f.name}`;
  const str = value == null ? "" : String(value);

  if (f.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 text-sm font-medium text-gray-800">
        <input type="checkbox" name={f.name} defaultChecked={Boolean(value)} className="size-4 rounded border-gray-300 accent-brand-600" />
        {f.label}
      </label>
    );
  }

  let control: React.ReactNode;
  switch (f.type) {
    case "textarea":
      control = <textarea id={id} name={f.name} defaultValue={str} rows={4} className={inputClass} required={f.required} />;
      break;
    case "richtext":
      control = <RichTextEditor name={f.name} defaultValue={str} />;
      break;
    case "image":
      control = <ImageField name={f.name} defaultValue={str} />;
      break;
    case "number":
      control = <input id={id} type="number" name={f.name} defaultValue={str || "0"} className={inputClass} />;
      break;
    case "date":
      control = <input id={id} type="date" name={f.name} defaultValue={str} className={inputClass} />;
      break;
    case "select":
      control = (
        <select id={id} name={f.name} defaultValue={str} className={inputClass}>
          {f.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    default:
      control = (
        <input
          id={id}
          type="text"
          name={f.name}
          defaultValue={str}
          className={`${inputClass} ${locked ? "bg-gray-100 text-gray-500" : ""}`}
          required={f.required}
          readOnly={locked}
          placeholder={f.type === "slug" ? "auto-generated from title" : undefined}
        />
      );
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-800">
        {f.label}
        {f.required && <span className="text-red-500"> *</span>}
      </label>
      {control}
      {locked ? (
        <p className="text-xs text-gray-500">This built-in page’s URL can’t be changed.</p>
      ) : (
        f.help && <p className="text-xs text-gray-500">{f.help}</p>
      )}
    </div>
  );
}
