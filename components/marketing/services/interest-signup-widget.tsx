"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function storageKey(source: string) {
  return `bwps-interest-signup:${source}`;
}

// No cross-tab/live-update source to subscribe to — we only need a
// consistent, SSR-safe read of localStorage, which useSyncExternalStore
// provides without the hydration-mismatch risk of reading it in an effect.
function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return false;
}

type WidgetState = "idle" | "open" | "submitting";

// Live Q&A "Show Interest" capture — see homepage-redesign-v5.md Section 6.
// Button click slides open an email input; a valid email slides open a
// Submit button beside it; submitting folds both back into the original
// button, which then shows a green checkmark. The "already signed up" state
// persists client-side (localStorage) since there's no account system to
// look it up server-side.
function InterestSignupWidget({ label, source }: { label: string; source: string }) {
  const alreadySignedUp = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(storageKey(source)) === "true";
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isValidEmail || state === "submitting") return;

    setState("submitting");
    setError(null);

    try {
      const response = await fetch("/api/interest-signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!response.ok) throw new Error("Signup failed");

      try {
        window.localStorage.setItem(storageKey(source), "true");
      } catch {
        // Non-fatal — the checkmark just won't survive a refresh.
      }
      setJustSubmitted(true);
    } catch {
      setError("Something went wrong. Try again?");
      setState("open");
    }
  };

  if (alreadySignedUp || justSubmitted) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600">
        <Check size={16} />
        You&apos;re on the list
      </span>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="inline-flex flex-col items-start gap-1.5">
      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={() => state === "idle" && setState("open")}
          disabled={state !== "idle"}
          className="shrink-0 whitespace-nowrap rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary transition-colors enabled:hover:bg-primary/10 disabled:opacity-70"
        >
          {label}
        </button>

        <AnimatePresence initial={false}>
          {boxOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <input
                type="email"
                required
                autoFocus
                value={email}
                disabled={state === "submitting"}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter Email"
                className="w-48 rounded-full border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />

              <AnimatePresence initial={false}>
                {isValidEmail && (
                  <motion.button
                    type="submit"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    disabled={state === "submitting"}
                    className="shrink-0 overflow-hidden whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85 disabled:opacity-70"
                  >
                    {state === "submitting" ? "Submitting…" : "Submit"}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}

export default InterestSignupWidget;
