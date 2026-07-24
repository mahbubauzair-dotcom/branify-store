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
    icon: "/branify-logo.png",
    shortcut: "/branify-logo.png",
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
      <head>
        {/* JSON-LD structured data for rich search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  name: "BRANIFY",
                  url: siteUrl,
                  logo: `${siteUrl}/branify-logo.png`,
                  description:
                    "Premium digital agency crafting world-class websites, brand identities, AI solutions and digital products.",
                  foundingDate: "2019",
                  email: "admin@branify.store",
                  telephone: "+92-334-1079333",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "548 Market Street",
                    addressLocality: "San Francisco",
                    addressRegion: "CA",
                    postalCode: "94104",
                    addressCountry: "US",
                  },
                  sameAs: [
                    "https://twitter.com/branify",
                    "https://instagram.com/branify",
                    "https://linkedin.com/company/branify",
                    "https://dribbble.com/branify",
                    "https://github.com/branify",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  url: siteUrl,
                  name: "BRANIFY",
                  publisher: { "@id": `${siteUrl}/#organization` },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: `${siteUrl}/?q={search_term_string}`,
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "ProfessionalService",
                  name: "BRANIFY",
                  image: `${siteUrl}/branify-logo.png`,
                  "@id": `${siteUrl}/#professional-service`,
                  url: siteUrl,
                  telephone: "+92-334-1079333",
                  priceRange: "$$-$$$$",
                  address: { "@id": `${siteUrl}/#organization` },
                  areaServed: "Worldwide",
                  serviceType: [
                    "Website Development",
                    "UI/UX Design",
                    "Brand Identity",
                    "Logo Design",
                    "SEO",
                    "AI Solutions",
                  ],
                },
              ],
            }),
          }}
        />
      </head>
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
