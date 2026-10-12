CREATE TABLE "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"account_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topic_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"topic_id" text NOT NULL,
	"last_viewed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completion_state" text DEFAULT 'unstarted' NOT NULL,
	CONSTRAINT "topic_progress_user_id_topic_id_unique" UNIQUE("user_id","topic_id")
);
--> statement-breakpoint
CREATE TABLE "neon_auth"."user" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_progress" ADD CONSTRAINT "topic_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;