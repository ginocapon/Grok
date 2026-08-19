"use client";

import { useState } from "react";
import { SiteImage } from "@/components/ui/SiteImage";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AboutPreview() {
  const t = useTranslations("aboutPreview");
  const [mode, setMode] = useState<"real" | "cartoon">("real");

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 w-full group">
              <div className="absolute -inset-4 rounded-sm border border-accent/20 transition-colors group-hover:border-accent/50" />
              <button
                type="button"
                onClick={() => setMode(mode === "real" ? "cartoon" : "real")}
                className="relative h-full w-full overflow-hidden rounded-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={mode === "real" ? "Switch to cartoon alter ego" : "Switch to real photo"}
              >
                <SiteImage
                  src={mode === "real" ? "/images/grok-portrait.png" : "/uploads/characters/grok-tekken.png"}
                  alt={mode === "real" ? "Grok — Filmmaker portrait" : "Grok — Cartoon alter ego (AI-generated)"}
                  fill
                  className={cn(
                    "object-cover transition-all duration-700",
                    mode === "real" ? "object-top" : "object-center",
                    mode === "cartoon" && "object-contain bg-black"
                  )}
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 font-mono-tech text-xs bg-bg/80 px-2 py-1 border border-white/10">
                  {mode === "real" ? "FRAME 024" : "ALTER EGO"}
                </div>
                <div className="absolute bottom-4 right-4 font-mono-tech text-xs text-accent bg-bg/80 px-2 py-1 border border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  TAP TO TRANSFORM
                </div>
              </button>
            </div>

            <div>
              <span className="font-mono-tech text-xs text-accent">04 — ABOUT</span>
              <div className="mt-8 space-y-2">
                {[t("line1"), t("line2"), t("line3"), t("line4"), t("line5"), t("line6")].map(
                  (line, i) => (
                    <p
                      key={i}
                      className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary"
                    >
                      {line}
                    </p>
                  )
                )}
              </div>
              <Link
                href="/about"
                className="mt-10 inline-flex items-center gap-2 font-mono-tech text-xs tracking-widest text-text-secondary hover:text-accent transition-colors min-h-[44px]"
              >
                {t("cta")}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
