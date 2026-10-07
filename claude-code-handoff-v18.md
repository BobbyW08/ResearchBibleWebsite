# Claude Code Handoff v18 — Payload CMS Migration + Community and Courses Platform

This handoff replaces v17 (unexecuted feature work) and the previous v18 (Payload migration only). It merges both into one complete session spec.

Execute in part order. Parts A through I are the Payload migration. Parts J through P are the community and courses platform, which depends on Payload being installed and running. Do not start Part J until the verification checklist in Part I passes.

---

## Auth architecture (read this before writing any auth code)

Two auth systems coexist in this project. They are completely independent.

**Payload admin auth** — Built into Payload. Bobby creates one account at `/admin/create-first-user` on first run. This account only exists in Payload's `users` table. It has no relationship to site visitor accounts.

**Neon Auth (visitor auth)** — `@neondatabase/auth` and `@neondatabase/auth-ui`, already installed and confirmed working. Env vars `NEON_AUTH_BASE_URL` and `NEON_AUTH_COOKIE_SECRET` are already in Vercel. Handles sign-in, sign-up, and Google OAuth for parents and professionals using the site. The Neon Console manages the auth tables inside the existing Neon Postgres instance under the `neon_auth` schema. `@neondatabase/auth-ui` provides pre-built React components for sign-in/sign-up pages. Bobby does not write auth logic for site visitors. Note: older CLAUDE.md sections reference "Better Auth" — this is the same system. Better Auth is the underlying engine Neon Auth is built on; it is now integrated directly into the Neon Console. There is no separate Better Auth installation.

When reading session data in API routes and server components, always use the Neon Auth session helpers. Never trust a user ID from the browser. Read the session on the server.

---

## Standing rules (apply to everything in this handoff)

- Read every file listed below directly from `main` before editing. The project snapshot lags the real repo.
- After all changes: `npm run build`, `npm run lint`, `npx tsc --noEmit`. All three must exit zero before committing.
- No new dependencies beyond what is explicitly approved in this document.
- No em dashes anywhere in copy.
- Payload manages its own database tables. Never rename or drop Payload's auto-generated tables. Never mix Drizzle migrations with Payload's schema.
- `DATABASE_URI` for Payload points to the same Neon Postgres instance already used by Drizzle. Payload tables and existing Drizzle tables coexist without name conflicts.
- All existing API routes stay intact unless explicitly listed as changed.
- Never hardcode Stripe price or product IDs in components. Keep them in config.
- Webhook handlers must be idempotent. The same Stripe event can arrive twice.
- Entitlement checks read the mirrored database state, never a live Stripe API call.
- New Drizzle migrations only. Never edit a migration that has already run.

---

## Approved new dependencies

```
payload
@payloadcms/next
@payloadcms/db-postgres
@payloadcms/richtext-lexical
stripe
@stripe/stripe-js
```

Trophy UI components install via shadcn registry (`npx shadcn@latest add https://ui.trophy.so/r/[component].json`) as source files, not npm packages. Approve those installs individually as they come in the gamification step.

Remove after migration is proven (Part H):
```
@keystatic/core
@keystatic/next
fumadocs-core
fumadocs-mdx
fumadocs-ui
```

---

## What is preserved

- `app/page.tsx` and all homepage components — JSX untouched, only data-fetching calls change
- `app/services/page.tsx`, `app/services/organizations/page.tsx`, and all of `components/marketing/services/`
- `app/common-pain-points/` routes and `components/marketing/pain-point-sidebar-layout.tsx`
- `components/marketing/header.tsx`, `components/marketing/footer.tsx` (data-fetching and nav items change, JSX structure untouched)
- `components/ui/` (all shadcn components)
- `app/globals.css` and all CSS custom properties
- `lib/db/`, `drizzle/` — existing Drizzle schema and migrations, untouched
- `lib/google/drive.ts`, `lib/github/contents.ts`
- `components/mdx/adhd/` — ADHD interactive components
- `app/tech-safety/`, `app/dashboard/`
- `lib/pain-points.ts` — TypeScript types stay; reader functions in `lib/pain-points-reader.ts` change
- `lib/research-bibles/parse.ts`

---

## Part A: Install Payload

### A1. Install packages

```bash
npm install payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical
```

### A2. Add env vars

Add to Vercel (Production, Preview, Development) and to `.env.local`:

```
PAYLOAD_SECRET=<random 32-char string>
DATABASE_URI=<same Neon connection string already used — check .env.local for the var name currently in use and mirror its value here>
```

### A3. Update next.config.ts

Read `next.config.ts` first. Wrap the existing export with `withPayload`:

```ts
import { withPayload } from '@payloadcms/next/withPayload'

// ... existing nextConfig object, untouched ...

export default withPayload(nextConfig)
```

### A4. Create Payload admin routes

**`app/(payload)/admin/[[...segments]]/page.tsx`:**
```tsx
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@payload-config'

export const generateMetadata = ({ params, searchParams }: any) =>
  generatePageMetadata({ config, params, searchParams })

export default function Page({ params, searchParams }: any) {
  return RootPage({ config, params, searchParams })
}
```

**`app/(payload)/admin/[[...segments]]/not-found.tsx`:**
```tsx
import { NotFoundPage } from '@payloadcms/next/views'
import config from '@payload-config'

export default function NotFound() {
  return NotFoundPage({ config })
}
```

**`app/(payload)/api/[...slug]/route.ts`:**
```ts
import { REST_DELETE, REST_GET, REST_PATCH, REST_POST } from '@payloadcms/next/routes'
import config from '@payload-config'

export const GET    = (req: Request) => REST_GET(req, config)
export const POST   = (req: Request) => REST_POST(req, config)
export const DELETE = (req: Request) => REST_DELETE(req, config)
export const PATCH  = (req: Request) => REST_PATCH(req, config)
```

### A5. Create payload.config.ts at repo root

```ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users }            from './src/payload/collections/Users'
import { Media }            from './src/payload/collections/Media'
import { Testimonials }     from './src/payload/collections/Testimonials'
import { PainPoints }       from './src/payload/collections/PainPoints'
import { AwarenessModules } from './src/payload/collections/AwarenessModules'
import { ResearchBibles }   from './src/payload/collections/ResearchBibles'
import { DeepDives }        from './src/payload/collections/DeepDives'
import { Courses }          from './src/payload/collections/Courses'
import { Lessons }          from './src/payload/collections/Lessons'

import { FAQ }          from './src/payload/globals/FAQ'
import { Footer }       from './src/payload/globals/Footer'
import { SiteSettings } from './src/payload/globals/SiteSettings'
import { About }        from './src/payload/globals/About'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Bobby Washburn Admin',
    },
  },
  collections: [
    Users,
    Media,
    Testimonials,
    PainPoints,
    AwarenessModules,
    ResearchBibles,
    DeepDives,
    Courses,
    Lessons,
  ],
  globals: [FAQ, Footer, SiteSettings, About],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: path.resolve(__dirname, 'src/payload/payload-types.ts'),
  },
  graphQL: {
    disable: true,
  },
})
```

---

## Part B: Collections

Create all files under `src/payload/collections/`.

### B1. Users

```ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    description: 'Admin panel users only. Separate from site visitor accounts (Neon Auth).',
  },
  auth: true,
  fields: [
    { name: 'name', type: 'text' },
  ],
}
```

After first run, navigate to `/admin/create-first-user` and create Bobby's admin account. This user exists only in Payload's `users` table. It has no relationship to the Neon Auth visitor accounts.

### B2. Media

```ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'filename' },
  upload: true,
  fields: [
    { name: 'alt', type: 'text', required: true },
  ],
}
```

### B3. Testimonials

