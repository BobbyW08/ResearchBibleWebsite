"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { Check } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOURCE = "teen_weekly_group";

function storageKey() {
  return `bwps-interest-signup:${SOURCE}`;
}

function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return false;
}

type WidgetState = "idle" | "open" | "submitting";

// Reuses InterestSignupWidget's pill → email reveal → submit → persisted
// checkmark pattern (components/marketing/services/interest-signup-widget.tsx).
// No live signup count — static "8 parents needed to start a group" copy
// instead, per Bobby's call. (A live-count version briefly existed here but
// required a per-request DB read from this page, which turned out to be the
// source of an intermittent 404 on this route — removed along with the count.)
function JoinGroupWidget() {
  const alreadySignedUp = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(storageKey()) === "true";
      } catch {
        return false;
      }
    },
    getServerSnapshot,
  );

  const [state, setState] = useState<WidgetState>("idle");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const isValidEmail = EMAIL_RE.test(email);
  const boxOpen = state === "open" || state === "submitting";
  const signedUp = alreadySignedUp || justSubmitted;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isValidEmail || state === "submitting") return;

    setState("submitting");
    setError(null);

    try {
      const response = await fetch("/api/interest-signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: SOURCE }),
      });
      if (!response.ok) throw new Error("Signup failed");

      try {
        window.localStorage.setItem(storageKey(), "true");
      } catch {
        // Non-fatal — the checkmark just won't survive a refresh.
      }
      setJustSubmitted(true);
    } catch {
      setError("Something went wrong. Try again?");
      setState("open");
    }
  };

  return (
    <div className="border border-brand-black/10 bg-white px-5 py-5">
      <p className="text-sm font-bold uppercase tracking-wide text-brand-black">Join the group</p>
      <p className="mt-1 text-xs text-brand-black/60">Tuesdays, 7:30pm EST, flexible.</p>
      <p className="mt-3 text-sm text-brand-black/80">8 parents needed to start a group.</p>

      {signedUp ? (
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-green-700">
          <Check size={16} />
          You&apos;re on the list
        </span>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col items-start gap-1.5">
          {!boxOpen ? (
            <button
              type="button"
              onClick={() => setState("open")}
              className="rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              Join the group
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="email"
                required
                autoFocus
                value={email}
                disabled={state === "submitting"}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter email"
                className="w-44 rounded-full border border-brand-black/15 bg-white px-3 py-2 text-sm text-brand-black outline-none placeholder:text-brand-black/40"
              />
              {isValidEmail && (
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="shrink-0 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85 disabled:opacity-70"
                >
                  {state === "submitting" ? "Submitting…" : "Submit"}
                </button>
              )}
            </div>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </form>
      )}
    </div>
  );
}

export default JoinGroupWidget;
