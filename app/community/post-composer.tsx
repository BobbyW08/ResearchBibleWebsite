"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function PostComposer({ audience }: { audience: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), audience }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError((json as { error?: string }).error ?? "Something went wrong.");
        return;
      }
      setContent("");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4">
      <Textarea
        placeholder="Share something with the group..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={2000}
        rows={3}
        disabled={loading}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">{content.length}/2000</span>
        {error && <span className="text-xs text-destructive">{error}</span>}
        <Button type="submit" size="sm" disabled={loading || !content.trim()}>
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
}