```ts
import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'attribution' },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    {
      name: 'attribution',
      type: 'text',
      required: true,
      admin: {
        description: 'Short non-identifying descriptor. Example: "Mom of 12 yr old boy, RI".',
      },
    },
  ],
}
```

### B4. PainPoints

Read `lib/pain-point-icons.ts` before writing this file. Replace `APPROVED_ICONS` with the exact icon name strings from that file's exported map.

```ts
import type { CollectionConfig } from 'payload'

const APPROVED_ICONS = [
  'Flame', 'Smartphone', 'Moon', 'BookOpen', 'Frown',
  'Clock', 'Zap', 'Sun', 'Heart', 'AlertCircle',
]

export const PainPoints: CollectionConfig = {
  slug: 'pain-points',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'tag', 'featured', '_status'],
  },
  versions: { drafts: true },
  fields: [
    {
      name: 'slug', type: 'text', required: true, unique: true,
      admin: { description: 'URL slug. Never change after first publish.' },
    },
    { name: 'tag', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    {
      name: 'icon', type: 'select', required: true,
      options: APPROVED_ICONS.map((name) => ({ label: name, value: name })),
    },
    {
      name: 'featured', type: 'checkbox', defaultValue: false,
      admin: { description: 'Site-owned. Bobby sets manually. Sync webhook never touches this field.' },
    },
    { name: 'intro', type: 'textarea', required: true },
    { name: 'exampleScenario', type: 'textarea' },
    { name: 'whatHappening', type: 'richText' },
    {
      name: 'backfires', type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'tries', type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'details', type: 'textarea', required: true },
      ],
    },
    { name: 'support', type: 'textarea' },
    {
      name: 'deepDive', type: 'group',
      fields: [
        { name: 'href', type: 'text' },
        { name: 'label', type: 'text' },
      ],
    },
    {
      name: 'related', type: 'array',
      fields: [
        { name: 'href', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}
```

### B5. AwarenessModules

```ts
import type { CollectionConfig } from 'payload'

export const AwarenessModules: CollectionConfig = {
  slug: 'awareness-modules',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'tag', '_status'],
    description: 'Current entries: modern, mentalhealth.',
  },
  versions: { drafts: true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'tag', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    {
      name: 'icon', type: 'text',
      admin: { description: 'Lucide icon name string, same approved list as pain points.' },
    },
    { name: 'intro', type: 'textarea' },
    {
      name: 'sections', type: 'array',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'richText' },
      ],
    },
    {
      name: 'deepDive', type: 'group',
      fields: [
        { name: 'href', type: 'text' },
        { name: 'label', type: 'text' },
      ],
    },
    {
      name: 'related', type: 'array',
      fields: [
        { name: 'href', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}
```

### B6. ResearchBibles

Every bible arrives from Drive as Draft. Bobby reviews in `/admin` and publishes. No GitHub PR required.

```ts
import type { CollectionConfig } from 'payload'

export const ResearchBibles: CollectionConfig = {
  slug: 'research-bibles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'version', 'lastUpdated', '_status'],
    description: 'Draft = awaiting Bobby review. Published = live at /research/[slug].',
  },
  versions: { drafts: true },
  fields: [
    {
      name: 'slug', type: 'text', required: true, unique: true,
      admin: { description: 'Set by sync webhook on first ingest. Never edit manually after that.' },
    },
    { name: 'title', type: 'text', required: true },
    {
      name: 'version', type: 'text', required: true, defaultValue: '1.0',
      admin: { description: 'Managed by sync webhook. Do not edit manually.', readOnly: true },
    },
    { name: 'lastUpdated', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    {
      name: 'tags', type: 'array',
      admin: { description: 'Site-owned. Bobby assigns manually. Sync webhook never touches this.' },
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
    { name: 'noindex', type: 'checkbox', defaultValue: false },
    {
      name: 'changelog', type: 'array',
      admin: { description: 'Prepended by sync webhook. Do not manually reorder existing entries.' },
      fields: [
        { name: 'date', type: 'date', required: true },
        { name: 'summary', type: 'text', required: true },
        {
          name: 'prUrl', type: 'text',
          admin: { description: 'No longer populated. Kept for records migrated from the old GitHub PR flow.' },
        },
      ],
    },
    { name: 'body', type: 'richText', required: true },
  ],
}
```

### B7. DeepDives

Replaces Fumadocs `/docs/[topic]` pages. All 36 topics migrate here.

```ts
import type { CollectionConfig } from 'payload'

export const DeepDives: CollectionConfig = {
  slug: 'deep-dives',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pillar', '_status'],
    description: '36 parent-facing topic pages at /docs/[slug].',
  },
  versions: { drafts: true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'title', type: 'text', required: true },
    {
      name: 'pillar', type: 'select', required: true,
      options: [
        { label: 'Stabilize', value: 'stabilize' },
        { label: 'Connect', value: 'connect' },
        { label: 'Structure', value: 'structure' },
        { label: 'Adapt', value: 'adapt' },
      ],
    },
    {
      name: 'description', type: 'textarea',
      admin: { description: 'Used for the topic card on /docs and SEO meta description.' },
    },
    { name: 'body', type: 'richText', required: true },
    { name: 'noindex', type: 'checkbox', defaultValue: false },
  ],
}
```

### B8. Courses

Course catalog. Bobby manages course titles, descriptions, and access settings here. Lesson content is in the Lessons collection. User enrollment and progress are tracked in Drizzle tables.

```ts
import type { CollectionConfig } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'audience', 'productKey', '_status'],
    description: 'Course catalog. Lesson content is in the Lessons collection.',
  },
  versions: { drafts: true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'audience', type: 'select', required: true, defaultValue: 'all',
      options: [
        { label: 'Parents', value: 'parent' },
        { label: 'Professionals', value: 'professional' },
        { label: 'Both', value: 'all' },
      ],
    },
    {
      name: 'productKey', type: 'text',
      admin: {
        description: 'Stripe product key from lib/stripe-products.ts. Leave blank for a free course. Paid courses require an entitlement row matching this key.',
      },
    },
    {
      name: 'sortOrder', type: 'number', defaultValue: 0,
      admin: { description: 'Controls display order on the course listing page.' },
    },
  ],
}
```

### B9. Lessons

Lesson content lives here. Gate settings (free, paid, level-locked) are fields on this record. User progress is tracked in the Drizzle `course_progress` table by lesson slug.

```ts
import type { CollectionConfig } from 'payload'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'course', 'gateType', 'sortOrder', '_status'],
    description: 'Lesson content and gate settings. Progress tracked separately in Drizzle.',
  },
  versions: { drafts: true },
  fields: [
    { name: 'slug', type: 'text', required: true },
    {
      name: 'course', type: 'relationship', relationTo: 'courses', required: true,
      admin: { description: 'The course this lesson belongs to.' },
    },
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'gateType', type: 'select', required: true, defaultValue: 'free',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Paid (requires entitlement)', value: 'paid' },
        { label: 'Level-locked', value: 'level' },
      ],
      admin: {
        description: 'All new lessons default to free. Change to paid or level only when content is ready to gate.',
      },
    },
    {
      name: 'gateMinLevel', type: 'number',
      admin: {
        description: 'Only used when gateType is "level". Minimum profile level required to access this lesson.',
        condition: (data) => data.gateType === 'level',
      },
    },
    {
      name: 'sortOrder', type: 'number', defaultValue: 0,
      admin: { description: 'Controls display order within the course.' },
    },
  ],
}
```

Enforce unique `(course, slug)` at the Payload query level in the lesson page route — Payload does not support composite unique constraints natively. The lesson page fetches by course slug and lesson slug together and returns 404 if nothing is found.

---

## Part C: Globals

Create all files under `src/payload/globals/`.

