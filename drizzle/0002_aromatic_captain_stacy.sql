CREATE TABLE "promo_banner_products" (
	"banner_id" varchar(191) NOT NULL,
	"product_id" varchar(191) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "promo_banner_products_banner_id_product_id_pk" PRIMARY KEY("banner_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "promo_banners" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" varchar(191) NOT NULL,
	"subtitle" varchar(255),
	"image_url" text NOT NULL,
	"image_key" varchar(255) NOT NULL,
	"cta_label" varchar(64) DEFAULT 'Ver promoción' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_sku_unique";--> statement-breakpoint
CREATE INDEX "promo_banner_products_banner_idx" ON "promo_banner_products" USING btree ("banner_id");--> statement-breakpoint
CREATE INDEX "promo_banners_active_sort_idx" ON "promo_banners" USING btree ("is_active","sort_order");--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "sku";