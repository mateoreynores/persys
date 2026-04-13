CREATE TYPE "public"."order_status" AS ENUM('pending_whatsapp', 'submitted', 'confirmed', 'fulfilled', 'cancelled');--> statement-breakpoint
CREATE TABLE "admin_audit_logs" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"clerk_user_id" varchar(191) NOT NULL,
	"action" varchar(191) NOT NULL,
	"entity_type" varchar(191) NOT NULL,
	"entity_id" varchar(191) NOT NULL,
	"payload_json" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(191) NOT NULL,
	"slug" varchar(191) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"order_id" varchar(191) NOT NULL,
	"product_id" varchar(191),
	"product_snapshot_name" varchar(191) NOT NULL,
	"product_snapshot_sku" varchar(191) NOT NULL,
	"unit_price_cents" integer NOT NULL,
	"sale_unit_price_cents" integer,
	"quantity" integer NOT NULL,
	"line_subtotal_cents" integer NOT NULL,
	"line_total_cents" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"order_number" varchar(191) NOT NULL,
	"status" "order_status" DEFAULT 'pending_whatsapp' NOT NULL,
	"currency_code" varchar(3) DEFAULT 'ARS' NOT NULL,
	"subtotal_cents" integer NOT NULL,
	"discount_cents" integer NOT NULL,
	"total_cents" integer NOT NULL,
	"customer_company" varchar(191) NOT NULL,
	"customer_name" varchar(191) NOT NULL,
	"customer_phone" varchar(191) NOT NULL,
	"customer_email" varchar(191) NOT NULL,
	"tax_id" varchar(191),
	"delivery_city" varchar(191) NOT NULL,
	"notes" text,
	"whats_app_url" text NOT NULL,
	"whats_app_message" text NOT NULL,
	"source" varchar(64) DEFAULT 'shop' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"category_id" varchar(191) NOT NULL,
	"name" varchar(191) NOT NULL,
	"slug" varchar(191) NOT NULL,
	"sku" varchar(191) NOT NULL,
	"brand" varchar(191) NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"price_cents" integer NOT NULL,
	"sale_price_cents" integer,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"availability_note" varchar(191),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE INDEX "admin_audit_logs_created_idx" ON "admin_audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "categories_active_sort_idx" ON "categories" USING btree ("is_active","sort_order");--> statement-breakpoint
CREATE INDEX "order_items_order_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "orders_status_created_idx" ON "orders" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "products_category_active_sort_idx" ON "products" USING btree ("category_id","is_active","sort_order");--> statement-breakpoint
CREATE INDEX "products_featured_idx" ON "products" USING btree ("is_featured","is_active");