import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import NewsletterDialog from "@/components/marketing/newsletter-dialog";

export type OfferCardData = {
  title: string;
  description: string;
  details: string[];
  availability?: "available" | "comingSoon";
  cta?: {
    label: string;
    note?: string;
  } & (
    | { kind: "link"; href: string; external?: boolean }
    | { kind: "newsletter" }
  );
};

function OfferCard({ title, description, details, availability, cta }: OfferCardData) {
  return (
    <Card className="h-full py-8">
      <CardContent className="flex h-full flex-col gap-4 px-7">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-xl font-medium text-foreground">{title}</h3>
          {availability && (
            <Badge
              variant={availability === "available" ? "default" : "outline"}
              className="h-auto shrink-0 px-2.5 py-1 text-[11px] uppercase tracking-wide"
            >
              {availability === "available" ? "Available now" : "Coming soon"}
            </Badge>
          )}
        </div>
        <p className="text-base font-normal text-muted-foreground">{description}</p>
        <ul className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
          {details.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {cta && (
          <div className="mt-auto flex flex-col gap-1.5 pt-3">
            {cta.kind === "newsletter" ? (
              <NewsletterDialog triggerClassName="inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary transition-all hover:gap-2">
                {cta.label} →
              </NewsletterDialog>
            ) : (
              <Link
                href={cta.href}
                target={cta.external ? "_blank" : undefined}
                rel={cta.external ? "noopener noreferrer" : undefined}
                className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary transition-all hover:gap-2"
              >
                {cta.label} →
              </Link>
            )}
            {cta.note && <p className="text-xs font-normal text-muted-foreground">{cta.note}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default OfferCard;
