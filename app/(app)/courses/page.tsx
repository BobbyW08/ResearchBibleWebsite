import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { PageContainer } from "@/components/layout/page-container";
import { getAllCourses } from "@/lib/payload-courses";

export const metadata: Metadata = {
  title: "Courses",
  description: "Structured parenting courses from Bobby Washburn.",
  robots: { index: false },
};

export default async function CoursesPage() {
  const published = await getAllCourses().catch(() => []);

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <section className="border-b border-border">
          <PageContainer className="py-16 lg:py-20">
            <h1 className="font-heading text-3xl font-medium tracking-tight">Courses</h1>
            <p className="mt-4 text-base text-muted-foreground">
              Structured learning on parenting topics. Work through at your own pace.
            </p>
          </PageContainer>
        </section>

        {published.length === 0 ? (
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
        ) : (
          <section>
            <PageContainer className="py-12">
              <ul className="grid gap-6 sm:grid-cols-2">
                {published.map((course) => (
                  <li key={course.id}>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="group flex flex-col gap-3 rounded-lg border border-border p-6 transition-colors hover:border-primary"
                    >
                      <h2 className="font-heading text-lg font-medium tracking-tight group-hover:text-primary">
                        {course.title}
                      </h2>
                      {course.description && (
                        <p className="text-sm text-muted-foreground">{course.description}</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </PageContainer>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
