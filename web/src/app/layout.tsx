import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Providers from "@/components/providers/Providers";
import Analytics from "@/components/analytics/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prime State Health",
  description: "Cognitive assessment and metabolomics insights for modern clinics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen text-ink-900">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </div>
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
