"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface PendingReview {
  id: string;
  topic: string;
  status: "pending_review" | "approved" | "rejected" | "published";
  generatedMdx: string;
  generatedJson: string;
  createdAt: string;
  approvedAt: string | null;
  publishedAt: string | null;
}

const STATUS_LABEL: Record<PendingReview["status"], string> = {
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  published: "Published",
};

const STATUS_COLOR: Record<PendingReview["status"], string> = {
  pending_review: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  approved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  rejected: "text-red-400 bg-red-400/10 border-red-400/30",
  published: "text-sky-400 bg-sky-400/10 border-sky-400/30",
};

function DiffPane({
  label,
  content,
}: {
  label: string;
  content: string;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <p className="text-xs font-medium text-[#B8AE96] uppercase tracking-wide">{label}</p>
      <pre className="flex-1 overflow-auto rounded-lg border border-[#2A3A50] bg-[#0F1B2D] p-4 text-xs text-[#F5F3EC]/80 font-mono leading-relaxed whitespace-pre-wrap break-words max-h-96">
        {content}
      </pre>
    </div>
  );
}

function ReviewCard({ review }: { review: PendingReview }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"mdx" | "json">("mdx");
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const isPending = review.status === "pending_review";

  async function handleAction(action: "approve" | "reject") {
    setLoading(action);
    setResult(null);
    try {
      const res = await fetch(`/api/account/pending-reviews/${review.id}/${action}`, {
        method: "POST",
      });
      const data = (await res.json()) as { success?: boolean; error?: string; publishedAt?: string };
      if (!res.ok || !data.success) {
        setResult({ type: "error", message: data.error ?? "Something went wrong" });
      } else {
        setResult({
          type: "success",
          message:
            action === "approve"
              ? `Published! The ${review.topic} page is now live.`
              : "Review rejected — no changes were published.",
        });
        // Reload after a short delay so the status badge updates
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      setResult({ type: "error", message: err instanceof Error ? err.message : String(err) });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="rounded-xl border border-[#2A3A50] bg-[#16253B] overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="text-sm font-semibold text-[#F5F3EC] capitalize">{review.topic}</span>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded border ${STATUS_COLOR[review.status]}`}
        >
          {STATUS_LABEL[review.status]}
        </span>
        <span className="ml-auto text-xs text-[#B8AE96]">
          {new Date(review.createdAt).toLocaleString()}
        </span>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="ml-2 text-[#B8AE96] hover:text-[#F5F3EC] transition-colors"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded diff view */}
      {expanded && (
        <div className="border-t border-[#2A3A50] px-5 py-4 flex flex-col gap-4">
          {/* Tab toggle */}
          <div className="flex gap-2">
            {(["mdx", "json"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-[#1B3A5C] text-[#F5F3EC]"
                    : "text-[#B8AE96] hover:text-[#F5F3EC]"
                }`}
              >
                {tab === "mdx" ? "Deep-dive MDX" : "Dashboard JSON"}
              </button>
            ))}
          </div>

          {activeTab === "mdx" ? (
            <DiffPane label="Generated MDX (what will be published)" content={review.generatedMdx} />
          ) : (
            <DiffPane
              label="Generated JSON (what will be published)"
              content={JSON.stringify(JSON.parse(review.generatedJson), null, 2)}
            />
          )}

          {/* Action buttons */}
          {isPending && (
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => handleAction("approve")}
                disabled={loading !== null}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                <CheckCircle size={15} />
                {loading === "approve" ? "Publishing…" : "Approve & Publish"}
              </button>
              <button
                onClick={() => handleAction("reject")}
                disabled={loading !== null}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2A3A50] hover:border-red-400/50 hover:text-red-400 disabled:opacity-50 text-[#B8AE96] text-sm font-medium transition-colors"
              >
                <XCircle size={15} />
                {loading === "reject" ? "Rejecting…" : "Reject"}
              </button>
              {result && (
                <p
                  className={`text-sm ${
                    result.type === "success" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {result.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PendingReviewsPage() {
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/account/pending-reviews")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<PendingReview[]>;
      })
      .then(setReviews)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : String(err)),
      )
      .finally(() => setLoading(false));
  }, []);

  const pending = reviews.filter((r) => r.status === "pending_review");
  const past = reviews.filter((r) => r.status !== "pending_review");

  return (
    <main className="container max-w-4xl py-10 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#F5F3EC]">Pending Reviews</h1>
        <p className="text-sm text-[#B8AE96] mt-1">
          Research bible changes staged for your approval before going live.
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-[#B8AE96]">
          <Clock size={16} className="animate-pulse" />
          <span className="text-sm">Loading reviews…</span>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400">
          Failed to load reviews: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-8">
          {/* Pending section */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#B8AE96] mb-3">
              Needs Action ({pending.length})
            </h2>
            {pending.length === 0 ? (
              <p className="text-sm text-[#B8AE96]">No pending reviews — you&apos;re all caught up.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {pending.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            )}
          </section>

          {/* History section */}
          {past.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#B8AE96] mb-3">
                History ({past.length})
              </h2>
              <div className="flex flex-col gap-3">
                {past.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
