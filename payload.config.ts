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
import { VisitorProfiles } from "./src/payload/collections/VisitorProfiles";
import { Posts } from "./src/payload/collections/Posts";
import { Comments } from "./src/payload/collections/Comments";
import { Reports } from "./src/payload/collections/Reports";
import { LessonProgress } from "./src/payload/collections/LessonProgress";
import { Entitlements } from "./src/payload/collections/Entitlements";
import { InterestSignups } from "./src/payload/collections/InterestSignups";
import { Enrollments } from "./src/payload/collections/Enrollments";

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
    VisitorProfiles,
    Posts,
    Comments,
    Reports,
    LessonProgress,
    Entitlements,
    InterestSignups,
    Enrollments,
  ],
  globals: [FAQ, Footer, SiteSettings, About],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    push: false,
    schemaName: "payload_cms",
    migrationDir: path.resolve(__dirname, "src/migrations"),
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
