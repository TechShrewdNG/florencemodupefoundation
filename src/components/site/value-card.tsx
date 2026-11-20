import { Award, BadgeCheck, HeartHandshake, Sparkles, Users } from "lucide-react";
import type { CoreValue } from "@/db/schema";

const icons = [BadgeCheck, Award, Users, HeartHandshake, Sparkles];
const tones = ["bg-brand-600", "bg-accent-500", "bg-brand-800", "bg-accent-600", "bg-brand-500"];

export function ValueCard({ value, index }: { value: CoreValue; index: number }) {
  const Icon = icons[index % icons.length];
  return (
    <div className={`${tones[index % tones.length]} rounded-2xl p-7 text-white shadow-lg`}>
      <Icon className="size-9 opacity-90" />
      <h3 className="mt-4 font-display text-2xl">{value.title}</h3>
      {value.description && <p className="mt-2 leading-relaxed text-white/85">{value.description}</p>}
    </div>
  );
}