### C1. FAQ

```ts
import type { GlobalConfig } from 'payload'

export const FAQ: GlobalConfig = {
  slug: 'faq',
  admin: { description: 'FAQ section on the homepage. Drag rows to reorder.' },
  fields: [
    {
      name: 'items', type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}
```

### C2. Footer

```ts
import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  fields: [
    { name: 'tagline', type: 'text' },
    { name: 'contactEmail', type: 'email' },
    {
      name: 'copyrightText', type: 'textarea',
      admin: { description: 'Includes CPRS certification, nonclinical disclaimer, and any other footer legal copy.' },
    },
  ],
}
```

### C3. SiteSettings

```ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    description: 'Subdomain and booking URL constants. Wiring these to lib/links.ts is a separate task.',
  },
  fields: [
    {
      name: 'substackSubdomain', type: 'text',
      admin: { description: 'Substack subdomain only, no https://. Example: roughlyeducated' },
    },
    {
      name: 'calComUrl', type: 'text',
      admin: { description: 'Full Cal.com booking URL. Example: https://cal.com/bobby-washburn/intro-call' },
    },
  ],
}
```

### C4. About

```ts
import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  admin: { description: 'Content for the /about-bobby page.' },
  fields: [
    { name: 'heroSubhead', type: 'text' },
    {
      name: 'credentialBadge', type: 'text',
      admin: { description: 'Example: "CPRS · RI Board Certified"' },
    },
    {
      name: 'photo', type: 'upload', relationTo: 'media',
      admin: { description: 'Bobby headshot. Shows placeholder until uploaded.' },
    },
    {
      name: 'shortAboutParagraphs', type: 'array',
      fields: [{ name: 'paragraph', type: 'textarea', required: true }],
    },
    { name: 'cprsId', type: 'text' },
    { name: 'currentRole', type: 'text' },
    { name: 'training', type: 'text' },
    { name: 'prior', type: 'text' },
    { name: 'also', type: 'text' },
  ],
}
```

---

## Part D: First run — verify Payload schema

1. Run `npm run dev`
2. Navigate to `http://localhost:3000/admin`
3. Create first admin user at `/admin/create-first-user`
4. Confirm all 9 collections appear: Users, Media, Testimonials, Pain Points, Awareness Modules, Research Bibles, Deep Dives, Courses, Lessons
5. Confirm all 4 globals appear: FAQ, Footer, Site Settings, About
6. Open Neon console and confirm Payload created its own tables alongside the existing Drizzle tables. There should be no name conflicts.

If `npm run dev` fails: check `DATABASE_URI` and `PAYLOAD_SECRET` are set in `.env.local`, and that `payload.config.ts` is at the repo root.

---

## Part E: Migrate existing content

Write a one-time migration script at `scripts/migrate-to-payload.ts`. Run with `npx tsx scripts/migrate-to-payload.ts` against local dev first.

The script does the following in order:

**1. Testimonials** — read all `content/testimonials/*.yaml`, POST each to `/api/testimonials` with `_status: 'published'`.

**2. FAQ** — read `content/faq/data.yaml`, PATCH the `faq` global at `/api/globals/faq`.

**3. Footer** — read `content/footer/data.yaml`, PATCH the `footer` global.

**4. Site Settings** — read `content/site-settings/data.yaml`, PATCH the `site-settings` global.

**5. About** — read `content/about/data.yaml`, PATCH the `about` global. Photo field left empty.

**6. Pain Points** — read all `content/pain-points/*.yaml`. Keep `featured` as-is from YAML. POST each with `_status: 'published'`.

**7. Awareness Modules** — read all `content/awareness-modules/*.yaml`. POST each with `_status: 'published'`.

**8. Deep Dives (35 topics, not ADHD)** — read all `content/docs/*.mdx` except `adhd.mdx`. Extract title from first H1. Convert body to Lexical via `markdownToLexical`. Derive `pillar` from the 36-topic table in CLAUDE.md. POST each with `_status: 'published'`.

**9. ADHD special case** — `content/docs/adhd.mdx` contains 8 custom components (`<DualPathwayDiagram />`, etc.). Insert a `[COMPONENT: ComponentName]` marker block wherever a component tag appears. Mark the record `_status: 'published'` after Part F's ADHD renderer is confirmed working.

**10. Courses** — no existing course records to migrate. Leave the Courses collection empty. Bobby creates course records through `/admin` when ready.

**11. Lessons** — same as courses. Lesson content exists only in Keystatic MDX files that have not been published to site visitors yet. Bobby creates lesson records through `/admin` after this migration completes.

The migration script uses Payload's REST API with an API key generated in `/admin/settings/api-keys`. Read it from env var `PAYLOAD_MIGRATION_API_KEY` — never hardcode it.

---

## Part F: Replace data sources

No JSX changes in any page or component file. Only data-fetching logic changes.

### F1. Payload client helper

Create `lib/payload-client.ts`:

```ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'

let cached: Awaited<ReturnType<typeof getPayload>> | null = null

export async function getPayloadClient() {
  if (cached) return cached
  cached = await getPayload({ config: configPromise })
  return cached
}
```

### F2. Update reader functions

Rewrite to use `getPayloadClient()`. Keep function signatures identical so call sites in page/component files do not change.

| File | Functions |
|---|---|
| `lib/pain-points-reader.ts` | `getAllPainPoints()`, `getHelpEntry(slug)`, `getFeaturedPainPoints()` |
| `lib/research-bibles-reader.ts` | `getAllResearchBibles()`, `getResearchBible(slug)` |

`getHelpEntry(slug)`: query `pain-points` first, then `awareness-modules` if not found.

Create `lib/payload-globals.ts`:

```ts
import { getPayloadClient } from './payload-client'

export async function getFaq() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'faq' })
}

export async function getFooter() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'footer' })
}

export async function getSiteSettings() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings' })
}

export async function getAbout() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'about' })
}
```

Create `lib/payload-courses.ts`:

```ts
import { getPayloadClient } from './payload-client'

export async function getCourse(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'courses',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getAllCourses() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'courses',
    where: { _status: { equals: 'published' } },
    sort: 'sortOrder',
    limit: 100,
  })
  return docs
}

export async function getLesson(courseSlug: string, lessonSlug: string) {
  const payload = await getPayloadClient()
  const course = await getCourse(courseSlug)
  if (!course) return null
  const { docs } = await payload.find({
    collection: 'lessons',
    where: {
      and: [
        { course: { equals: course.id } },
        { slug: { equals: lessonSlug } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getLessonsForCourse(courseId: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'lessons',
    where: {
      and: [
        { course: { equals: courseId } },
        { _status: { equals: 'published' } },
      ],
    },
    sort: 'sortOrder',
    limit: 200,
  })
  return docs
}
```

### F3. Testimonials

Find the current fetch in `proof-wall-hero.tsx` (or its parent server component) and replace the Keystatic read with:

```ts
const payload = await getPayloadClient()
const { docs: testimonials } = await payload.find({ collection: 'testimonials' })
```

### F4. /docs routes

**`app/docs/page.tsx`** — fetch all `deep-dives` records grouped by `pillar`, render a four-pillar topic grid using existing shadcn components. No Fumadocs imports.

**`app/docs/[slug]/page.tsx`** — fetch one `deep-dives` record by slug. Render `body` using `@payloadcms/richtext-lexical/react`'s `RichText` component. Replace the Fumadocs sidebar with a simple sticky left sidebar built from shadcn `ScrollArea`.

**ADHD route** — `app/docs/adhd/page.tsx` gets a dedicated renderer that intercepts `[COMPONENT: X]` marker blocks and swaps them for the real React components from `components/mdx/adhd/index.ts`.

