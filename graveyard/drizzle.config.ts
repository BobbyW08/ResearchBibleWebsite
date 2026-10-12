import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Neon Managed Better Auth owns and migrates the `neon_auth` schema itself
  // — restrict Drizzle Kit to `public` so it never tries to manage it.
  schemaFilter: ["public"],
});
