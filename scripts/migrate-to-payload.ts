/**
 * One-time migration script: YAML/MDX content → Payload CMS.
 *
 * Prerequisites:
 *   1. Payload is installed and configured (payload.config.ts at repo root)
 *   2. DATABASE_URI and PAYLOAD_SECRET are set in .env.local
 *   3. Bobby has navigated to /admin/create-first-user and created the first admin user
 *
 * Run: npx tsx scripts/migrate-to-payload.ts
 *
 * After migration is confirmed, this script can be deleted.
 */

import { getPayload } from "payload";
import configPromise from "../payload.config";
import { parse } from "yaml";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { convertMarkdownToLexical, editorConfigFactory } from "@payloadcms/richtext-lexical";

const CONTENT = join(process.cwd(), "content");

// Pillar mapping for each deep-dive MDX slug
const PILLAR_MAP: Record<string, "stabilize" | "connect" | "structure" | "adapt"> = {
  adhd: "stabilize",
  "de-escalation-crisis-planning": "stabilize",
  "first-coaching-session-goal-setting": "stabilize",
  "structure-routines-parenting": "stabilize",
  "understanding-child-behavior": "stabilize",
  "autism-spectrum-disorder-children": "stabilize",
  "understanding-neurodivergence": "stabilize",
  "anxiety-depression-children": "stabilize",
  "trauma-informed-parenting-guide": "stabilize",
  "parental-self-care": "connect",
  "connection-principles": "connect",
  "growth-mindset-parenting": "connect",
  "parenting-styles-guide": "connect",
  "communication-builds-trust": "connect",
  "family-dynamics-systems-patterns": "connect",
  "how-motivation-works": "connect",
  "applying-parenting-strategies": "structure",
  "child-development-reality-check": "structure",
  "teen-autonomy-identity-support": "structure",
  "principles-effective-discipline": "structure",
  "behavior-reward-consequence-systems": "structure",
  "co-parenting-after-separation": "structure",
  "managing-public-outings-without-panic": "adapt",
  "supporting-aggressive-children": "adapt",
  "teaching-money-skills-children": "adapt",
  "healthy-bodies-calm-homes": "adapt",
  "big-transitions-big-feelings": "adapt",
  "raising-resilient-kind-kids": "adapt",
  "chores-family-contribution": "adapt",
  "digital-parenting-guide": "adapt",
  "screen-gaming-compulsive-use": "adapt",
  "friendship-social-coaching": "adapt",
  "parental-mental-health-substance-use": "adapt",
  "school-assistance-parent-guide": "adapt",
  "high-risk-kids-self-harm-suicide-support": "adapt",
  "modern-parenting-structural-shift": "adapt",
};

function readYaml<T>(filePath: string): T {
  return parse(readFileSync(filePath, "utf-8")) as T;
}

function listYamlDir(dir: string): string[] {
  try {
    return readdirSync(dir).filter((f) => f.endsWith(".yaml"));
  } catch {
    return [];
  }
}

// Extract H1 title from MDX content
function extractMdxTitle(content: string): string {
  const match = /^#\s+(.+)$/m.exec(content);
  return match ? match[1].trim() : "";
}

// Extract description from MDX content (first non-empty paragraph after title/frontmatter)
function extractMdxDescription(content: string): string {
  const lines = content.split("\n");
  let pastFrontmatter = false;
  let pastTitle = false;
  for (const line of lines) {
    if (line.trim() === "---") {
      pastFrontmatter = !pastFrontmatter;
      continue;
    }
    if (pastFrontmatter) continue;
    if (line.startsWith("#")) {
      pastTitle = true;
      continue;
    }
    if (pastTitle && line.trim().length > 20 && !line.startsWith(">") && !line.startsWith("<")) {
      return line.trim().slice(0, 200);
    }
  }
  return "";
}

// Replace <ComponentName /> tags with [COMPONENT: ComponentName] markers
function replaceComponentTags(content: string): string {
  return content.replace(/<(\w+)\s*\/>/g, (_match, name) => `[COMPONENT: ${name}]`);
}

// Strip MDX imports and JSX noise for Lexical conversion
function cleanMdxForLexical(content: string): string {
  // Remove frontmatter
  const noFrontmatter = content.replace(/^---[\s\S]*?---\n/, "");
  // Replace component tags with markers
  const withMarkers = replaceComponentTags(noFrontmatter);
  // Remove import/export lines
  const noImports = withMarkers.replace(/^import\s+.+$/gm, "").replace(/^export\s+.+$/gm, "");
  return noImports.trim();
}

