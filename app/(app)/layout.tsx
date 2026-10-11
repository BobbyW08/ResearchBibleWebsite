import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { Archivo, Arvo, Caveat, Geist_Mono, Libre_Franklin } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "../providers";
import "../globals.css";

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const titlePlaceholder = Archivo({
  variable: "--font-title-placeholder",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
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
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
