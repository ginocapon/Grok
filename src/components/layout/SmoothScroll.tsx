"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SCROLL_EASE = 0.085;
const SCROLL_STOP_THRESHOLD = 0.5;

function getMaxScrollY(): number {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function clampScroll(y: number): number {
  return Math.max(0, Math.min(getMaxScrollY(), y));
}

function isScrollableAncestor(el: Element | null): boolean {
  while (el && el !== document.documentElement) {
    const { overflowY } = getComputedStyle(el);
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") {
      if (el.scrollHeight > el.clientHeight) return true;
    }
    el = el.parentElement;
  }
  return false;
}

function shouldSkipSmoothScroll(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  if (target.closest("[data-native-scroll], textarea, select, [contenteditable='true']")) {
    return true;
  }
  return isScrollableAncestor(target);
}

/**
 * Lightweight inertia-style scroll on wheel/keyboard. No third-party library.
 * Touch and scrollbar drag stay native; position is synced when not animating.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let rafId: number | null = null;

    const syncFromWindow = () => {
      targetY = window.scrollY;
      currentY = window.scrollY;
    };

    const animate = () => {
      const delta = targetY - currentY;
      if (Math.abs(delta) < SCROLL_STOP_THRESHOLD) {
        currentY = targetY;
        window.scrollTo(0, currentY);
        rafId = null;
        return;
      }
      currentY += delta * SCROLL_EASE;
      window.scrollTo(0, currentY);
      rafId = requestAnimationFrame(animate);
    };

    const schedule = () => {
      if (rafId === null) rafId = requestAnimationFrame(animate);
    };

    const addDelta = (delta: number) => {
      targetY = clampScroll(targetY + delta);
      schedule();
    };

    const onWheel = (e: WheelEvent) => {
      if (shouldSkipSmoothScroll(e.target)) return;
      e.preventDefault();
      addDelta(e.deltaY);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (shouldSkipSmoothScroll(e.target)) return;

      const pageStep = window.innerHeight * 0.85;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          addDelta(56);
          break;
        case "ArrowUp":
          e.preventDefault();
          addDelta(-56);
          break;
        case "PageDown":
          e.preventDefault();
          addDelta(pageStep);
          break;
        case "PageUp":
          e.preventDefault();
          addDelta(-pageStep);
          break;
        case " ": {
          if (e.target instanceof Element) {
            const tag = e.target.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
          }
          e.preventDefault();
          addDelta(e.shiftKey ? -pageStep : pageStep);
          break;
        }
        case "Home":
          e.preventDefault();
          targetY = 0;
          schedule();
          break;
        case "End":
          e.preventDefault();
          targetY = getMaxScrollY();
          schedule();
          break;
      }
    };

    const onScroll = () => {
      if (rafId === null) syncFromWindow();
    };

    const onResize = () => {
      targetY = clampScroll(targetY);
    };

    const onMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
        syncFromWindow();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      reducedMotion.removeEventListener("change", onMotionChange);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return null;
}
