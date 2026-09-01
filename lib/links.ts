// This is the subdomain already used for every outbound Substack link elsewhere
// in the site (footer, connect section, CLAUDE.md). Reused here as the value —
// but per the handoff doc, Bobby should confirm it's correct before the embed
// iframe (Task 3) ships, since an embed is more consequential than an outbound link.
export const SUBSTACK_SUBDOMAIN = "roughlyeducated";

export const SUBSTACK_URL = `https://${SUBSTACK_SUBDOMAIN}.substack.com/`;
export const SUBSTACK_EMBED_URL = `https://${SUBSTACK_SUBDOMAIN}.substack.com/embed`;

// Same intro-call event used by every outbound Cal.com link site-wide (header,
// homepage hero, /about-bobby, /services, footer). The teen page's pinned CTA
// panel is the one place this becomes a Cal.com popup embed instead of a plain
// outbound link (per the pain-point-newspaper-layout handoff) — the slug here
// is the `data-cal-link` value that embed needs.
export const CAL_COM_INTRO_CALL_SLUG = "bobby-washburn/intro-call";
export const CAL_COM_INTRO_CALL_URL = `https://cal.com/${CAL_COM_INTRO_CALL_SLUG}`;
