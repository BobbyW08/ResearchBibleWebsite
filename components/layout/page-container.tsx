import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  /** Use lg:max-w-6xl instead of default lg:max-w-5xl */
  wide?: boolean;
  className?: string;
}

export function PageContainer({ children, wide, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-3xl px-4 sm:px-8",
        wide ? "lg:max-w-6xl" : "lg:max-w-5xl",
        className
      )}
    >
      {children}
    </div>
  );
}
