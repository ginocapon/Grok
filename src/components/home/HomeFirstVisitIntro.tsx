"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import {
  hasSeenHomeIntro,
  markHomeIntroSeen,
} from "@/lib/home-intro";
import { assetPath } from "@/lib/asset-path";

type IntroPhase = "checking" | "playing" | "done";

interface HomeFirstVisitIntroProps {
  children: ReactNode;
}

const COUNTDOWN = ["5", "4", "3", "2", "1"] as const;
const COUNTDOWN_STEP = 0.85;
const COUNTDOWN_START = 0.35;

export function HomeFirstVisitIntro({ children }: HomeFirstVisitIntroProps) {
  const t = useTranslations("homeIntro");
  const [phase, setPhase] = useState<IntroPhase>("checking");
  const overlayRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const readyRef = useRef<HTMLDivElement>(null);
  const warriorRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (hasSeenHomeIntro() || reducedMotion) {
      setPhase("done");
      return;
    }

    setPhase("playing");
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;

    return () => {
      document.body.style.overflow = "";
      timelineRef.current?.kill();
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;

    const overlay = overlayRef.current;
    const numberEl = numberRef.current;
    const readyEl = readyRef.current;
    const warriorEl = warriorRef.current;
    const burstEl = burstRef.current;

    if (!overlay || !numberEl || !readyEl || !warriorEl || !burstEl) return;

    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(readyEl, { autoAlpha: 0, scale: 0.6 });
    gsap.set(warriorEl, { autoAlpha: 0, scale: 0.85, rotate: -6 });
    gsap.set(burstEl, { scale: 0, autoAlpha: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        markHomeIntroSeen();
        gsap.to(overlay, {
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.inOut",
          onComplete: () => {
            document.body.style.overflow = "";
            setPhase("done");
          },
        });
      },
    });

    timelineRef.current = tl;

    COUNTDOWN.forEach((digit, index) => {
      const start = COUNTDOWN_START + index * COUNTDOWN_STEP;

      tl.call(
        () => {
          numberEl.textContent = digit;
          numberEl.dataset.text = digit;
        },
        undefined,
        start
      );

      tl.fromTo(
        numberEl,
        { scale: 0.08, autoAlpha: 0, rotate: -8 },
        {
          scale: 1.45,
          autoAlpha: 1,
          rotate: 0,
          duration: 0.32,
          ease: "power4.out",
        },
        start
      );

      tl.to(
        burstEl,
        {
          scale: 2.8,
          autoAlpha: 0.55,
          duration: 0.28,
          ease: "power2.out",
        },
        start + 0.02
      );

      tl.to(
        burstEl,
        {
          scale: 3.6,
          autoAlpha: 0,
          duration: 0.35,
          ease: "power2.in",
        },
        start + 0.18
      );

      tl.to(
        numberEl,
        {
          scale: 1,
          duration: 0.22,
          ease: "back.out(2)",
        },
        start + 0.28
      );

      if (index < COUNTDOWN.length - 1) {
        tl.to(
          numberEl,
          {
            scale: 0.2,
            autoAlpha: 0,
            duration: 0.18,
            ease: "power3.in",
          },
          start + COUNTDOWN_STEP - 0.12
        );
      } else {
        tl.to(
          numberEl,
          {
            scale: 0.15,
            autoAlpha: 0,
            duration: 0.22,
            ease: "power3.in",
          },
          start + 0.55
        );
      }
    });

    const readyStart = COUNTDOWN_START + COUNTDOWN.length * COUNTDOWN_STEP + 0.1;

    tl.fromTo(
      readyEl,
      { scale: 0.35, autoAlpha: 0 },
      {
        scale: 1.12,
        autoAlpha: 1,
        duration: 0.45,
        ease: "power4.out",
      },
      readyStart
    );

    tl.to(
      readyEl,
      { scale: 1, duration: 0.25, ease: "back.out(1.8)" },
      readyStart + 0.38
    );

    tl.to(
      readyEl,
      { autoAlpha: 0, scale: 1.25, duration: 0.35, ease: "power2.in" },
      readyStart + 1.35
    );

    const warriorStart = readyStart + 1.55;

    tl.fromTo(
      warriorEl,
      { autoAlpha: 0, scale: 0.7, rotate: -10 },
      {
        autoAlpha: 1,
        scale: 1,
        rotate: 0,
        duration: 0.9,
        ease: "power3.out",
      },
      warriorStart
    );

    tl.to(
      warriorEl,
      {
        scale: 1.06,
        duration: 1.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1,
      },
      warriorStart + 0.9
    );

    tl.to(
      warriorEl,
      { autoAlpha: 0, scale: 1.15, duration: 0.55, ease: "power2.in" },
      warriorStart + 2.8
    );

    return () => {
      tl.kill();
    };
  }, [phase]);

  return (
    <>
      {children}

      {phase !== "done" && (
        <div
          ref={overlayRef}
          className="home-intro-overlay fixed inset-0 z-[10050] flex items-center justify-center bg-black"
          aria-hidden={phase === "checking"}
          aria-live="polite"
        >
          <div
            ref={burstRef}
            className="home-intro-burst pointer-events-none absolute h-64 w-64 rounded-full md:h-96 md:w-96"
          />

          <span
            ref={numberRef}
            className="home-intro-number font-display absolute select-none"
            data-text="5"
            aria-hidden={phase !== "playing"}
          >
            5
          </span>

          <div
            ref={readyRef}
            className="home-intro-ready absolute px-6 text-center opacity-0"
          >
            <p className="home-intro-ready-line font-display text-[clamp(2.5rem,12vw,7rem)] font-black uppercase leading-none tracking-tight">
              {t("readyLine1")}
            </p>
            <p className="home-intro-ready-line home-intro-ready-accent mt-2 font-display text-[clamp(2rem,10vw,5.5rem)] font-black uppercase leading-none tracking-tight">
              {t("readyLine2")}
            </p>
          </div>

          <div
            ref={warriorRef}
            className="home-intro-warrior absolute flex w-[min(88vw,420px)] flex-col items-center opacity-0"
          >
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border-4 border-white/20 shadow-[0_0_60px_rgba(255,42,26,0.35)]">
              <Image
                src={assetPath("/images/greek-warrior-intro.webp")}
                alt={t("warriorAlt")}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 768px) 88vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            </div>
            <p className="mt-5 font-mono-tech text-xs tracking-[0.35em] text-white/70">
              {t("warriorCaption")}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