**`generateStaticParams`:**
```ts
export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'deep-dives', limit: 100 })
  return docs.map((d) => ({ slug: d.slug }))
}
```

---

## Part G: Update the Drive sync webhook

Read `app/api/webhooks/drive-content-sync/route.ts` fully before editing.

Keep: Drive fetch, `lib/research-bibles/parse.ts` calls, sha256 dedup, rate limiter, `X-Webhook-Secret` auth.

Remove: all `lib/github/contents.ts` imports, `GITHUB_CONTENT_SYNC_TOKEN` usage, the branch/PR/commit sequence.

New ending (replaces the GitHub block):

```ts
const payload = await getPayloadClient()

const existing = await payload.find({
  collection: 'research-bibles',
  where: { slug: { equals: slug } },
  limit: 1,
})

const changelogEntry = { date: lastUpdatedDate, summary, prUrl: '' }

if (existing.docs.length > 0) {
  const doc = existing.docs[0]
  const newChangelog = [changelogEntry, ...(doc.changelog ?? [])]
  await payload.update({
    collection: 'research-bibles',
    id: doc.id,
    data: {
      body: lexicalBody,
      changelog: newChangelog,
      version: `${newChangelog.length}.0`,
      lastUpdated: lastUpdatedDate,
      _status: 'draft',
    },
  })
} else {
  await payload.create({
    collection: 'research-bibles',
    data: {
      slug, title, body: lexicalBody,
      changelog: [changelogEntry],
      version: '1.0', lastUpdated: lastUpdatedDate,
      tags: [], noindex: false,
      _status: 'draft',
    },
  })
}

return NextResponse.json({ ok: true, slug, status: 'draft' }, { status: 200 })
```

`lexicalBody` comes from `markdownToLexical` applied to `extractBody(rawContent)`.

`lib/github/contents.ts` stays in the repo — still used by `app/api/webhooks/parent-content-sync/route.ts`. Keep `GITHUB_CONTENT_SYNC_TOKEN` in Vercel for the same reason.

---

## Part H: Remove Keystatic and Fumadocs

Do not start this part until every item on the Part I checklist passes.

1. Delete `keystatic.config.ts`
2. Delete `app/keystatic/` and `app/api/keystatic/`
3. Delete `lib/keystatic-reader.ts`
4. Delete content dirs now managed by Payload: `content/testimonials/`, `content/pain-points/`, `content/awareness-modules/`, `content/research-bibles/`, `content/faq/`, `content/footer/`, `content/site-settings/`, `content/about/`
5. Keep `content/docs/*.mdx` and `content/data/*.json` as reference/backup until deep dives are confirmed rendering correctly in production
6. `npm uninstall @keystatic/core @keystatic/next`
7. `npm uninstall fumadocs-core fumadocs-mdx fumadocs-ui` plus any other `fumadocs-*` in `package.json`
8. Delete `source.config.ts` if it exists
9. Update `mdx-components.tsx` — remove all registrations except ADHD-specific components
10. `npm run build`, `npm run lint`, `npx tsc --noEmit` — all must pass clean

---

## Part I: Payload verification checklist

Run in this order. Do not start Part J until every item passes.

1. `npm run build` — clean
2. `npm run lint` — clean
3. `npx tsc --noEmit` — clean
4. `/admin` loads in dev — all 9 collections and 4 globals visible
5. Create first Payload user — login works, session persists
6. Migration script runs to completion against dev database without errors
7. All 10 pain points appear in `/admin/collections/pain-points` as Published
8. Both awareness modules appear as Published
9. All testimonials appear in `/admin/collections/testimonials`
10. FAQ, Footer, Site Settings, About appear under Globals with correct content
11. All 36 deep dives appear in `/admin/collections/deep-dives` as Published
12. `/common-pain-points` index renders — all 10 pain point cards load from Payload
13. `/common-pain-points/meltdowns` renders correctly
14. `/common-pain-points/modern` renders correctly (awareness module, no age-tabs)
15. `/docs` renders — 36 topics grouped under 4 pillar headings
16. `/docs/understanding-behavior` renders — prose content from Payload
17. `/docs/adhd` renders — all 8 interactive components present, no marker placeholders visible
18. `/about-bobby` renders — content from Payload About global
19. Homepage Proof Wall — testimonials load from Payload
20. Homepage Start Here — pain point list loads from Payload
21. Homepage FAQ — questions load from Payload FAQ global
22. Fire a test Drive webhook — bible record appears in `/admin` as Draft
23. Review and Publish that draft — bible goes live at `/research/[slug]`
24. `/research/[slug]` renders — title, changelog, body all present
25. `/admin` returns 404 for unauthenticated requests
26. Run migration script against Vercel production (after all dev checks pass)
27. `npm run build` one final time after Part H — clean with Keystatic and Fumadocs removed

---

## Part J: Database schema — community and courses platform

Create a single new Drizzle migration file containing all new tables. These are additive only. No existing tables are touched.

Use `uuid_generate_v4()` or Drizzle's `uuid()` default for UUID primary keys. Follow the same conventions as existing schema files.

Note: The `courses` and `lessons` tables from the original v17 plan do NOT go here. Course and lesson records are Payload collections. User progress and entitlements are Drizzle tables.

### Table: `profiles` (expand the existing table)

The existing `profiles` table has `user_id`, `account_type`, age, gender. This migration adds the community platform columns. Use `ALTER TABLE` if the table already exists, or include all columns if the migration runs before the table is created.

New columns to add:
```
user_role      text NOT NULL CHECK (user_role IN ('parent', 'professional'))
display_name   text NOT NULL DEFAULT ''
avatar_url     text
bio            text DEFAULT ''
level          integer NOT NULL DEFAULT 1
total_points   integer NOT NULL DEFAULT 0
updated_at     timestamptz NOT NULL DEFAULT now()
```

`user_id` references the Neon Auth user ID (a string, not a UUID). This is consistent with how the existing `profiles` table works.

### Table: `course_progress`

```
user_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
lesson_slug  text NOT NULL
completed_at timestamptz NOT NULL DEFAULT now()
PRIMARY KEY (user_id, lesson_slug)
```

`lesson_slug` is the lesson's slug string from the Payload Lessons collection. Not a foreign key to a Drizzle table, since lesson records live in Payload. The combination of `courseSlug + lessonSlug` uniquely identifies a lesson; since slugs within a course are unique by convention, `lesson_slug` alone is sufficient here. If the same lesson slug appears in two different courses (unlikely but possible), add a `course_slug text NOT NULL` column and use a composite primary key of `(user_id, course_slug, lesson_slug)`.

### Table: `posts`

```
id           uuid PK DEFAULT uuid_generate_v4()
author_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
audience     text NOT NULL CHECK (audience IN ('parent', 'professional'))
content      text NOT NULL
likes_count  integer NOT NULL DEFAULT 0
is_pinned    boolean NOT NULL DEFAULT false
created_at   timestamptz NOT NULL DEFAULT now()
updated_at   timestamptz NOT NULL DEFAULT now()
```

### Table: `comments`

```
id           uuid PK DEFAULT uuid_generate_v4()
post_id      uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE
author_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
content      text NOT NULL
likes_count  integer NOT NULL DEFAULT 0
created_at   timestamptz NOT NULL DEFAULT now()
updated_at   timestamptz NOT NULL DEFAULT now()
```

### Table: `likes`

```
user_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
target_type  text NOT NULL CHECK (target_type IN ('post', 'comment'))
target_id    uuid NOT NULL
created_at   timestamptz NOT NULL DEFAULT now()
PRIMARY KEY (user_id, target_type, target_id)
```

### Table: `points_ledger`

