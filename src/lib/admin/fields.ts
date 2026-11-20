/** Field definitions are plain data so they can be passed to client components. */
export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "image"
  | "images"
  | "number"
  | "checkbox"
  | "date"
  | "select"
  | "slug";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  /** For slug fields: which field to derive the slug from when left blank. */
  from?: string;
  /** Render in the narrow sidebar column of the edit form. */
  side?: boolean;
};

export type CollectionMeta = {
  key: string;
  label: string;
  singular: string;
  description: string;
  titleField: string;
  /** Extra columns shown on the list page. */
  columns: { name: string; label: string; type?: "boolean" | "image" | "text" }[];
  fields: Field[];
  /** Public URL for an item, for "View on site" links. */
  publicPath?: (item: Record<string, unknown>) => string | null;
};
