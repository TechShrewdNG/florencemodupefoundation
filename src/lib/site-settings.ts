export type Stat = { value: string; label: string };

export type SiteSettings = {
  siteName: string;
  tagline: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  socials: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
  aboutEyebrow: string;
  aboutHeading: string;
  aboutText: string;
  aboutImage: string;
  vision: string;
  mission: string;
  stats: Stat[];
  ctaHeading: string;
  ctaText: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
  newsletterHeading: string;
  newsletterText: string;
  footerText: string;
};

export const defaultSettings: SiteSettings = {
  siteName: "Florence Modupe Foundation",
  tagline: "A Building With Four Walls And Tomorrow Inside",
  logo: "/images/logo.jpg",
  email: "info@florencemodupefoundation.com",
  phone: "+234 812 345 6789",
  address: "Lagos, Nigeria",
  socials: { facebook: "", twitter: "", instagram: "", youtube: "", linkedin: "" },
  aboutEyebrow: "Helping Today",
  aboutHeading: "Life-changing skills for Africans",
  aboutText:
    "The Florence Modupe Foundation works towards educational inclusion in Africa. We support children and young people with access to quality education and the practical skills they need to build a better tomorrow for themselves and their communities.",
  aboutImage: "/images/img_2306.jpg",
  vision: "To create a platform that institutionalizes learning and development.",
  mission:
    "Equitable access to quality education and life changing skills for Africans aimed at developing future leaders.",
  stats: [],
  ctaHeading: "Join the Helpers Group",
  ctaText:
    "Every child has a right to education. Partner with us, volunteer your time or give today to help a child learn.",
  ctaButtonLabel: "Support Us",
  ctaButtonHref: "/support-us",
  newsletterHeading: "Stay in the loop",
  newsletterText: "Get news about our outreaches and our little steps of progress.",
  footerText: "Our little steps of progress towards Educational Inclusion in Africa.",
};

/** Merge stored settings over defaults so newly added keys always have a value. */
export function mergeSettings(stored: Partial<SiteSettings> | null | undefined): SiteSettings {
  return {
    ...defaultSettings,
    ...(stored ?? {}),
    socials: { ...defaultSettings.socials, ...(stored?.socials ?? {}) },
    stats: stored?.stats ?? defaultSettings.stats,
  };
}
