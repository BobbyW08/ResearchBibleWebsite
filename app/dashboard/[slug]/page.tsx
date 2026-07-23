import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { DashboardShell } from "@/components/dashboard/shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { ConsensusChart } from "@/components/dashboard/consensus-chart";
import { DisagreementTable } from "@/components/dashboard/disagreement-table";
import { getDashboardData, getDashboardSlugs } from "@/lib/dashboard-data";
import { ArrowUpRight } from "lucide-react";

export async function generateStaticParams() {
  const slugs = await getDashboardSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const data = await getDashboardData(slug);
  if (!data) notFound();

  return {
    title: `${data.topic.title} — Quick Reference`,
    description: data.topic.subtitle,
  };
}

export default async function DashboardTopicPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const [data, slugs] = await Promise.all([
    getDashboardData(slug),
    getDashboardSlugs(),
  ]);

  if (!data) notFound();

  const topics = await Promise.all(
    slugs.map(async (s) => {
      const d = s === slug ? data : await getDashboardData(s);
      return { slug: s, title: d?.topic.title ?? s };
    }),
  );

  return (
    <DashboardShell
      topics={topics}
      activeSlug={slug}
      title={data.topic.fullTitle}
      subtitle={data.topic.subtitle}
    >
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-end">
          <Link
            href={`/docs/${slug}`}
            className={buttonVariants({ variant: "outline" })}
          >
            Read the full deep dive
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <StatCard stat={data.heroStat} hero />
          </div>
          {data.quickStats.slice(0, 2).map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
        {data.quickStats.length > 2 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.quickStats.slice(2).map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>
        ) : null}

        <ConsensusChart
          title={data.consensusMeter.title}
          description={data.consensusMeter.description}
          items={data.consensusMeter.items}
        />

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">
            {data.whereExpertsDisagree.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {data.whereExpertsDisagree.description}
          </p>
          <DisagreementTable rows={data.whereExpertsDisagree.rows} />
        </div>
      </div>
    </DashboardShell>
  );
}
