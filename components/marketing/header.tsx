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

type NavigationSection = {
  title: string;
  href: string;
};

const navigationData: NavigationSection[] = [
  { title: "About", href: "/about" },
  { title: "Guides", href: "/docs" },
  { title: "Pain Points", href: "/help" },
  { title: "FAQ", href: "/#faq" },
];

const BookACallButton = ({ className }: { className?: string }) => (
  <Link
    href="https://cal.com/bobby-washburn/1on1"
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

const Header = () => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
      className="inset-x-0 z-50 px-4 flex items-center justify-center sticky top-0 h-20"
    >
      <div
        className={cn(
          "w-full max-w-6xl flex items-center h-fit justify-between gap-3.5 lg:gap-6 transition-all duration-500",
          sticky
            ? "p-2.5 bg-background/60 backdrop-blur-lg border border-border/40 shadow-2xl shadow-primary/5 rounded-full"
            : "bg-transparent border-transparent",
        )}
      >
        <div>
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <div>
          <NavigationMenu className="max-lg:hidden bg-muted p-0.5 rounded-full">
            <NavigationMenuList className="flex gap-0">
              {navigationData.map((navItem) => (
                <NavigationMenuItem key={navItem.title}>
                  <NavigationMenuLink
                    render={<Link href={navItem.href} />}
                    className="px-2 lg:px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-background outline outline-transparent hover:outline-border hover:shadow-xs transition tracking-normal"
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
                <span className="rounded-full border border-border p-2 block">
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
                  <Link href="/">
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
                        href="https://www.instagram.com/bobby__washburn/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-full outline outline-border hover:bg-muted transition p-3 shadow-xs"
                      >
                        <InstagramIcon />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/bobby-washburn/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-full outline outline-border hover:bg-muted transition p-3 shadow-xs"
                      >
                        <LinkedinIcon />
                      </a>
                      <a
                        href="https://roughlyeducated.substack.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-full outline outline-border hover:bg-muted transition p-3 shadow-xs"
                      >
                        <SubstackIcon />
                      </a>
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