```
id           uuid PK DEFAULT uuid_generate_v4()
user_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
action       text NOT NULL  -- 'post_liked' | 'comment_liked' | 'lesson_completed' | 'admin_grant'
points_delta integer NOT NULL
ref_type     text  -- 'post' | 'comment' | 'lesson' | null
ref_id       uuid
created_at   timestamptz NOT NULL DEFAULT now()
```

### Table: `entitlements`

```
id           uuid PK DEFAULT uuid_generate_v4()
user_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
product_id   text NOT NULL  -- matches key in STRIPE_PRODUCTS config
source       text NOT NULL CHECK (source IN ('stripe', 'admin'))
created_at   timestamptz NOT NULL DEFAULT now()
expires_at   timestamptz  -- null = never expires
UNIQUE (user_id, product_id)
```

### Table: `stripe_customers`

```
user_id             uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE
stripe_customer_id  text NOT NULL UNIQUE
created_at          timestamptz NOT NULL DEFAULT now()
```

### Table: `stripe_subscriptions`

```
id                   text PK  -- Stripe subscription ID
user_id              uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
stripe_customer_id   text NOT NULL
status               text NOT NULL
product_id           text NOT NULL
current_period_end   timestamptz
updated_at           timestamptz NOT NULL DEFAULT now()
```

---

## Part K: Stripe config and integration

### K1. Install Stripe

```bash
npm install stripe @stripe/stripe-js
```

### K2. Add Stripe env vars to Vercel

Bobby adds these manually in the Vercel project dashboard (test mode first):
```
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_PRO_MEMBERSHIP
STRIPE_PRICE_COURSE_BEHAVIOR_FOUNDATIONS
```

The webhook endpoint is `https://bobby-washburn.com/api/stripe/webhook`.

### K3. Stripe client helper

Create `lib/stripe.ts`:

```ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})
```

### K4. Stripe product config

Create `lib/stripe-products.ts`:

```ts
// Keys here must match the product_id values used in the entitlements table.
// Add a new entry for every new Stripe product.
export const STRIPE_PRODUCTS: Record<string, string> = {
  pro_membership: process.env.STRIPE_PRICE_PRO_MEMBERSHIP ?? '',
  course_behavior_foundations: process.env.STRIPE_PRICE_COURSE_BEHAVIOR_FOUNDATIONS ?? '',
}

export type ProductKey = keyof typeof STRIPE_PRODUCTS
```

### K5. Entitlements helper

Create `lib/entitlements.ts`:

```ts
import { db } from '@/lib/db'
import { entitlements } from '@/lib/db/schema'
import { and, eq, or, isNull, gt } from 'drizzle-orm'

export async function userHasEntitlement(
  userId: string,
  productId: string
): Promise<boolean> {
  const rows = await db
    .select()
    .from(entitlements)
    .where(
      and(
        eq(entitlements.user_id, userId),
        eq(entitlements.product_id, productId),
        or(isNull(entitlements.expires_at), gt(entitlements.expires_at, new Date()))
      )
    )
    .limit(1)
  return rows.length > 0
}
```

### K6. Checkout API route

Create `app/api/stripe/checkout/route.ts`.

POST. Body: `{ productKey: string }`.

1. Get Neon Auth session. If no session, return 401.
2. Look up or create a `stripe_customers` row for this user.
3. Create a Stripe Checkout Session. `mode: 'payment'` for one-time, `mode: 'subscription'` for membership.
4. `success_url: /account?checkout=success`, `cancel_url: /courses`.
5. Return `{ url: session.url }`.

### K7. Stripe webhook handler

Create `app/api/stripe/webhook/route.ts`.

Disable Next.js body parsing to receive the raw body for signature verification.

Events to handle:

**`checkout.session.completed`:** Retrieve full session with expanded `line_items`. Identify product key from price ID (reverse lookup in `STRIPE_PRODUCTS`). Upsert an `entitlements` row. If subscription, also upsert `stripe_subscriptions`.

**`customer.subscription.updated` and `customer.subscription.deleted`:** Update the matching `stripe_subscriptions` row. If status is `canceled` or `unpaid`, remove the `entitlements` row.

Verify Stripe webhook signature using `STRIPE_WEBHOOK_SECRET` before processing. Return 400 on signature failure, 200 on success or ignored events. All handlers must be idempotent.

---

## Part L: Auth pages and middleware

### L1. Sign-in page

Create `app/sign-in/page.tsx`. Add `export const dynamic = 'force-dynamic'`.

Use `@neondatabase/auth-ui` components for the sign-in form. Redirect to `/account` on success. If user already has a session, redirect to `/community`.

### L2. Welcome page (role selection)

See Part R for the fix to the existing `/welcome` page. Part L2 describes what the welcome page should do. Part R describes how to repair the broken implementation.

Create (or rewrite) `app/welcome/page.tsx`. Add `export const dynamic = 'force-dynamic'`.

After new user completes Neon Auth sign-up (email or Google), they land here. Show two large buttons:

- "A Parent" — "Looking for peer support, parenting resources, and community."
- "A Professional" — "A clinician, researcher, case manager, or practitioner."

On selection, POST to `/api/auth/set-role`.

Create `app/api/auth/set-role/route.ts`:
1. Get Neon Auth session user ID (from the server, not the browser)
2. Upsert a row in `profiles` with `user_role`, `display_name` from auth user's name/email
3. Redirect to `/community`

A returning user who already has a `profiles` row skips `/welcome` and goes to `/community` directly.

### L3. Middleware

Create (or update) `middleware.ts`. Protect `/community/*`, `/courses/*`, `/account`. Any request from a user without a valid Neon Auth session redirects to `/sign-in?returnTo=[current path]`. After sign-in, redirect back to the original destination.

### L4. Header auth state

In `components/marketing/header.tsx`, extract a `HeaderAuthButton` client component that handles auth-aware display. Keep the header wrapper a server component.

Not signed in: "Sign in" link to `/sign-in`.
Signed in: small avatar or first initial, "Account" link to `/account`, "Sign out" option in a dropdown.

---

## Part M: Community feed

### M1. Routes

- `app/community/page.tsx` — main feed
- `app/community/post/[id]/page.tsx` — single post with comments

Both protected by middleware (Part L3).

### M2. Community feed page

Server component. Reads current user profile (Neon Auth session → `profiles` row). Fetches posts where `audience = user_role OR audience = 'all'`, ordered by `created_at DESC`, limit 30.

Layout: two-column desktop (feed left, sidebar right). Single column mobile.

Feed left:
- Post composer at top (textarea, max 2000 chars, Submit button)
- Post list below

Each post card: author display name, level badge, post content (truncated at 200 chars), relative timestamp, like button with count, comment count linking to `/community/post/[id]`.

Sidebar right:
- Leaderboard (top 10 by `total_points`, same audience)
- User's own level and points summary

### M3. Level thresholds

Create `lib/level-thresholds.ts`:

```ts
export const LEVEL_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 50,
  3: 150,
  4: 400,
  5: 900,
  6: 1800,
  7: 3200,
}

export function levelFromPoints(points: number): number {
  let level = 1
  for (const [lvl, threshold] of Object.entries(LEVEL_THRESHOLDS)) {
    if (points >= threshold) level = Number(lvl)
  }
  return level
}
```

### M4. Community API routes

**`app/api/community/posts/route.ts`** — POST. Validates content (not empty, max 2000 chars). Inserts into `posts` with `audience` from user's profile. Returns new post.

**`app/api/community/comments/route.ts`** — POST. Same pattern for comments.

**`app/api/community/likes/route.ts`** — POST. Body: `{ target_type, target_id }`.

Logic (must be idempotent):
1. Check `likes` table for `(user_id, target_type, target_id)`.
2. If exists: delete it, decrement `likes_count` on target. This is an unlike.
3. If not exists: insert it, increment `likes_count`. Insert a `points_ledger` row for the target's author. Increment `profiles.total_points` for that author. Recalculate and update `profiles.level` using `levelFromPoints`.

