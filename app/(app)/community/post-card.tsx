"use client";

import { useState } from "react";
import Link from "next/link";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

type Post = {
  id: string;
  content: string;
  commentsCount: number;
  createdAt: Date | string;
};

export default function PostCard({ post }: { post: Post }) {
  const truncated =
    post.content.length > 200 ? post.content.slice(0, 200) + "..." : post.content;
  const [expanded, setExpanded] = useState(post.content.length <= 200);

  return (
    <div className="rounded-lg border border-border bg-background p-5 flex flex-col gap-3">
      <p className="text-sm font-normal leading-relaxed text-foreground">
        {expanded ? post.content : truncated}
        {post.content.length > 200 && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="ml-1 text-sm font-medium text-primary hover:underline"
          >
            read more
          </button>
        )}
      </p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>{timeAgo(new Date(post.createdAt))}</span>
        <Link
          href={`/community/post/${post.id}`}
          className="hover:text-foreground transition"
        >
          {post.commentsCount > 0
            ? `${post.commentsCount} comment${post.commentsCount !== 1 ? "s" : ""}`
            : "Comment"}
        </Link>
      </div>
    </div>
  );
}
