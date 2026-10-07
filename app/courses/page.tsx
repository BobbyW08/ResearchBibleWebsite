import type { Metadata } from "next";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Courses",
  description: "Structured parenting courses from Bobby Washburn. Coming soon.",
};

export default function CoursesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8 lg:py-20">
            <h1 className="font-heading text-3xl font-medium tracking-tight">Courses</h1>
            <p className="mt-4 text-base text-muted-foreground">
              Structured learning on parenting topics. Work through at your own pace.
            </p>
          </div>
        </section>
        <section className="flex flex-1 items-center justify-center">
          <div className="mx-auto max-w-md px-4 py-24 text-center">
            <p className="font-subtitle text-sm font-semibold uppercase tracking-widest text-primary">
              Coming Soon
            </p>
            <h2 className="mt-4 font-heading text-2xl font-medium tracking-tight">
              Courses are in development
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              The first courses will cover the same evidence-based topics as the deep dives
              on this site, with guided structure and practical takeaways. Check back soon.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
