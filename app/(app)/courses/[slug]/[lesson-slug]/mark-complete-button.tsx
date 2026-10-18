"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  courseSlug: string;
  lessonId: string;
  isCompleted: boolean;
  nextLessonSlug: string | null;
  courseSlugForNext: string;
}

export default function MarkCompleteButton({
  courseSlug,
  lessonId,
  isCompleted: initiallyCompleted,
  nextLessonSlug,
  courseSlugForNext,
}: Props) {
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleMarkComplete() {
    if (completed || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/courses/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, lessonId }),
      });
      if (res.ok) {
        setCompleted(true);
        const data = await res.json();
        if (data.nextLessonSlug) {
          router.push(`/courses/${courseSlugForNext}/${data.nextLessonSlug}`);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  if (completed) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-green-700">Completed</span>
        {nextLessonSlug && (
          <a
            href={`/courses/${courseSlugForNext}/${nextLessonSlug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Next lesson &rarr;
          </a>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleMarkComplete}
      disabled={loading}
      className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/80 transition disabled:opacity-50"
    >
      {loading ? "Saving..." : "Mark complete"}
    </button>
  );
}
