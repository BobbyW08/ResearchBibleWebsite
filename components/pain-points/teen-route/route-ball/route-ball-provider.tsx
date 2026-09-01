"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type AnchorRole = "entry" | "active" | "exit";
export type GuidedMotion = "system" | "on" | "reduced";

export type AnchorPoint = { x: number; y: number };

type RouteBallContextValue = {
  registerPanelRoot: (panelId: string, el: HTMLElement | null) => void;
  registerAnchorPoint: (panelId: string, role: AnchorRole, el: HTMLElement | null) => void;
  getAnchorPoint: (panelId: string, role: AnchorRole, namedAnchor: string) => AnchorPoint | null;
  activePanelId: string | null;
  /** Only set while a panel is actually hovered (not scroll-driven) — used by
   * PinnedCtaPanel to know when to fade out of a hovered panel's way. */
  hoveredPanelId: string | null;
  hasBeenVisited: (panelId: string) => boolean;
  markVisited: (panelId: string) => void;
  guidedMotion: GuidedMotion;
  setGuidedMotion: (mode: GuidedMotion) => void;
  requestHoverActive: (panelId: string | null) => void;
  transitionNonce: number;
};

const RouteBallContext = createContext<RouteBallContextValue | null>(null);

// Fallback point on a panel's own bounding box for a named anchor, used
// whenever a panel hasn't registered a more specific inline anchor element
// for that role (e.g. a literal headline/divider/checkbox ref).
function namedPointFromRect(rect: DOMRect, anchorName: string): AnchorPoint {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  switch (anchorName) {
    case "top-left":
      return { x: rect.left + 20, y: rect.top + 20 };
    case "top-right":
      return { x: rect.right - 20, y: rect.top + 20 };
    case "bottom-left":
      return { x: rect.left + 20, y: rect.bottom - 20 };
    case "bottom-right":
      return { x: rect.right - 20, y: rect.bottom - 20 };
    case "center-left":
      return { x: rect.left + 28, y: cy };
    case "headline":
      return { x: rect.left + 28, y: rect.top + 44 };
    case "checkbox":
      return { x: rect.left + 28, y: rect.bottom - 32 };
    case "divider":
    case "center":
    default:
      return { x: cx, y: cy };
  }
}

export function RouteBallProvider({ children }: { children: ReactNode }) {
  const panelRoots = useRef(new Map<string, HTMLElement>());
  const anchorPoints = useRef(new Map<string, HTMLElement>());
  const panelOrder = useRef<string[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visibility = useRef(new Map<string, number>());

  const [scrollActivePanelId, setScrollActivePanelId] = useState<string | null>(null);
  const [hoverPanelId, setHoverPanelId] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [guidedMotion, setGuidedMotion] = useState<GuidedMotion>("system");
  const [transitionNonce, setTransitionNonce] = useState(0);

  const hoverIntentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recomputeActive = useCallback(() => {
    let best: string | null = null;
    let bestRatio = 0;
    for (const id of panelOrder.current) {
      const ratio = visibility.current.get(id) ?? 0;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        best = id;
      }
    }
    if (bestRatio >= 0.4) {
      setScrollActivePanelId((prev) => (prev === best ? prev : best));
    }
  }, []);

  const ensureObserver = useCallback(() => {
    if (observerRef.current || typeof IntersectionObserver === "undefined") return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.routePanelId;
          if (!id) continue;
          visibility.current.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        recomputeActive();
      },
      { threshold: [0, 0.25, 0.4, 0.5, 0.75, 1] },
    );
  }, [recomputeActive]);

  const registerPanelRoot = useCallback(
    (panelId: string, el: HTMLElement | null) => {
      ensureObserver();
      const existing = panelRoots.current.get(panelId);
      if (existing && existing !== el) {
        observerRef.current?.unobserve(existing);
      }
      if (el) {
        el.dataset.routePanelId = panelId;
        panelRoots.current.set(panelId, el);
        if (!panelOrder.current.includes(panelId)) panelOrder.current.push(panelId);
        observerRef.current?.observe(el);
      } else {
        panelRoots.current.delete(panelId);
        visibility.current.delete(panelId);
      }
    },
    [ensureObserver],
  );

  const registerAnchorPoint = useCallback((panelId: string, role: AnchorRole, el: HTMLElement | null) => {
    const key = `${panelId}:${role}`;
    if (el) anchorPoints.current.set(key, el);
    else anchorPoints.current.delete(key);
  }, []);

  const getAnchorPoint = useCallback((panelId: string, role: AnchorRole, namedAnchor: string): AnchorPoint | null => {
    const specific = anchorPoints.current.get(`${panelId}:${role}`);
    if (specific) {
      const rect = specific.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    const root = panelRoots.current.get(panelId);
    if (!root) return null;
    return namedPointFromRect(root.getBoundingClientRect(), namedAnchor);
  }, []);

  const hasBeenVisited = useCallback((panelId: string) => visited.has(panelId), [visited]);

  const markVisited = useCallback((panelId: string) => {
    setVisited((prev) => (prev.has(panelId) ? prev : new Set(prev).add(panelId)));
  }, []);

  // Hover-intent (120–180ms) before a hovered panel becomes active, and an
  // 80–150ms leave-debounce before reverting to whatever scroll position
  // says is active — per claude-code-handoff-v8.md Part B5.
  const requestHoverActive = useCallback((panelId: string | null) => {
    if (hoverIntentTimer.current) clearTimeout(hoverIntentTimer.current);
    if (leaveDebounceTimer.current) clearTimeout(leaveDebounceTimer.current);

    if (panelId) {
      hoverIntentTimer.current = setTimeout(() => {
        setHoverPanelId(panelId);
        setTransitionNonce((n) => n + 1);
      }, 150);
    } else {
      leaveDebounceTimer.current = setTimeout(() => {
        setHoverPanelId(null);
        setTransitionNonce((n) => n + 1);
      }, 110);
    }
  }, []);

  const activePanelId = hoverPanelId ?? scrollActivePanelId;

  const value = useMemo<RouteBallContextValue>(
    () => ({
      registerPanelRoot,
      registerAnchorPoint,
      getAnchorPoint,
      activePanelId,
      hoveredPanelId: hoverPanelId,
      hasBeenVisited,
      markVisited,
      guidedMotion,
      setGuidedMotion,
      requestHoverActive,
      transitionNonce,
    }),
    [
      registerPanelRoot,
      registerAnchorPoint,
      getAnchorPoint,
      activePanelId,
      hoverPanelId,
      hasBeenVisited,
      markVisited,
      guidedMotion,
      requestHoverActive,
      transitionNonce,
    ],
  );

  return <RouteBallContext.Provider value={value}>{children}</RouteBallContext.Provider>;
}

export function useRouteBall() {
  const ctx = useContext(RouteBallContext);
  if (!ctx) throw new Error("useRouteBall must be used within a RouteBallProvider");
  return ctx;
}
