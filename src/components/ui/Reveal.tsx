"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: RevealProps) {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const timer = setTimeout(() => setVisible(true), reducedMotion ? 0 : delay);
    return () => clearTimeout(timer);
  }, [delay, reducedMotion]);

  const transforms = {
    up: visible ? "translateY(0)" : "translateY(32px)",
    left: visible ? "translateX(0)" : "translateX(-32px)",
    right: visible ? "translateX(0)" : "translateX(32px)",
  };

  return (
    <div
      className={cn(className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: reducedMotion ? "none" : transforms[direction],
        transition: reducedMotion
          ? "none"
          : `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = (node: HTMLDivElement | null) => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
  };

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      {children}
    </div>
  );
}
