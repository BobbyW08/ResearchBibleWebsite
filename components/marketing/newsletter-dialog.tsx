"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SUBSTACK_EMBED_URL, SUBSTACK_URL } from "@/lib/links";

type NewsletterDialogProps = {
  triggerClassName?: string;
  children: ReactNode;
};

function NewsletterDialog({ triggerClassName, children }: NewsletterDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className={triggerClassName}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get the research, without the homework.</DialogTitle>
          <DialogDescription>
            New guides, research updates, and practical strategies — straight
            to your inbox. Free. No spam.
          </DialogDescription>
        </DialogHeader>
        <iframe
          src={SUBSTACK_EMBED_URL}
          width="100%"
          height="320"
          style={{ border: "none", background: "transparent" }}
          title="Subscribe to the newsletter"
          loading="lazy"
        />
        <a
          href={SUBSTACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center text-xs text-secondary hover:underline"
        >
          Or read past issues on Substack →
        </a>
      </DialogContent>
    </Dialog>
  );
}

export default NewsletterDialog;
