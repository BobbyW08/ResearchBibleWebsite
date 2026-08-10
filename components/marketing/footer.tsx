import Link from "next/link";
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

async function Footer() {
  const data = await reader.singletons.footer.read();
  const tagline = data?.tagline || FALLBACK_TAGLINE;
  const contactEmail = data?.contactEmail || FALLBACK_CONTACT_EMAIL;
  const copyrightText = data?.copyrightText || FALLBACK_COPYRIGHT;
  const sections = data?.sections ?? [];

  return (
    <footer className="py-10">
      <div className="max-w-7xl xl:px-16 lg:px-8 px-4 mx-auto">
        <div className="flex flex-col gap-6 sm:gap-12">
          <div className="py-12 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-12 gap-x-8 gap-y-10 px-6 xl:px-0">
            <div className="col-span-full lg:col-span-4">
              <div className="flex flex-col gap-6">
                <Link href="/">
                  <Logo />
                </Link>
                <p className="text-base font-normal text-muted-foreground">{tagline}</p>
                <div className="flex items-center gap-4">
                  <NewsletterDialog triggerClassName="text-muted-foreground hover:text-foreground">
                    <span className="sr-only">Newsletter signup</span>
                    <SubstackIcon />
                  </NewsletterDialog>
                  <a
                    href="https://www.linkedin.com/in/bobby-washburn/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LinkedinIcon />
                  </a>
                  <ComingSoonTrigger label="Instagram" className="text-muted-foreground">
                    <InstagramIcon />
                  </ComingSoonTrigger>
                </div>
              </div>
            </div>

            <div className="col-span-1 lg:block hidden" />

            {sections.map(({ title, links }, index) => (
              <div key={index} className="col-span-2">
                <div className="flex flex-col gap-4">
                  <p className="text-base font-medium text-foreground">{title}</p>
                  <ul className="flex flex-col gap-3">
                    {links.map(({ title: linkTitle, linkType }) => (
                      <li key={linkTitle}>
                        {linkType.discriminant === "newsletter" ? (
                          <NewsletterDialog triggerClassName="text-base font-normal text-muted-foreground hover:text-foreground">
                            {linkTitle}
                          </NewsletterDialog>
                        ) : linkType.discriminant === "comingSoon" ? (
                          <ComingSoonTrigger
                            label={linkTitle}
                            className="text-base font-normal text-muted-foreground"
                          >
                            {linkTitle}
                          </ComingSoonTrigger>
                        ) : (
                          <Link
                            href={linkType.value.href}
                            className="text-base font-normal text-muted-foreground hover:text-foreground"
                          >
                            {linkTitle}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <div className="col-span-3">
              <div className="flex flex-col gap-4">
                <p className="text-base font-medium text-foreground">Contact</p>
                <ul className="flex flex-col gap-3">
                  <li>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-base font-normal text-muted-foreground hover:text-foreground"
                    >
                      {contactEmail}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Separator orientation="horizontal" />
          <p className="text-sm font-normal text-muted-foreground text-center">{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