A user cannot like their own post or comment. Returns `{ liked: boolean, new_count: number }`.

### M5. Single post page

`app/community/post/[id]/page.tsx` — full post content, all comments chronologically, comment composer at bottom.

### M6. Gamification (Trophy UI)

Install Trophy UI components via shadcn registry as they are needed:

**Leaderboard** (`npx shadcn@latest add https://ui.trophy.so/r/leaderboard.json`): Use on community feed sidebar. Top 10 by `total_points` where role matches viewer's role.

**Points display** and **Level badge**: Show on post/comment author headers and on the `/account` page.

Install only what is actually used. Approve each install individually.

---

## Part N: Courses routes

All three routes are server components that check for a valid Neon Auth session before rendering.

### N1. Course listing (`/courses`)

`app/courses/page.tsx` — fetch all published Courses from Payload where `audience = user_role OR audience = 'all'`. Display a card grid. Each card: title, description, lesson count.

```ts
const courses = await getAllCourses()
// filter by audience matching user_role or 'all'
```

### N2. Course overview (`/courses/[slug]`)

`app/courses/[slug]/page.tsx` — fetch course from Payload. Fetch all published lessons for that course from Payload (sorted by `sortOrder`). Query `course_progress` for this user to show completion state.

Show: course title, description, lesson list. Each lesson item: title, gate icon (free/paid/level-locked), completion checkmark if a `course_progress` row exists for this user and lesson slug.

### N3. Lesson page (`/courses/[slug]/[lesson-slug]`)

`app/courses/[slug]/[lesson-slug]/page.tsx`

Gate check logic (on the server):

```
1. Get Neon Auth session user and profile (level, entitlements)
2. Fetch lesson from Payload via getLesson(courseSlug, lessonSlug)
3. If not found: 404
4. If lesson.gateType === 'free': render the lesson
5. If lesson.gateType === 'paid':
   - Get the course's productKey
   - Query entitlements for (user_id, productKey)
   - If entitlement exists: render the lesson
   - If not: render upgrade prompt with Stripe checkout link
6. If lesson.gateType === 'level':
   - If profile.level >= lesson.gateMinLevel: render the lesson
   - If not: render "Unlock at Level X" message with points explanation
```

On first completion (no `course_progress` row exists for this user and lesson slug):
- Insert `course_progress` row
- Insert `points_ledger` row (`action = 'lesson_completed'`, `points_delta = 5`)
- Update `profiles.total_points += 5`
- Recalculate and update `profiles.level` using `levelFromPoints`

Render `lesson.body` using `@payloadcms/richtext-lexical/react`'s `RichText` component. No MDX files, no Keystatic.

---

## Part O: Account page

Create `app/account/page.tsx`. Server component. Add `export const dynamic = 'force-dynamic'`.

Read Neon Auth session. Redirect to `/sign-in` if no session.

Sections:
- Profile header: avatar (or initial), display_name, user_role badge, level badge, total points
- Edit profile form: display_name, bio. PATCH to `/app/api/account/profile`
- Course progress: list of courses the user has started, with completion percentage
- Sign out button: calls Neon Auth sign-out, redirects to `/`

Create `app/api/account/profile/route.ts` — PATCH. Validates display_name (not empty, max 80 chars) and bio (max 500 chars). Updates `profiles` row. Returns updated profile.

---

## Part P: Organizations page rebuild

No new dependencies. All of this is static content and a form.

### P1. Rewrite `app/services/organizations/page.tsx`

Remove: the current `ORG_CONTACT_HREF` mailto link, all prices from offer cards, the current OFFERS array and OfferCard rendering, the old "Let's Talk" section.

Six sections: hero, four offer cards, how a pilot works, what I do vs what you keep, how this gets funded, inquiry form CTA.

**Four offer cards (DRAFT COPY — Bobby to review and finalize before merging):**

Card 1: "Staff Training and Consultation" — Live training in peer-delivered family support: the frameworks, the skill set, and how to apply them inside your team's existing role. Peer-informed consultation on engaging families who are hard to reach through traditional services is included here, not billed separately. One-day or short-series format. Scope and schedule set together upfront.

Card 2: "Nonclinical Family Support Program" — For families a partner refers who are not a fit for clinical services, or who need practical support alongside them. A structured 90-day pathway: referral, engagement, a closed cohort or workshop, a warm handoff when appropriate, a summary report, and a continue/adapt/stop decision. Building with partners, one pilot at a time. This is not a billable clinical or peer service.

Card 3: "Parent Education Workshops" — Narrow, topic-specific sessions delivered to your population. A lower-stakes first engagement with a clear deliverable. Scope and schedule set upfront, priced per engagement.

Card 4: "Reintegration Planning" — A structured, time-limited plan for families at the point of reintegration: post-reunification, post-incarceration, or post-program completion. Support intensity steps down over time as the family stabilizes. Fixed scope, fixed timeline, single cap. Multi-family pricing available for organizations placing several families a year.

**How a pilot works section** — numbered sequence, six steps:
1. Referral — Partner identifies families who need support and do not fit clinical criteria.
2. Engagement — Initial outreach and intake. Building trust before any structured work begins.
3. Cohort or workshop — Closed group, topic-focused, delivered over a defined period.
4. Warm handoff — When a family needs more than peer support, connections are made before the program ends.
5. Summary report — Plain-language summary of participation and outcomes. No clinical language, no private identifying information.
6. Decision point — Continue, adapt, or stop. No automatic renewal.

**What I do and what you keep section** — two columns or comparison block.

Left (What I provide): Peer support and family engagement, group facilitation, practical skill building, progress notes and a summary report, warm handoffs to clinical or community resources.

Right (What your organization retains): Clinical decisions, child safety determination, crisis response, mandated reporting, clinical documentation.

Include below this: "This is peer support, not therapy, clinical case management, or a mandated service."

**How this gets funded section** — "These services typically fit within family engagement, prevention, peer support, or grant deliverable budget lines. Structures include a fixed-scope pilot, a sponsored cohort, a per-cohort fee, or a longer retainer after a pilot completes. No prices are published. All engagements are fixed scope with a fixed cap. Request a quote to start the conversation."

**CTA section** — replace the old mailto button with a short intro paragraph and the OrgInquiryForm component (built in P3). Add the line "Do not include any family or client information in this form." before the form.

### P2. Add Organizations to header nav

In `components/marketing/header.tsx`, add `{ title: 'Organizations', href: '/services/organizations' }` to the `navigationData` array.

### P3. Add nonclinical statement to footer

In `components/marketing/footer.tsx`, add to the copyright/footer text: "Peer support and parenting education only. Not a clinical, peer recovery support, or mandated service. Not a substitute for therapy, clinical case management, or crisis intervention."

### P4. Add sponsored cohort line to /services

In `app/services/page.tsx`, find the cohorts offer card. Add to its description: "Organization-sponsored cohorts can be offered at no cost to participating parents."

### P5. Org inquiry form

Create `components/marketing/organizations/org-inquiry-form.tsx`.

Fields: organization name (required), your role at the organization (required), who are the families you're thinking of (textarea, required), what gap are you seeing (textarea, required), email address (required).

On submit: POST to `/api/org-inquiry`. Show loading state. On success, replace form with: "Got it. I'll be in touch within a few business days." Include "Do not include any family or client information in this form." above the submit button.

### P6. Org inquiry API route

Create `app/api/org-inquiry/route.ts`.

