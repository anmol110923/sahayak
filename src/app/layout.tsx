import type { Metadata, Viewport } from "next";
import { Noto_Sans, Noto_Sans_Bengali, Noto_Sans_Devanagari, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";
import { Footer, Header } from "@/components/Header";
import { SWRegister } from "@/components/SWRegister";

// One type family (Noto Sans) across all five languages for a consistent, formal look.
const latin = Noto_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-latin", display: "swap" });
const devanagari = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["400", "500", "600", "700"], variable: "--font-deva", display: "swap" });
const bengali = Noto_Sans_Bengali({ subsets: ["bengali"], weight: ["400", "500", "600", "700"], variable: "--font-beng", display: "swap", preload: false });
const tamil = Noto_Sans_Tamil({ subsets: ["tamil"], weight: ["400", "500", "600", "700"], variable: "--font-taml", display: "swap", preload: false });

export const metadata: Metadata = {
  title: "Yojana Setu — Government Scheme Finder",
  description: "Find the government schemes you may be eligible for, with clear reasons, document checklists and official links to apply.",
  manifest: "/manifest.webmanifest",
  icons: { icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.svg", type: "image/svg+xml" }], apple: "/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Yojana Setu", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#0a2240",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${latin.variable} ${devanagari.variable} ${bengali.variable} ${tamil.variable}`}>
      <body>
        <AppProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <SWRegister />
        </AppProvider>
      </body>
    </html>
  );
}
