import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PlaceholderPhotoProps = {
  alt: string;
  className?: string;
};

// Stand-in for a real photo — swap for an <Image> once real imagery exists.
// `alt` describes the photo that will eventually go here, not this box.
function PlaceholderPhoto({ alt, className }: PlaceholderPhotoProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-muted to-accent text-muted-foreground/40",
        className,
      )}
    >
      <ImageIcon className="h-8 w-8" strokeWidth={1.2} />
    </div>
  );
}

export default PlaceholderPhoto;
