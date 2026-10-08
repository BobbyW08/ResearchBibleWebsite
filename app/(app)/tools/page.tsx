import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Interactive tools to help with the practical side of parenting — starting with a tailored tech safety and parental-controls setup guide.",
};

type ToolCard = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const tools: ToolCard[] = [
  {
    title: "Tech Safety & Consequence Setup",
    description:
      "Pick your phone and your child's devices, and get a tailored step-by-step parental-controls guide, a workarounds list, and a printable checklist.",
    href: "/tech-safety",
    icon: ShieldCheck,
  },
];

export default function ToolsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 lg:py-16">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <span className="h-px w-6 bg-border" />
              Bobby Washburn Parenting Support
            </p>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tools
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Interactive tools for the practical side of parenting — more get added over time.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {tools.map(({ title, description, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground">{title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