Validates all five fields. On success, sends a Resend email to Bobby (`NOTIFY_EMAIL` env var, fallback `robwashburn8@gmail.com`) with subject `[Org inquiry] [organization name]` and HTML body containing all five fields. Non-fatal if Resend fails — route still returns `{ ok: true }` after validation passes.

### P7. Documents page

Create `app/services/organizations/documents/page.tsx`.

Static page. Heading: "Partner Documents"

Intro: "The documents below are available to partner organizations. Items marked available on request are not posted here because they contain tax or identifying information; ask for them after we've been in contact."

Publicly posted (render as plain text with "(coming soon)" except where a real file exists):
- Capability Statement (coming soon)
- Pilot Program One-Pager (coming soon)
- Scope and Boundaries (coming soon)
- Privacy Policy (link to `/privacy`)
- Nonclinical Disclaimer (coming soon)

Available on request: Certificate of Insurance, W-9, Sample Agreement, References.

Add: "To request any of the items above, use the inquiry form on the organizations page." Link "inquiry form" to `/services/organizations#inquiry`.

### P8. Privacy policy page

Create `app/privacy/page.tsx`. Static page.

**What we collect:** When you use this site, create an account, or submit a form, we may collect: your email address, your name or display name, your general role (parent or professional), payment information processed by Stripe (we never store full card numbers), and records of your activity within paid courses and the community (posts, comments, progress).

**How we use it:** To deliver the services you signed up for, to send you notifications you requested, to process payments, and to contact you if you submitted an inquiry form.

**Who has access:** Bobby Washburn has access to account and inquiry data. Payment data is handled by Stripe and governed by their privacy policy. We do not sell or share your data with third parties for advertising purposes.

**Data retention:** Account data is retained while your account is active. You can request deletion by emailing `bobbywashburn0@gmail.com`.

**Questions:** `bobbywashburn0@gmail.com`

Add a link to `/privacy` in the footer alongside the copyright line.

---

## Part Q: Update CLAUDE.md

Read `CLAUDE.md` fully before editing. Reconcile the entire file.

Changes:
- **Tech Stack:** CMS line changes from Keystatic to Payload. Docs line: Fumadocs removed, deep dives now Payload collection. Add Stripe, `@neondatabase/auth`, Trophy UI to the platform description.
- **CMS section:** Replace the entire Keystatic CMS section with a Payload CMS section. Document all 9 collections and 4 globals. Note `/admin` as the admin UI. Remove all Keystatic GitHub App env var requirements.
- **Site Map:** Add `/admin`, `/sign-in`, `/welcome`, `/community`, `/courses`, `/courses/[slug]`, `/courses/[slug]/[lesson-slug]`, `/account`, `/privacy`, `/services/organizations/documents` to the appropriate tables.
- **Research Bible Ingestion Pipeline:** Remove all GitHub PR references. Document the new flow: Drive webhook writes to Payload as Draft, Bobby reviews and publishes at `/admin`.
- **Dormant Routes:** Add `/keystatic` and `/api/keystatic` as deleted.
- **Auth section:** Add a description of the two-system auth setup (Neon Auth for visitors, Payload for admin).
- **Database:** Add all new Drizzle tables from Part J.
- **Open Items:** Remove Keystatic GitHub App env var item. Add: siteSettings global wiring to `lib/links.ts` is still a separate task; lesson content for existing deep dives has not been imported into courses yet; Trophy UI component names are approximate and should be verified against the actual registry.

---

## Part R: Fix /welcome page (active bug — page fails to load)

This is a standalone fix for the current "page couldn't load" error on `/welcome`. Execute this before Part J if the page already exists in the repo, or incorporate it when building the welcome page fresh in Part L2.

### R1. Diagnose the current file

Read `app/welcome/page.tsx` in full. The error is almost certainly one of three things:

**Issue A — Missing `dynamic = 'force-dynamic'`:** If the page tries to read Neon Auth session data at the top level and the route is statically rendered (the default in Next.js App Router), the build fails or the page throws at runtime because session cookies cannot be accessed during static generation.

Fix: add this at the top of the file, before any imports:
```ts
export const dynamic = 'force-dynamic'
```

**Issue B — Broken Neon Auth session import:** The session helper import may be referencing a path that no longer exists, or calling a function that requires an HTTP context (like reading cookies) outside of a request handler.

Read the Neon Auth session helper location — check `lib/auth/` or look for the import pattern used in other protected pages like `app/dashboard/page.tsx`. Use the same import and same session call pattern consistently.

**Issue C — The `profiles` table does not have the `user_role` column yet:** If `app/api/auth/set-role/route.ts` exists and the welcome page redirects through it, and the Drizzle migration in Part J has not run yet, the route will throw a database error.

Fix for this case: run the Part J migration first, then return to `/welcome`.

### R2. Correct implementation

Replace `app/welcome/page.tsx` with the following. Read the existing file before replacing it to preserve any working session helper imports that are already project-specific.

```tsx
export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getNeonAuthSession } from '@/lib/auth/session'  // adjust import to match project convention
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import RoleSelector from '@/components/auth/role-selector'

export default async function WelcomePage() {
  const session = await getNeonAuthSession()

  if (!session?.user) {
    redirect('/sign-in')
  }

  // If profile row already exists with a role, this is a returning user — skip to community
  const existing = await db
    .select()
    .from(profiles)
    .where(eq(profiles.user_id, session.user.id))
    .limit(1)

  if (existing.length > 0 && existing[0].user_role) {
    redirect('/community')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-semibold mb-2">Welcome. Who are you here as?</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-sm">
        This helps us show you the right content and community.
      </p>
      <RoleSelector />
    </main>
  )
}
```

### R3. Role selector client component

The form submission must be a client component because it handles a user interaction and then POSTs. Create `components/auth/role-selector.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function RoleSelector() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function selectRole(role: 'parent' | 'professional') {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      if (!res.ok) throw new Error('Could not save your role. Try again.')
      router.push('/community')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <button
        onClick={() => selectRole('parent')}
        disabled={loading}
        className="flex-1 rounded-xl border-2 border-border p-6 text-left hover:border-primary transition-colors disabled:opacity-50"
      >
        <div className="font-semibold text-lg mb-1">A Parent</div>
        <div className="text-sm text-muted-foreground">
          Looking for peer support, parenting resources, and community.
        </div>
      </button>
      <button
        onClick={() => selectRole('professional')}
        disabled={loading}
        className="flex-1 rounded-xl border-2 border-border p-6 text-left hover:border-primary transition-colors disabled:opacity-50"
      >
        <div className="font-semibold text-lg mb-1">A Professional</div>
        <div className="text-sm text-muted-foreground">
          A clinician, researcher, case manager, or practitioner.
        </div>
      </button>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  )
}
```

### R4. Set-role API route

Create or replace `app/api/auth/set-role/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { getNeonAuthSession } from '@/lib/auth/session'  // adjust to project convention
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const session = await getNeonAuthSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const role = body?.role
  if (role !== 'parent' && role !== 'professional') {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  const displayName =
    session.user.name ??
    session.user.email?.split('@')[0] ??
    'Member'

  await db
    .insert(profiles)
    .values({
      user_id: session.user.id,
      user_role: role,
      display_name: displayName,
    })
    .onConflictDoUpdate({
      target: profiles.user_id,
      set: {
        user_role: role,
        display_name: displayName,
      },
    })

  return NextResponse.json({ ok: true })
}
```

### R5. Session helper import convention

Before running this fix, confirm the correct Neon Auth session helper. Check `app/dashboard/page.tsx` or any existing protected page for the exact import. Whatever that import is, use the same one in all of the files above. Do not create a second session helper.

### R6. Verify

