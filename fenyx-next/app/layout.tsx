// Das Layout ist die "Hülle" um JEDE Seite.
// Header und Footer stehen hier einmal -> erscheinen automatisch überall.

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./site-nav.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChromeGate from "@/components/ChromeGate";

// ── Marken-Fonts (self-hosted, aus dem Webflow-Original) ──────────
// Roobert = Fließtext (body). Telegraf = Überschriften (h1–h6).
// Beide werden mitgeliefert (kein Google/CDN) -> schnell & DSGVO-freundlich.

const roobert = localFont({
  src: [
    { path: "./fonts/Roobert-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Roobert-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/Roobert-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-roobert",
  display: "swap",
});

const telegraf = localFont({
  src: [
    { path: "./fonts/PPTelegraf-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/PPTelegraf-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-telegraf",
  display: "swap",
});

// Standard-Metadaten (SEO). Einzelne Seiten können das überschreiben.
export const metadata: Metadata = {
  title: "Fenyx GmbH – Zirkuläre Bürotransformationen",
  description:
    "Fenyx GmbH – Ihr Partner für zirkuläre Bürotransformationen: Bestandsmanagement, Verwertung und schlüsselfertige Einrichtung.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${roobert.variable} ${telegraf.variable}`}>
      <body
        className="font-sans text-black bg-white antialiased"
        suppressHydrationWarning
      >
        <ChromeGate header={<Header />} footer={<Footer />}>
          {children}
        </ChromeGate>
      </body>
    </html>
  );
}
