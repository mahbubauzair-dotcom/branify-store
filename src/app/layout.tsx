import type { Metadata } from "next";
import { Poppins, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://branify.store";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BRANIFY — Premium Digital Agency & Brand Studio",
    template: "%s | BRANIFY",
  },
  description:
    "BRANIFY is a premium digital agency crafting world-class websites, brand identities, AI solutions, and digital products. We build brands that feel like a million dollars.",
  keywords: [
    "digital agency",
    "brand identity",
    "website development",
    "UI UX design",
    "logo design",
    "AI solutions",
    "WordPress development",
    "Branify",
    "digital products",
    "SEO",
  ],
  authors: [{ name: "BRANIFY" }],
  creator: "BRANIFY",
  publisher: "BRANIFY",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "BRANIFY — Premium Digital Agency & Brand Studio",
    description:
      "Crafting world-class websites, brand identities, AI solutions & digital products. Brands that feel like a million dollars.",
    url: siteUrl,
    siteName: "BRANIFY",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BRANIFY — Premium Digital Agency & Brand Studio",
    description:
      "Crafting world-class websites, brand identities, AI solutions & digital products.",
    creator: "@branify",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
