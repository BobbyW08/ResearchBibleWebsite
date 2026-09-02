import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { Archivo, Arvo, Caveat, Geist_Mono, Libre_Franklin } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "./providers";
import "./globals.css";

// Heading + subheading + body, per the brand system — real spec, not a placeholder.
const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
});

// Quote / testimonial text, per the brand system — real spec, not a placeholder.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

// Placeholder for "Philly Sans" (hero-level title font). Bobby is resolving
// licensing/a production substitute before this ships — swapping the real font
// in only means changing this import and the --font-title-placeholder variable
// name below, nothing structural.
const titlePlaceholder = Archivo({
  variable: "--font-title-placeholder",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

// Subtitle font — resolved, per homepage-redesign-v3.md: Arvo replaces the
// Rockwell placeholder (free Google Font, no licensing issue). Real/final,
// not a placeholder — unlike titlePlaceholder above.
const arvo = Arvo({
  variable: "--font-arvo",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bobby-washburn.com"),
  title: {
    default: "Bobby Washburn | Parenting Support",
    template: "%s | Bobby Washburn",
  },
  description:
    "Struggling with your kid and don't know why? Bobby Washburn is a CPRS and peer educator who works with parents at their wits' end — whatever the challenge.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Bobby Washburn | Parenting Support",
    description:
      "You've tried everything. Something still isn't working. That's exactly where I come in.",
    type: "website",
    url: "https://bobby-washburn.com",
  },
};

// GA4 Google tag — sitewide, loaded once from the root layout (shared by
// every route). `afterInteractive` is Next.js's/Google's recommended
// strategy for analytics: it loads early without blocking hydration. Since
// this lives in the root layout rather than a page component, it isn't
// remounted on client-side navigation between routes, so gtag() only
// initializes once per page load.
const GA4_MEASUREMENT_ID = "G-5ZLMM0G7CV";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bobby Washburn",
  url: "https://bobby-washburn.com",
  jobTitle: "Certified Peer Recovery Specialist (CPRS)",
  description:
    "Peer educator with lived experience in mental health and substance use recovery. Helping parents at their wits' end find a way through.",
  sameAs: [
    "https://www.linkedin.com/in/bobby-washburn/",
    "https://roughlyeducated.substack.com/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${libreFranklin.variable} ${caveat.variable} ${titlePlaceholder.variable} ${arvo.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_MEASUREMENT_ID}');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <RootProvider theme={{ forcedTheme: "light", defaultTheme: "light" }}>
          <Providers>
            <TooltipProvider>{children}</TooltipProvider>
          </Providers>
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
