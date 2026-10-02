"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; message: string };

export default function OrgInquiryForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: "loading" });

    const form = e.currentTarget;
    const data = {
      orgName: (form.elements.namedItem("orgName") as HTMLInputElement).value.trim(),
      role: (form.elements.namedItem("role") as HTMLInputElement).value.trim(),
      families: (form.elements.namedItem("families") as HTMLTextAreaElement).value.trim(),
      gap: (form.elements.namedItem("gap") as HTMLTextAreaElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
    };

    try {
      const res = await fetch("/api/org-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setState({
          status: "error",
          message: (json as { error?: string }).error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setState({ status: "success" });
    } catch {
      setState({
        status: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <p className="rounded-lg border border-border bg-muted/40 px-6 py-8 text-base font-medium text-foreground">
        Got it. I&apos;ll be in touch within a few business days.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="orgName">Organization name</Label>
        <Input
          id="orgName"
          name="orgName"
          type="text"
          required
          autoComplete="organization"
          disabled={state.status === "loading"}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="role">Your role at the organization</Label>
        <Input
          id="role"
          name="role"
          type="text"
          required
          disabled={state.status === "loading"}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="families">Who are the families you&apos;re thinking of?</Label>
        <Textarea
          id="families"
          name="families"
          rows={4}
          required
          placeholder="Describe the population briefly -- where they are in the system, what's not working, what you're hoping for"
          disabled={state.status === "loading"}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="gap">What gap are you seeing?</Label>
        <Textarea
          id="gap"
          name="gap"
          rows={4}
          required
          disabled={state.status === "loading"}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Your email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={state.status === "loading"}
        />
      </div>

      <p className="text-xs font-medium text-muted-foreground">
        Do not include any family or client information in this form.
      </p>

      {state.status === "error" && (
        <p className="text-sm font-medium text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={state.status === "loading"}>
        {state.status === "loading" ? "Sending..." : "Send inquiry"}
      </Button>
    </form>
  );
}
