import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Space_Grotesk } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "./providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
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

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bobby Washburn",
  url: "https://bobby-washburn.com",
  jobTitle: "Certified Peer Recovery Specialist (CPRS)",
  description:
    "Peer educator with lived experience in mental health and substance use recovery. Helping parents at their wits' end find a way through.",
  sameAs: [
    "https://www.instagram.com/bobby__washburn/",
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
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <RootProvider theme={{ forcedTheme: "light", defaultTheme: "light" }}>
          <Providers>
            <TooltipProvider>{children}</TooltipProvider>
          </Providers>
        </RootProvider>
      </body>
    </html>
  );
}