async function main() {
  console.log("Initializing Payload...");
  const payload = await getPayload({ config: configPromise });
  console.log("Payload ready.\n");

  const editorConfig = await editorConfigFactory.default({ config: payload.config });

  // ─── 1. Testimonials ───────────────────────────────────────────────────────
  console.log("Migrating testimonials...");
  const testimonialFiles = listYamlDir(join(CONTENT, "testimonials"));
  let testimonialCount = 0;
  for (const file of testimonialFiles) {
    const data = readYaml<{ quote: string; attribution: string }>(
      join(CONTENT, "testimonials", file)
    );
    try {
      await payload.create({
        collection: "testimonials",
        data: { quote: data.quote, attribution: data.attribution },
      });
      testimonialCount++;
    } catch (err) {
      console.warn(`  Skip testimonial ${file}: ${err instanceof Error ? err.message : err}`);
    }
  }
  console.log(`  Done: ${testimonialCount} testimonials.\n`);

  // ─── 2. FAQ ────────────────────────────────────────────────────────────────
  console.log("Migrating FAQ...");
  try {
    const faqData = readYaml<{ items: { question: string; answer: string }[] }>(
      join(CONTENT, "faq", "data.yaml")
    );
    await payload.updateGlobal({ slug: "faq", data: { items: faqData.items } });
    console.log(`  Done: ${faqData.items.length} FAQ items.\n`);
  } catch (err) {
    console.warn(`  FAQ skipped: ${err instanceof Error ? err.message : err}\n`);
  }

  // ─── 3. Footer ─────────────────────────────────────────────────────────────
  console.log("Migrating footer...");
  try {
    const footerData = readYaml<{ tagline: string; contactEmail: string; copyrightText: string }>(
      join(CONTENT, "footer", "data.yaml")
    );
    await payload.updateGlobal({
      slug: "footer",
      data: {
        tagline: footerData.tagline,
        contactEmail: footerData.contactEmail,
        copyrightText: footerData.copyrightText,
      },
    });
    console.log("  Done.\n");
  } catch (err) {
    console.warn(`  Footer skipped: ${err instanceof Error ? err.message : err}\n`);
  }

  // ─── 4. Site Settings ──────────────────────────────────────────────────────
  console.log("Migrating site settings...");
  try {
    const siteData = readYaml<{ substackSubdomain?: string; calComUrl?: string }>(
      join(CONTENT, "site-settings", "data.yaml")
    );
    await payload.updateGlobal({
      slug: "site-settings",
      data: {
        substackSubdomain: siteData.substackSubdomain ?? "",
        calComUrl: siteData.calComUrl ?? "",
      },
    });
    console.log("  Done.\n");
  } catch (err) {
    console.warn(`  Site settings skipped: ${err instanceof Error ? err.message : err}\n`);
  }

  // ─── 5. About ──────────────────────────────────────────────────────────────
  console.log("Migrating about...");
  try {
    const aboutData = readYaml<{
      heroSubhead?: string;
      credentialBadge?: string;
      shortAboutParagraphs?: string[];
      cprsId?: string;
      currentRole?: string;
      training?: string | string[];
      prior?: string;
      also?: string;
    }>(join(CONTENT, "about", "data.yaml"));
    await payload.updateGlobal({
      slug: "about",
      data: {
        heroSubhead: aboutData.heroSubhead ?? "",
        credentialBadge: aboutData.credentialBadge ?? "",
        shortAboutParagraphs: (aboutData.shortAboutParagraphs ?? []).map((p) => ({
          paragraph: p,
        })),
        cprsId: aboutData.cprsId ?? "",
        currentRole: aboutData.currentRole ?? "",
        training: Array.isArray(aboutData.training)
          ? aboutData.training.join("; ")
          : (aboutData.training ?? ""),
        prior: aboutData.prior ?? "",
        also: aboutData.also ?? "",
      },
    });
    console.log("  Done.\n");
  } catch (err) {
    console.warn(`  About skipped: ${err instanceof Error ? err.message : err}\n`);
  }

  // ─── 6. Pain Points ────────────────────────────────────────────────────────
  console.log("Migrating pain points...");
  const painPointFiles = listYamlDir(join(CONTENT, "pain-points"));
  let ppCount = 0;
  for (const file of painPointFiles) {
    const slug = file.replace(".yaml", "");
    const data = readYaml<{
      slugName?: string;
      icon?: string;
      featured?: boolean;
      tag?: string;
      title?: string;
      cardTeaser?: string;
      headline?: string;
      intro?: string;
      exampleScenario?: string;
      whatHappening?: { discriminant: string; value: string | string[] }[];
      backfires?: { title: string; body: string }[];
      tries?: { title: string; body: string }[];
      support?: string;
      crisis?: boolean;
      deepDiveLabel?: string;
      deepDiveHref?: string;
      related?: { label: string; href: string }[];
    }>(join(CONTENT, "pain-points", file));

    // Convert whatHappening blocks to Lexical markdown
    const whatHappeningMd = (data.whatHappening ?? [])
      .map((block) => {
        if (block.discriminant === "list" && Array.isArray(block.value)) {
          return (block.value as string[]).map((item) => `- ${item}`).join("\n");
        }
        return String(block.value ?? "");
      })
      .join("\n\n");

    try {
      await payload.create({
        collection: "pain-points",
        data: {
          slug,
          tag: data.tag ?? "",
          title: data.title ?? "",
          cardTeaser: data.cardTeaser ?? "",
          headline: data.headline ?? "",
          icon: data.icon ?? "Flame",
          featured: data.featured ?? false,
          intro: data.intro ?? "",
          exampleScenario: data.exampleScenario ?? "",
          whatHappening: convertMarkdownToLexical({ editorConfig, markdown: whatHappeningMd }),
          backfires: (data.backfires ?? []).map((b) => ({
            title: b.title,
            body: b.body,
          })),
          tries: (data.tries ?? []).map((t) => ({
            title: t.title,
            details: t.body,
          })),
          support: data.support ?? "",
          crisis: data.crisis ?? false,
          deepDive: {
            href: data.deepDiveHref ?? "",
            label: data.deepDiveLabel ?? "",
          },
          related: (data.related ?? []).map((r) => ({
            href: r.href,
            label: r.label,
          })),
          _status: "published",
        },
      });
      ppCount++;
    } catch (err) {
      console.warn(`  Skip pain-point ${slug}: ${err instanceof Error ? err.message : err}`);
    }
  }
  console.log(`  Done: ${ppCount} pain points.\n`);

  // ─── 7. Awareness Modules ──────────────────────────────────────────────────
  console.log("Migrating awareness modules...");
  const moduleFiles = listYamlDir(join(CONTENT, "awareness-modules"));
  let modCount = 0;
  for (const file of moduleFiles) {
    const slug = file.replace(".yaml", "");
    const data = readYaml<{
      slugName?: string;
      icon?: string;
      tag?: string;
      title?: string;
      cardTeaser?: string;
      headline?: string;
      intro?: string;
      sections?: {
        heading: string;
        body: { discriminant: string; value: string | string[] }[];
      }[];
      crisis?: boolean;
      related?: { label: string; href: string }[];
    }>(join(CONTENT, "awareness-modules", file));

    const sections = (data.sections ?? []).map((section) => {
      const bodyMd = section.body
        .map((block) => {
          if (block.discriminant === "list" && Array.isArray(block.value)) {
            return (block.value as string[]).map((item) => `- ${item}`).join("\n");
          }
          return String(block.value ?? "");
        })
        .join("\n\n");
      return {
        heading: section.heading,
        body: convertMarkdownToLexical({ editorConfig, markdown: bodyMd }),
      };
    });

    try {
      await payload.create({
        collection: "awareness-modules",
        data: {
          slug,
          tag: data.tag ?? "",
          title: data.title ?? "",
          cardTeaser: data.cardTeaser ?? "",
          headline: data.headline ?? "",
          icon: data.icon ?? "",
          intro: data.intro ?? "",
          sections,
          crisis: data.crisis ?? false,
          related: (data.related ?? []).map((r) => ({ href: r.href, label: r.label })),
          _status: "published",
        },
      });
      modCount++;
    } catch (err) {
      console.warn(`  Skip module ${slug}: ${err instanceof Error ? err.message : err}`);
    }
  }
  console.log(`  Done: ${modCount} awareness modules.\n`);

  // ─── 8 + 9. Deep Dives (35 topics + ADHD) ─────────────────────────────────
  console.log("Migrating deep dives...");
  const docsDir = join(CONTENT, "docs");
  let ddCount = 0;
  let ddSkipped = 0;
  const mdxFiles = readdirSync(docsDir).filter(
    (f) => f.endsWith(".mdx") && f !== "index.mdx"
  );

  for (const file of mdxFiles) {
    const slug = file.replace(".mdx", "");
    const rawContent = readFileSync(join(docsDir, file), "utf-8");
    const title = extractMdxTitle(rawContent) || slug;
    const description = extractMdxDescription(rawContent);
    const pillar = PILLAR_MAP[slug];

    if (!pillar) {
      console.warn(`  No pillar mapping for ${slug} — skipping`);
      ddSkipped++;
      continue;
    }

    const cleanedMd = cleanMdxForLexical(rawContent);
    const isAdhd = slug === "adhd";

    try {
      await payload.create({
        collection: "deep-dives",
        data: {
          slug,
          title,
          pillar,
          description,
          body: convertMarkdownToLexical({ editorConfig, markdown: cleanedMd }),
          noindex: false,
          // ADHD stays draft until the dedicated renderer (app/docs/adhd/page.tsx) is confirmed
          _status: isAdhd ? "draft" : "published",
        },
      });
      ddCount++;
      if (isAdhd) console.log(`  ADHD: created as draft (confirm renderer before publishing)`);
    } catch (err) {
      console.warn(`  Skip deep-dive ${slug}: ${err instanceof Error ? err.message : err}`);
      ddSkipped++;
    }
  }
  console.log(`  Done: ${ddCount} deep dives (${ddSkipped} skipped).\n`);

  // ─── 10 + 11. Courses and Lessons ─────────────────────────────────────────
  console.log(
    "Courses and Lessons: no existing records to migrate. Bobby creates these through /admin.\n"
  );

  console.log("Migration complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
