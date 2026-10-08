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
  likesCount: number;
  createdAt: Date;
  authorId: string;
};

export default function PostCard({
  post,
  viewerId,
}: {
  post: Post;
  viewerId: string;
}) {
  const [likes, setLikes] = useState(post.likesCount);
  const [liked, setLiked] = useState(false);
  const isOwn = post.authorId === viewerId;

  const truncated =
    post.content.length > 200 ? post.content.slice(0, 200) + "..." : post.content;
  const [expanded, setExpanded] = useState(post.content.length <= 200);

  async function toggleLike() {
    if (isOwn) return;
    const next = !liked;
    setLiked(next);
    setLikes((c) => c + (next ? 1 : -1));
    try {
      await fetch("/api/community/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_type: "post", target_id: post.id }),
      });
    } catch {
      setLiked(!next);
      setLikes((c) => c + (next ? -1 : 1));
    }
  }

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
        <button
          onClick={toggleLike}
          disabled={isOwn}
          className={`flex items-center gap-1 transition ${liked ? "text-primary font-semibold" : "hover:text-foreground"} disabled:opacity-40`}
        >
          {liked ? "Liked" : "Like"} {likes > 0 && `(${likes})`}
        </button>
        <Link
          href={`/community/post/${post.id}`}
          className="hover:text-foreground transition"
        >
          Comment
        </Link>
      </div>
    </div>
  );
}
