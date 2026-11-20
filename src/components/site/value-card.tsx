import { Award, BadgeCheck, HeartHandshake, Sparkles, Users } from "lucide-react";
import type { CoreValue } from "@/db/schema";

const icons = [BadgeCheck, Award, Users, HeartHandshake, Sparkles];
const tones = ["bg-brand-600", "bg-accent-500", "bg-brand-800", "bg-accent-600", "bg-brand-500"];

export function ValueCard({ value, index, compact = false }: { value: CoreValue; index: number; compact?: boolean }) {
  const Icon = icons[index % icons.length];
  return (
    <div
      className={`${tones[index % tones.length]} relative h-full overflow-hidden rounded-3xl text-white shadow-xl shadow-black/10 ${compact ? "p-5 sm:p-7" : "p-8"}`}
    >
      <span className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-white/10" />
      <Icon className={compact ? "size-7 sm:size-9" : "size-10"} />
      <h3 className={`font-display ${compact ? "mt-3 text-lg sm:mt-4 sm:text-2xl" : "mt-5 text-2xl"}`}>{value.title}</h3>
      {value.description && (
        <p className={`leading-relaxed text-white/85 ${compact ? "mt-2 hidden text-[15px] sm:block" : "mt-3"}`}>
          {value.description}
        </p>
      )}
    </div>
  );
}
