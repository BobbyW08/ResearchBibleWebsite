// This is the subdomain already used for every outbound Substack link elsewhere
// in the site (footer, connect section, CLAUDE.md). Reused here as the value —
// but per the handoff doc, Bobby should confirm it's correct before the embed
// iframe (Task 3) ships, since an embed is more consequential than an outbound link.
export const SUBSTACK_SUBDOMAIN = "roughlyeducated";

export const SUBSTACK_URL = `https://${SUBSTACK_SUBDOMAIN}.substack.com/`;
export const SUBSTACK_EMBED_URL = `https://${SUBSTACK_SUBDOMAIN}.substack.com/embed`;
