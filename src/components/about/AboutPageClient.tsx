"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const PERSONALITY_KEYS = [
  "precise", "direct", "creative", "reliable", "curious", "humble", "fun",
] as const;

export function AboutPageClient() {
  const t = useTranslations("about");
  const [activePhilosophy, setActivePhilosophy] = useState(0);
  const [transformStage, setTransformStage] = useState(0);
  const philosophyItems = t.raw("philosophy.items") as string[];

  const stages = ["real", "digital", "cartoon", "motion", "real"] as const;

  const runTransformation = () => {
    if (transformStage > 0) return;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setTransformStage(step);
      if (step >= 4) {
        clearInterval(interval);
        setTimeout(() => setTransformStage(0), 2000);
      }
    }, 600);
  };

  return (
    <div className="pt-32 pb-24">
      {/* Opening */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <span className="font-mono-tech text-xs text-accent">ABOUT</span>
            <h1 className="mt-6 font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight max-w-4xl">
              {t("opening")}
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Passion */}
      <section className="px-6 md:px-12 py-16 bg-surface/50">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <h2 className="font-display text-5xl md:text-7xl font-bold text-accent tracking-tight">
              {t("passion.headline")}
            </h2>
            <p className="mt-8 max-w-2xl text-lg md:text-xl text-text-secondary leading-relaxed">
              {t("passion.text")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Film */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <h2 className="font-display text-4xl md:text-5xl font-bold">{t("whyFilm.headline")}</h2>
            <p className="mt-6 text-lg text-text-secondary">{t("whyFilm.text")}</p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="font-display text-8xl md:text-9xl font-bold text-accent/20 text-center">
              {t("evolution.years")}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="px-6 md:px-12 py-16 bg-surface/30 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <h2 className="font-mono-tech text-xs text-accent mb-12">{t("evolution.headline")}</h2>
            <div className="flex gap-8 overflow-x-auto pb-4">
              {(["freelance", "moreProductions", "moreExperience", "fullTime", "biggerAmbitions"] as const).map(
                (key, i) => (
                  <div key={key} className="flex-shrink-0 min-w-[200px]">
                    <span className="font-mono-tech text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-2 font-display text-xl font-bold">{t(`evolution.${key}`)}</p>
                  </div>
                )
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* WOW Transformation */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="mx-auto max-w-7xl text-center">
          <ScrollReveal>
            <button
              type="button"
              onClick={runTransformation}
              className="relative mx-auto block w-64 h-80 overflow-hidden rounded-sm border border-white/10 cursor-pointer group"
              aria-label="Identity transformation"
            >
              <Image
                src="/images/grok-portrait.png"
                alt="Grok"
                fill
                className={cn(
                  "object-cover object-top transition-all duration-500",
                  transformStage === 2 && "saturate-200 contrast-125",
                  transformStage === 3 && "blur-sm scale-110",
                )}
                sizes="256px"
              />
              {transformStage >= 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-bg/80">
                  <p className="font-display text-lg font-bold px-4">{t("wowReveal")}</p>
                </div>
              )}
            </button>
            <p className="mt-4 font-mono-tech text-xs text-text-secondary">
              {transformStage === 0 ? "CLICK TO TRANSFORM" : stages[transformStage] ?? ""}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-6 md:px-12 py-16 bg-surface/50">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="space-y-4">
              {philosophyItems.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActivePhilosophy(i)}
                  className={cn(
                    "block w-full text-left font-display text-2xl md:text-4xl font-bold transition-colors min-h-[44px]",
                    activePhilosophy === i ? "text-accent" : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Personality */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PERSONALITY_KEYS.map((key) => (
            <ScrollReveal key={key}>
              <div className="p-6 border border-white/5 rounded-sm hover:border-accent/30 transition-colors min-h-[120px]">
                <h3 className="font-display text-xl font-bold text-accent">
                  {t(`personality.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {t(`personality.${key}.desc`)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Technology */}
      <section className="px-6 md:px-12 py-16 bg-surface/30">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold">{t("technology.headline")}</h2>
            <p className="mt-6 max-w-2xl text-lg text-text-secondary italic">
              {t("technology.quote")}
            </p>
            <p className="mt-8 font-mono-tech text-sm text-text-secondary">{t("technology.empty")}</p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
