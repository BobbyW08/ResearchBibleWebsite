import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { fileURLToPath } from "url";

import { Users } from "./src/payload/collections/Users";
import { Media } from "./src/payload/collections/Media";
import { Testimonials } from "./src/payload/collections/Testimonials";
import { PainPoints } from "./src/payload/collections/PainPoints";
import { AwarenessModules } from "./src/payload/collections/AwarenessModules";
import { ResearchBibles } from "./src/payload/collections/ResearchBibles";
import { DeepDives } from "./src/payload/collections/DeepDives";
import { Courses } from "./src/payload/collections/Courses";
import { Lessons } from "./src/payload/collections/Lessons";

import { FAQ } from "./src/payload/globals/FAQ";
import { Footer } from "./src/payload/globals/Footer";
import { SiteSettings } from "./src/payload/globals/SiteSettings";
import { About } from "./src/payload/globals/About";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default buildConfig({
  admin: {
    user: "users",
    meta: {
      titleSuffix: "— Bobby Washburn Admin",
    },
    components: {
      graphics: {
        Logo: { path: "./src/payload/admin/Logo" },
        Icon: { path: "./src/payload/admin/Logo" },
      },
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
    // Isolate Payload's tables in their own schema so drizzle-kit push
    // doesn't see (and prompt to drop) our community tables in public.
    schemaName: "payload_cms",
  }),
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(__dirname, "src/payload/payload-types.ts"),
  },
  graphQL: {
    disable: true,
  },
});
