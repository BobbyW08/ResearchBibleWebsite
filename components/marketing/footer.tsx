import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/assets/logo/logo";
import { Separator } from "@/components/ui/separator";
import { InstagramIcon, LinkedinIcon, SubstackIcon } from "@/components/marketing/social-icons";
import NewsletterDialog from "@/components/marketing/newsletter-dialog";
import ComingSoonTrigger from "@/components/marketing/coming-soon-trigger";
import { reader } from "@/lib/keystatic-reader";

const FALLBACK_TAGLINE = "Parenting support from someone who's been there.";
const FALLBACK_CONTACT_EMAIL = "bobbywashburn0@gmail.com";
const FALLBACK_COPYRIGHT =
  "© 2026 Bobby Washburn. Peer support and parenting education — not therapy, diagnosis, or medical advice.";

// Per homepage-redesign-v3.md Section 5: the footer nav is NOT identical to
// the header nav — it's one item longer (Organizations, which is deliberately
// left out of the header — see header.tsx). Set in Arvo, bigger type, with a
// bymonolog.com-style hover treatment (row fills solid, text inverts, arrow
// appears) rather than the header's inline underline/color-change pattern.
const SITEMAP_LINKS = [
  { title: "About", href: "/about-bobby" },
  { title: "Start Here", href: "/#start-here" },
  { title: "Parents", href: "/services" },
  { title: "Organizations", href: "/services/organizations" },
  { title: "FAQs", href: "/#faq" },
];

async function Footer() {
  const data = await reader.singletons.footer.read();
  const tagline = data?.tagline || FALLBACK_TAGLINE;
  const contactEmail = data?.contactEmail || FALLBACK_CONTACT_EMAIL;
  const copyrightText = data?.copyrightText || FALLBACK_COPYRIGHT;

  return (
    <footer className="border-t border-border bg-brand-black text-brand-offwhite">
      <div className="max-w-[110rem] xl:px-16 lg:px-8 px-4 mx-auto">
        <div className="flex flex-col gap-6 sm:gap-12">
          <div className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 sm:gap-8">
            <div className="flex flex-col gap-6">
              <Link href="/">
                <Logo onDark />
              </Link>
              <p className="max-w-sm text-base font-normal text-brand-offwhite/70">{tagline}</p>
              <ul className="flex flex-col">
                {SITEMAP_LINKS.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="group/navrow -mx-3 flex items-center justify-between gap-2 rounded-sm px-3 py-2 font-subtitle text-lg text-brand-offwhite/80 transition-colors duration-200 hover:bg-brand-offwhite hover:text-brand-black"
                    >
                      {link.title}
                      <ArrowUpRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover/navrow:translate-x-0 group-hover/navrow:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 sm:items-end sm:text-right">
              <p className="text-base font-medium text-brand-offwhite">Connect</p>
              <div className="flex flex-col gap-3 sm:items-end">
                <Link
                  href="https://cal.com/bobby-washburn/intro-call"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-normal text-brand-offwhite/70 hover:text-brand-offwhite"
                >
                  Book a Call
                </Link>
                <NewsletterDialog triggerClassName="text-base font-normal text-brand-offwhite/70 hover:text-brand-offwhite">
                  Newsletter
                </NewsletterDialog>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-base font-normal text-brand-offwhite/70 hover:text-brand-offwhite"
                >
                  {contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-4 sm:justify-end">
                <a
                  href="https://www.linkedin.com/in/bobby-washburn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-offwhite/70 hover:text-brand-offwhite"
                >
                  <LinkedinIcon />
                </a>
                <NewsletterDialog triggerClassName="text-brand-offwhite/70 hover:text-brand-offwhite">
                  <span className="sr-only">Newsletter signup</span>
                  <SubstackIcon />
                </NewsletterDialog>
                <ComingSoonTrigger label="Instagram" className="text-brand-offwhite/70">
                  <InstagramIcon />
                </ComingSoonTrigger>
              </div>
            </div>
          </div>
          <Separator orientation="horizontal" className="bg-brand-offwhite/15" />
          <p className="pb-10 text-sm font-normal text-brand-offwhite/60 text-center">{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
