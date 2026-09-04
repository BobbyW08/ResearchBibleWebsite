"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Logo from "@/assets/logo/logo";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { InstagramIcon, LinkedinIcon, SubstackIcon } from "@/components/marketing/social-icons";
import NewsletterDialog from "@/components/marketing/newsletter-dialog";
import ComingSoonTrigger from "@/components/marketing/coming-soon-trigger";

type NavigationSection = {
  title: string;
  href: string;
};

// Per homepage-redesign-v3.md: About / Start Here / Parents / FAQs, no dropdown.
// "Parents" (renamed from "Services") links to /services — Organizations is
// deliberately not a header item, reached via Start Here or the footer nav
// instead (see footer.tsx). Start Here and FAQs are in-page anchors on the
// homepage; from any other page they still work — the browser navigates home,
// then scrolls to the anchor.
const navigationData: NavigationSection[] = [
  { title: "About", href: "/about-bobby" },
  { title: "Start Here", href: "/#start-here" },
  { title: "Parents", href: "/services" },
  { title: "FAQs", href: "/#faq" },
];

const BookACallButton = ({ className }: { className?: string }) => (
  <Link
    href="https://cal.com/bobby-washburn/intro-call"
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "relative inline-flex items-center bg-primary text-primary-foreground hover:bg-primary/80 text-sm font-medium rounded-full h-10 p-1 ps-4 pe-12 group transition-all duration-500 hover:ps-12 hover:pe-4 w-fit overflow-hidden",
      className,
    )}
  >
    <span className="relative z-10 transition-all duration-500">
      Book a call
    </span>
    <span className="absolute right-1 w-8 h-8 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-36px)] group-hover:rotate-45">
      <ArrowUpRight size={16} />
    </span>
  </Link>
);

type HeaderProps = {
  /**
   * True only on the homepage, where the header sits over the dark Proof
   * Wall hero field and renders light-on-dark until the user scrolls past
   * it. Every other page has no hero to blend with, so it's always
   * dark-on-light there.
   */
  logoAnimatesIn?: boolean;
};

const Header = ({ logoAnimatesIn = false }: HeaderProps) => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // Per homepage-redesign-v3.md: header and hero are one continuous flat
  // #111111 surface — while the header is still transparent over the hero
  // (not yet sticky), its logo/nav render light-on-dark to match; once
  // scrolled past the hero into the frosted sticky pill, they go back to the
  // normal dark-on-light styling used on every other page.
  const onHeroField = logoAnimatesIn && !sticky;

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className={cn(
        "inset-x-0 z-50 px-4 flex items-center justify-center sticky top-0 h-20",
        onHeroField ? "bg-brand-black" : "bg-background",
      )}
    >
      <div
        className={cn(
          "w-full max-w-[110rem] flex items-center h-fit justify-between gap-3.5 lg:gap-6 transition-all duration-500",
          sticky
            ? "p-2.5 bg-background/60 backdrop-blur-lg border border-border/40 shadow-2xl shadow-primary/5 rounded-full"
            : "bg-transparent border-transparent",
        )}
      >
        <div>
          <Link href="/" aria-label="Bobby Washburn Parenting Support">
            <Logo onDark={onHeroField} />
          </Link>
        </div>

        <div>
          <NavigationMenu
            className={cn(
              "max-lg:hidden p-0.5 rounded-full",
              onHeroField ? "bg-transparent" : "bg-muted",
            )}
          >
            <NavigationMenuList className="flex gap-0">
              {navigationData.map((navItem) => (
                <NavigationMenuItem key={navItem.title}>
                  <NavigationMenuLink
                    render={<Link href={navItem.href} />}
                    className={cn(
                      "px-2 lg:px-4 py-2 text-sm font-medium rounded-full outline outline-transparent transition tracking-normal",
                      onHeroField
                        ? "text-brand-offwhite/80 hover:text-brand-offwhite hover:bg-white/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-background hover:outline-border hover:shadow-xs",
                    )}
                  >
                    {navItem.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex gap-4">
          <BookACallButton className="hidden lg:flex" />

          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger id="mobile-menu-trigger">
                <span
                  className={cn(
                    "rounded-full border p-2 block",
                    onHeroField
                      ? "border-brand-offwhite/30 text-brand-offwhite"
                      : "border-border text-foreground",
                  )}
                >
                  <Menu width={20} height={20} />
                  <span className="sr-only">Menu</span>
                </span>
              </SheetTrigger>

              <SheetContent
                showCloseButton={false}
                side="right"
                className="w-full sm:w-96 p-0 border-l-0"
              >
                <div className="flex items-center justify-between p-6">
                  <Link href="/" aria-label="Bobby Washburn Parenting Support">
                    <Logo />
                  </Link>
                  <SheetClose id="mobile-menu-close">
                    <span className="rounded-full border border-border p-2.5 block">
                      <X width={16} height={16} />
                    </span>
                  </SheetClose>
                </div>

                <div className="flex flex-col gap-12 px-6 pb-6 overflow-y-auto">
                  <div className="flex flex-col gap-8">
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <NavigationMenu
                      orientation="vertical"
                      className="items-start flex-none"
                    >
                      <NavigationMenuList className="flex flex-col items-start gap-3">
                        {navigationData.map((item) => (
                          <NavigationMenuItem key={item.title}>
                            <NavigationMenuLink
                              render={<Link href={item.href} />}
                              className="group/nav flex items-center text-2xl font-semibold tracking-tight transition-all p-0 hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent text-muted-foreground hover:text-foreground hover:translate-x-2"
                            >
                              {item.title}
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        ))}
                      </NavigationMenuList>
                    </NavigationMenu>

                    <div className="w-fit">
                      <BookACallButton />
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-4">
                    <div className="flex gap-3">
                      <a
                        href="https://www.linkedin.com/in/bobby-washburn/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-full outline outline-border hover:bg-muted transition p-3 shadow-xs"
                      >
                        <LinkedinIcon />
                      </a>
                      <NewsletterDialog
                        triggerClassName="flex items-center justify-center rounded-full outline outline-border hover:bg-muted transition p-3 shadow-xs"
                      >
                        <span className="sr-only">Newsletter signup</span>
                        <SubstackIcon />
                      </NewsletterDialog>
                      <ComingSoonTrigger
                        label="Instagram"
                        className="rounded-full border border-border p-3 shadow-xs"
                      >
                        <InstagramIcon />
                      </ComingSoonTrigger>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      © 2026 Bobby Washburn
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
