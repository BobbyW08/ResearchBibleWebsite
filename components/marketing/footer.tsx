import Link from "next/link";
import Logo from "@/assets/logo/logo";
import { Separator } from "@/components/ui/separator";
import { InstagramIcon, LinkedinIcon } from "@/components/marketing/social-icons";

type FooterSection = {
  title: string;
  links: { title: string; href: string }[];
};

const footerSections: FooterSection[] = [
  {
    title: "Sitemap",
    links: [
      { title: "About", href: "#about" },
      { title: "Services", href: "#services" },
      { title: "Testimonials", href: "#testimonials" },
      { title: "Research bible", href: "/docs" },
    ],
  },
  {
    title: "Other pages",
    links: [
      { title: "Book a call", href: "#book-a-call" },
      { title: "FAQ", href: "#faq" },
      { title: "Privacy policy", href: "#" },
    ],
  },
];

function Footer() {
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
                <p className="text-base font-normal text-muted-foreground">
                  Practical, research-grounded parenting support.
                </p>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    <InstagramIcon />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    <LinkedinIcon />
                  </a>
                </div>
              </div>
            </div>

            <div className="col-span-1 lg:block hidden" />

            {footerSections.map(({ title, links }, index) => (
              <div key={index} className="col-span-2">
                <div className="flex flex-col gap-4">
                  <p className="text-base font-medium text-foreground">{title}</p>
                  <ul className="flex flex-col gap-3">
                    {links.map(({ title, href }) => (
                      <li key={title}>
                        <Link
                          href={href}
                          className="text-base font-normal text-muted-foreground hover:text-foreground"
                        >
                          {title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <div className="col-span-3">
              <div className="flex flex-col gap-4">
                <p className="text-base font-medium text-foreground">
                  Contact
                </p>
                <ul className="flex flex-col gap-3">
                  <li>
                    <a
                      href="mailto:hello@example.com"
                      className="text-base font-normal text-muted-foreground hover:text-foreground"
                    >
                      hello@example.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Separator orientation="horizontal" />
          <p className="text-sm font-normal text-muted-foreground text-center">
            © 2026 Research Bible. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
