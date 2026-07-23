import Link from "next/link";
import { redirect } from "next/navigation";
import { getDashboardData, getDashboardSlugs } from "@/lib/dashboard-data";

export const metadata = {
  title: "Quick-Reference Dashboards",
};

export default async function DashboardIndexPage() {
  const slugs = await getDashboardSlugs();

  if (slugs.length === 1) {
    redirect(`/dashboard/${slugs[0]}`);
  }

  const topics = await Promise.all(
    slugs.map(async (slug) => {
      const data = await getDashboardData(slug);
      return { slug, title: data?.topic.title ?? slug };
    }),
  );

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-medium">Quick-Reference Dashboards</h1>
      <ul className="flex flex-col gap-2">
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link
              href={`/dashboard/${topic.slug}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              {topic.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
