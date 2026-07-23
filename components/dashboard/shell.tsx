import type { ReactNode } from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Logo from "@/assets/logo/logo";
import { BookOpen, LayoutDashboard } from "lucide-react";

export type DashboardNavTopic = {
  slug: string;
  title: string;
};

function DashboardSidebar({
  topics,
  activeSlug,
}: {
  topics: DashboardNavTopic[];
  activeSlug: string;
}) {
  return (
    <Sidebar className="py-4 px-0 bg-background">
      <SidebarHeader className="py-0 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" className="block w-full">
              <Logo />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-4 pt-6">
        <p className="px-2 pb-2 text-xs font-medium uppercase text-sidebar-foreground/60">
          Quick-reference topics
        </p>
        <SidebarMenu>
          {topics.map((topic) => (
            <SidebarMenuItem key={topic.slug}>
              <SidebarMenuButton
                isActive={topic.slug === activeSlug}
                render={<Link href={`/dashboard/${topic.slug}`} />}
                className="rounded-lg text-sm px-3 py-2 h-9"
              >
                <LayoutDashboard />
                <span>{topic.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="mt-auto pt-6">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/docs" />}
                className="rounded-lg text-sm px-3 py-2 h-9"
              >
                <BookOpen />
                <span>Research bible</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export function DashboardShell({
  topics,
  activeSlug,
  title,
  subtitle,
  children,
}: {
  topics: DashboardNavTopic[];
  activeSlug: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar topics={topics} activeSlug={activeSlug} />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-border px-6 py-3 bg-background">
          <SidebarTrigger className="-ml-1 h-8 w-8 cursor-pointer" />
          <div>
            <h1 className="text-base font-medium leading-tight">{title}</h1>
            {subtitle ? (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
