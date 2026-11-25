import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";
import { Footer, Header } from "@/components/Header";
import { SWRegister } from "@/components/SWRegister";

const inter = Inter({ subsets: ["latin"], variable: "--font-latin", display: "swap" });
const devanagari = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["400", "500", "600", "700"], variable: "--font-deva", display: "swap" });

export const metadata: Metadata = {
  title: "Sahayak — Government Scheme Finder",
  description: "Find the government schemes you may be eligible for, with clear reasons, document checklists and official links to apply.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon-192.png" },
  appleWebApp: { capable: true, title: "Sahayak", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1420" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${devanagari.variable}`}>
      <body>
        <AppProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <SWRegister />
        </AppProvider>
      </body>
    </html>
  );
}
