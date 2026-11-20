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
  founderQuote: string;
  founderName: string;
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
  email: "info@theflorencemodupefoundation.com",
  phone: "0803 768 5718",
  address: "5 Adekunle Lawal Street, Ikoyi, Lagos.",
  socials: { facebook: "", twitter: "", instagram: "", youtube: "", linkedin: "" },
  aboutEyebrow: "About Us",
  aboutHeading: "Who We Are",
  aboutText:
    "Florence Modupe Foundation, FMF, is a registered non-governmental organization. Our mission is to provide equitable access to quality education and life-changing skills for Africans, women and children in particular, aimed at developing future leaders. This is in line with the United Nations Sustainable Development Goals that must be achieved on or before the year 2030. To make this a reality, we partner with individuals, educational institutions, government and communities.",
  aboutImage: "/images/img_2452.jpg",
  vision: "To create a platform that institutionalizes learning and development.",
  mission:
    "Equitable access to quality education and life changing skills for Africans aimed at developing future leaders.",
  stats: [],
  founderQuote:
    "We will invest in the educational needs of indigent but creative and brilliant children in Nigeria, irrespective of their religion and tribe.",
  founderName: "Dr (Mrs.) Olubukola Abitoye, Founder",
  ctaHeading: "Join the Helpers Group",
  ctaText:
    "Every child has a right to quality education. Partner with us, volunteer your time or give today to help a child learn and a woman build her future.",
  ctaButtonLabel: "Donate",
  ctaButtonHref: "/donate",
  newsletterHeading: "Join Our Cause",
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
