"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Lenis with native-like tuning: real touch scroll on mobile, wheel multiplier 1,
 * subtle lerp. Disabled when prefers-reduced-motion is set.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      syncTouch: false,
      autoRaf: true,
    });

    lenisRef.current = lenis;

    const onMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };

    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
