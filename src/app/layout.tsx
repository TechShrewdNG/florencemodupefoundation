import type { Metadata } from "next";
import { DM_Sans, Fraunces, Caveat } from "next/font/google";
import { getSettings } from "@/lib/data";
import "./globals.css";

const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const script = Caveat({ subsets: ["latin"], variable: "--font-script" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
    title: { default: `${s.siteName} – ${s.tagline}`, template: `%s – ${s.siteName}` },
    description: s.mission,
    icons: { icon: "/images/icon.jpg" },
    openGraph: { siteName: s.siteName, images: [s.aboutImage] },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${script.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
