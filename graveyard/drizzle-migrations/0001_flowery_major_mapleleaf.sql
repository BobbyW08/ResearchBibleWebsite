CREATE TABLE "pending_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic" text NOT NULL,
	"status" text DEFAULT 'pending_review' NOT NULL,
	"generated_mdx" text NOT NULL,
	"generated_json" text NOT NULL,
	"changed_sections" text[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"approved_at" timestamp with time zone,
	"approved_by" uuid,
	"published_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "pending_reviews" ADD CONSTRAINT "pending_reviews_approved_by_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "neon_auth"."user"("id") ON DELETE set null ON UPDATE no action;