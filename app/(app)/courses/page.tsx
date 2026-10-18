import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { PageContainer } from "@/components/layout/page-container";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";
import { getAllCourses } from "@/lib/payload-courses";

export const metadata: Metadata = {
  title: "Courses",
  description: "Structured parenting courses from Bobby Washburn.",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/sign-in?returnTo=/courses");

  const payload = await getPayloadClient();
  const { docs: profileDocs } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: session.user.id } },
    limit: 1,
  });
  if (!profileDocs[0]) redirect("/welcome");

  const userRole = profileDocs[0].userRole as string;

  const allCourses = await getAllCourses().catch(() => []);
  const published = allCourses.filter(
    (c) =>
      (c.audience as string) === "all" || (c.audience as string) === userRole
  );

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
                  <li key={course.id as string}>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="group flex flex-col gap-3 rounded-lg border border-border p-6 transition-colors hover:border-primary"
                    >
                      <h2 className="font-heading text-lg font-medium tracking-tight group-hover:text-primary">
                        {course.title as string}
                      </h2>
                      {course.description && (
                        <p className="text-sm text-muted-foreground">{course.description as string}</p>
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