After applying the fix:
1. `npm run build` — must exit clean
2. Navigate to `/welcome` while signed out — should redirect to `/sign-in`
3. Sign in with a test account that has no `profiles` row — should land on `/welcome` and show both role buttons
4. Pick a role — should POST to `/api/auth/set-role` and redirect to `/community`
5. Sign in again with the same test account — should skip `/welcome` and go directly to `/community`

If the page still fails after this fix, run `npm run dev` and check the terminal output for the full error message. The most common remaining causes are: the `profiles` table missing the `user_role` column (run Part J migration), or the `getNeonAuthSession` import path being wrong (check the project's actual auth helper location).

---

## New files

```
payload.config.ts
src/payload/collections/Users.ts
src/payload/collections/Media.ts
src/payload/collections/Testimonials.ts
src/payload/collections/PainPoints.ts
src/payload/collections/AwarenessModules.ts
src/payload/collections/ResearchBibles.ts
src/payload/collections/DeepDives.ts
src/payload/collections/Courses.ts
src/payload/collections/Lessons.ts
src/payload/globals/FAQ.ts
src/payload/globals/Footer.ts
src/payload/globals/SiteSettings.ts
src/payload/globals/About.ts
src/payload/payload-types.ts                         — generated by Payload, do not hand-edit
lib/payload-client.ts
lib/payload-globals.ts
lib/payload-courses.ts
lib/stripe.ts
lib/stripe-products.ts
lib/entitlements.ts
lib/level-thresholds.ts
scripts/migrate-to-payload.ts                        — one-time, delete after confirmed
app/(payload)/admin/[[...segments]]/page.tsx
app/(payload)/admin/[[...segments]]/not-found.tsx
app/(payload)/api/[...slug]/route.ts
app/sign-in/page.tsx
app/welcome/page.tsx
app/account/page.tsx
app/community/page.tsx
app/community/post/[id]/page.tsx
app/courses/page.tsx
app/courses/[slug]/page.tsx
app/courses/[slug]/[lesson-slug]/page.tsx
app/privacy/page.tsx
app/services/organizations/documents/page.tsx
app/api/auth/set-role/route.ts
app/api/community/posts/route.ts
app/api/community/comments/route.ts
app/api/community/likes/route.ts
app/api/org-inquiry/route.ts
app/api/stripe/checkout/route.ts
app/api/stripe/webhook/route.ts
app/api/account/profile/route.ts
components/auth/role-selector.tsx
components/marketing/organizations/org-inquiry-form.tsx
drizzle/[timestamp]_community_platform.ts
middleware.ts                                        — create or update if already exists
```

## Updated files

```
next.config.ts
lib/pain-points-reader.ts
lib/research-bibles-reader.ts
app/page.tsx
app/about-bobby/page.tsx
app/docs/page.tsx
app/docs/[slug]/page.tsx
app/services/page.tsx
app/services/organizations/page.tsx
app/api/webhooks/drive-content-sync/route.ts
components/marketing/header.tsx
components/marketing/footer.tsx
mdx-components.tsx
lib/db/schema.ts
CLAUDE.md
```

## Deleted files / directories

```
keystatic.config.ts
app/keystatic/
app/api/keystatic/
lib/keystatic-reader.ts
source.config.ts
content/testimonials/
content/pain-points/
content/awareness-modules/
content/research-bibles/
content/faq/
content/footer/
content/site-settings/
content/about/
```

---

## Full verification checklist

Parts A through I checklist covers the Payload migration (listed in Part I above).

After Part P, verify:

28. Organizations page renders — no prices visible anywhere, four offer cards present
29. Organizations link appears in the header nav
30. Org inquiry form at `/services/organizations` submits — Bobby receives a Resend notification
31. `/services/organizations/documents` renders — Privacy Policy links correctly, others show (coming soon)
32. `/privacy` renders
33. Sign up with a new test account — lands on `/welcome`, picks role, lands on `/community`
34. Returning user signs in — skips `/welcome`, lands on `/community`
35. Create a post in the community feed — post appears at top
36. Like a post — count increments, author's points increase, leaderboard updates
37. Create a course and a lesson in `/admin` — both appear in Payload as Published
38. `/courses` renders — course card appears
39. `/courses/[slug]` renders — lesson list appears
40. Access a free lesson — content renders from Payload Lexical body
41. Attempt a paid lesson without entitlement — upgrade prompt renders
42. Complete a free lesson — `course_progress` row inserted, 5 points awarded
43. Test Stripe checkout in test mode (Stripe test card 4242 4242 4242 4242)
44. After checkout, confirm `entitlements` row exists and locked lesson is now accessible
45. Fire `customer.subscription.deleted` webhook via Stripe CLI — entitlements row removed
46. `/account` renders — profile, level, points, course progress all present
47. Sign out from `/account` — session cleared, redirects to `/`
48. Unauthenticated request to `/community` redirects to `/sign-in`
49. `/welcome` fix verified: signed-out user redirects to `/sign-in`, new user sees role buttons and picks a role successfully, returning user skips to `/community`

---

## Notes for Claude Code

**On auth system separation:** Payload's `/admin/create-first-user` creates a Payload admin user. This is Bobby's account for content management. Site visitors (parents, professionals) authenticate through Neon Auth entirely separately. The middleware in Part L protects visitor routes using Neon Auth session checks. Never check Payload auth on visitor routes, and never check Neon Auth on admin routes.

**On course_progress referencing lesson slugs:** The `lesson_slug` in `course_progress` must match the `slug` field on the Payload Lessons record. Enforce slug uniqueness within a course at the application level (Part N3 fetches by course + lesson slug and 404s if not found). If uniqueness across all courses is a concern, add `course_slug` to the primary key.

**On Payload's readOnly admin config:** `readOnly: true` in the `admin` block only affects the UI. The migration script and Drive webhook can set those fields via the API without restriction.

**On Fumadocs transitive dependencies:** `lib/research-bibles/render-mdx.tsx` used `remark-parse`, `remark-rehype`, `hast-util-to-jsx-runtime` as transitive deps of `fumadocs-mdx`. After Fumadocs is removed, switch the `/research/[slug]` route to use Payload's `RichText` renderer instead, since bible bodies are now stored as Lexical rich text.

**On lesson content for existing deep dives:** The 36 deep dive topics (prose-complete MDX files) are migrated into the `deep-dives` collection, not into `lessons`. Those are public free content, not gated course material. If Bobby later wants to turn some deep dives into course lessons, he creates new Lesson records in `/admin` with the relevant content. Do not automatically link deep dives to courses.

**On the community audience model:** Everything is one codebase. `user_role` on the profile row is the single differentiator. Feed queries, leaderboard queries, and course listing queries all filter by the logged-in user's role. Parents never see professional posts and professionals never see parent posts. There is no separate route for each audience — one `/community` route that filters by role on every query.

**On content gating:** All new lesson content defaults to `gateType = 'free'`. No content is paywalled at launch unless Bobby explicitly sets a lesson's `gateType` to `paid` or `level` in `/admin`. The infrastructure is complete and ready; monetization turns on per-lesson when Bobby decides.

**On the ADHD marker blocks:** Implement `[COMPONENT: X]` as a custom Lexical feature passed to `lexicalEditor({})` in `payload.config.ts` so Payload stores them correctly. Do not use plain paragraph blocks with marker text — they are indistinguishable from prose.

**On robots.ts:** Add `/admin` to the disallow list for all non-Googlebot agents. Add `/community`, `/courses`, `/account`, `/sign-in`, `/welcome` as well — none of those should be indexed.

**On the /welcome fix (Part R):** The three most likely root causes of the current error are: missing `export const dynamic = 'force-dynamic'`, a broken session helper import, or the `profiles` table missing the `user_role` column because Part J has not run. Read the terminal error output before assuming which one it is. The fix code in R2-R4 handles all three cases once the column exists.
