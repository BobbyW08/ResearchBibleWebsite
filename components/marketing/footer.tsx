import Link from "next/link";
import Logo from "@/assets/logo/logo";
import { Separator } from "@/components/ui/separator";
import { InstagramIcon, LinkedinIcon, SubstackIcon } from "@/components/marketing/social-icons";

type FooterSection = {
  title: string;
  links: { title: string; href: string }[];
};

const footerSections: FooterSection[] = [
  {
    title: "Sitemap",
    links: [
      { title: "About", href: "/about" },
      { title: "Pain Points", href: "/help" },
      { title: "Guides", href: "/docs" },
      { title: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Connect",
    links: [
      { title: "Book a Call", href: "https://cal.com/bobby-washburn/1on1" },
      { title: "Newsletter", href: "https://roughlyeducated.substack.com/" },
      { title: "Instagram", href: "https://www.instagram.com/bobby__washburn/" },
      { title: "LinkedIn", href: "https://www.linkedin.com/in/bobby-washburn/" },
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
                  Parenting support from someone who&apos;s been there.
                </p>
                <div className="flex items-center gap-4">
                  <a href="https://www.instagram.com/bobby__washburn/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                    <InstagramIcon />
                  </a>
                  <a href="https://www.linkedin.com/in/bobby-washburn/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                    <LinkedinIcon />
                  </a>
                  <a href="https://roughlyeducated.substack.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                    <SubstackIcon />
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
                      href="mailto:bobbywashburn0@gmail.com"
                      className="text-base font-normal text-muted-foreground hover:text-foreground"
                    >
                      bobbywashburn0@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Separator orientation="horizontal" />
          <p className="text-sm font-normal text-muted-foreground text-center">
            © 2026 Bobby Washburn. Peer support and parenting education —
            not therapy, diagnosis, or medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
