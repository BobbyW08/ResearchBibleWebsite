import { cn } from "@/lib/utils";

function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="h-2 w-2 rounded-full bg-secondary" />
      <span className="text-base font-medium tracking-tight text-foreground">
        <span className="md:hidden">Bobby Washburn</span>
        <span className="hidden md:inline">Bobby Washburn Parenting Support</span>
      </span>
    </div>
  );
}

export default Logo;
