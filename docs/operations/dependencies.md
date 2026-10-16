# Dependency Inventory

This document explains why each non-obvious dependency exists and what it would take to remove or replace it. Standard UI utilities (clsx, tailwind-merge, class-variance-authority, lucide-react) are omitted - their purpose is self-evident.

---

## Runtime Dependencies

### Framework

| Package | Purpose | Remove if… |
|---|---|---|
| `next` | Next.js 16 App Router - the framework | Never for this project |
| `react`, `react-dom` | React 19 - required by Next.js | Never |
| `payload` | Payload CMS 3.90.2 - content model, admin UI, Local API | Migrating off Payload CMS |
| `@payloadcms/db-postgres` | Payload PostgreSQL adapter | Switching Payload DB |
| `@payloadcms/next` | Payload + Next.js integration (app router, admin routes) | Switching from Next.js |
| `@payloadcms/richtext-lexical` | Lexical rich-text editor + renderer (`<RichText>`) | Switching Payload editor |

### Auth

| Package | Purpose | Remove if… |
|---|---|---|
| `@neondatabase/auth` | Better Auth wrapper for Neon - visitor sign-in/sign-up, Google OAuth | Replacing visitor auth system |
| `@neondatabase/auth-ui` | Pre-built sign-in/sign-up React components | Custom auth UI built |

### Database / Data

| Package | Purpose | Remove if… |
|---|---|---|
| `yaml` | Parse YAML frontmatter in Drive-synced `.md` files | Drive sync pipeline removed |

### Email

| Package | Purpose | Remove if… |
|---|---|---|
| `resend` | Transactional email for moderation report notifications | Switching email provider or removing email notifications. **Not yet configured** - requires `RESEND_API_KEY` and verified sender domain (BLOCKED-ON-BOBBY) |

### Content / Markdown

| Package | Purpose | Remove if… |
|---|---|---|
| `unified`, `remark-parse`, `remark-stringify`, `remark-gfm`, `remark-rehype`, `rehype-parse`, `rehype-remark`, `hast-util-to-jsx-runtime` | Drive-synced `.md` → Payload Lexical AST conversion pipeline | Drive sync pipeline replaced |

### UI / Visualization

| Package | Purpose | Remove if… |
|---|---|---|
| `motion` | Animation library (Framer Motion successor) - hero parallax, page transitions | Removing animations |
| `@tanstack/react-table` | Table primitives - ADHD dashboard component | ADHD data table component removed |
| `recharts` | Chart library - ADHD deep-dive components | ADHD chart components removed |
| `@base-ui/react` | Headless UI primitives (used by shadcn components) | shadcn dependency; auto-managed |
| `shadcn` | shadcn CLI - component generator; not a runtime dep itself | Migrating off shadcn |
| `@vercel/analytics` | Vercel Analytics `<Analytics />` component | Moving to a different analytics provider |

---

## Dev Dependencies

| Package | Purpose |
|---|---|
| `typescript` | TypeScript compiler |
| `@types/node`, `@types/react`, `@types/react-dom` | Type definitions |
| `tailwindcss`, `@tailwindcss/postcss` | Tailwind CSS v4 + PostCSS integration (`tw-animate-css`, a runtime dependency, adds animation utilities) |
| `eslint`, `eslint-config-next` | Linting |
| `dotenv` | Not imported by any live code. Candidate for removal |

`cn` (runtime) is imported by `components/ui/textarea.tsx` and `components/ui/label.tsx`. Other shadcn components use the `cn` helper in `lib/utils`.

---

## Not used

| Package | Reason |
|---|---|
| `framer-motion` | `motion` (the successor) is used instead |
| Supabase, Aceternity UI, Magic UI Pro, Framer | Excluded by project constraints in CLAUDE.md |

---

## Upgrade Policy

- **Version ranges:** `package.json` uses caret ranges for most packages; `package-lock.json` holds the exact installed versions. Commit lockfile changes deliberately.
- **Payload CMS:** upgrade only when a specific bug fix or feature is needed. Payload minor releases can include breaking changes to the admin UI or schema generation, and schema changes need a migration.
- **Next.js:** upgrade deliberately. Next.js 16 App Router APIs are still stabilizing.
- **React 19:** currently on exact `19.2.4` - do not upgrade without checking Payload and shadcn compatibility.
- **Everything else:** `npm audit` monthly; patch security fixes promptly; hold minor/major unless a feature is needed.
