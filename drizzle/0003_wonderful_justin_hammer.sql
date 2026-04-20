CREATE TABLE "store_settings" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"cart_minimum_amount_cents" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "minimum_quantity" integer;