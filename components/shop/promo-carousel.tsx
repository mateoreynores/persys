"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Megaphone01Icon,
} from "@hugeicons/core-free-icons";

import { PromoSheet } from "@/components/shop/promo-sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PromoBannerWithProducts } from "@/lib/store/types";

const AUTOPLAY_MS = 6000;

export function PromoCarousel({ promos }: { promos: PromoBannerWithProducts[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [openPromo, setOpenPromo] = useState<PromoBannerWithProducts | null>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!emblaApi) return;

    const handleSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    handleSelect();
    emblaApi.on("select", handleSelect);
    emblaApi.on("reInit", handleSelect);

    return () => {
      emblaApi.off("select", handleSelect);
      emblaApi.off("reInit", handleSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || promos.length <= 1) return;
    if (isHovering || openPromo) return;

    autoplayTimerRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, AUTOPLAY_MS);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [emblaApi, promos.length, isHovering, openPromo]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  if (promos.length === 0) return null;

  const hasMultiple = promos.length > 1;

  return (
    <>
      <section
        aria-label="Promociones"
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          ref={emblaRef}
          className="overflow-hidden rounded-2xl"
          aria-live="polite"
        >
          <div className="flex touch-pan-y">
            {promos.map((promo) => (
              <div key={promo.id} className="min-w-0 flex-[0_0_100%]">
                <PromoTile promo={promo} onOpen={() => setOpenPromo(promo)} />
              </div>
            ))}
          </div>
        </div>

        {hasMultiple && (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={scrollPrev}
              aria-label="Promoción anterior"
              className="absolute left-2 top-1/2 hidden -translate-y-1/2 bg-background/80 shadow-sm backdrop-blur md:inline-flex"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={scrollNext}
              aria-label="Promoción siguiente"
              className="absolute right-2 top-1/2 hidden -translate-y-1/2 bg-background/80 shadow-sm backdrop-blur md:inline-flex"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
            </Button>

            <div className="mt-3 flex items-center justify-center gap-1.5">
              {promos.map((promo, index) => (
                <button
                  key={promo.id}
                  type="button"
                  onClick={() => scrollTo(index)}
                  aria-label={`Ir a la promoción ${index + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === selectedIndex
                      ? "w-6 bg-foreground"
                      : "w-1.5 bg-foreground/25 hover:bg-foreground/40",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <PromoSheet
        promo={openPromo}
        open={openPromo !== null}
        onOpenChange={(open) => {
          if (!open) setOpenPromo(null);
        }}
      />
    </>
  );
}

function PromoTile({
  promo,
  onOpen,
}: {
  promo: PromoBannerWithProducts;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Abrir promoción: ${promo.title}`}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/40 bg-muted/30 text-left outline-none transition-shadow hover:shadow-lg hover:shadow-black/[0.06] focus-visible:ring-3 focus-visible:ring-ring/50 sm:aspect-[16/6] lg:aspect-[16/5]"
    >
      {promo.imageUrl && (
        <Image
          src={promo.imageUrl}
          alt={promo.title}
          fill
          priority
          unoptimized
          sizes="(min-width: 1024px) 1280px, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      )}

      {/* Gradient overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

      {/* Top-left micro chip */}
      <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-foreground shadow-sm backdrop-blur">
        <HugeiconsIcon icon={Megaphone01Icon} size={11} strokeWidth={2} />
        Promoción
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 text-white sm:p-6 lg:p-8">
        <h2 className="text-balance text-xl font-semibold leading-tight drop-shadow-sm sm:text-2xl lg:text-3xl">
          {promo.title}
        </h2>
        {promo.subtitle && (
          <p className="max-w-xl text-xs leading-relaxed text-white/85 sm:text-sm">
            {promo.subtitle}
          </p>
        )}
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black shadow-md transition-all group-hover:gap-2.5 group-hover:pr-3.5">
            {promo.ctaLabel || "Ver promoción"}
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={13}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
          <span className="text-[11px] text-white/70 tabular-nums">
            {promo.products.length} producto{promo.products.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </button>
  );
}
