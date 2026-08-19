"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Timecode() {
  const [time, setTime] = useState("00:00:00:00");

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const h = Math.floor(elapsed / 3600);
      const m = Math.floor((elapsed % 3600) / 60);
      const s = Math.floor(elapsed % 60);
      const f = Math.floor((elapsed % 1) * 24);
      setTime(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`
      );
    }, 42);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-mono-tech text-xs text-text-secondary tabular-nums">
      {time}
    </span>
  );
}

interface FilmMetaProps {
  className?: string;
  rec?: string;
  fps?: string;
  take?: string;
}

export function FilmMeta({ className, rec = "REC", fps = "24 FPS", take = "TAKE 01" }: FilmMetaProps) {
  const [blinking, setBlinking] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setBlinking((b) => !b), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("flex items-center gap-4 font-mono-tech text-xs", className)}>
      <span className="flex items-center gap-1.5">
        <span
          className={cn(
            "inline-block h-2 w-2 rounded-full bg-accent",
            blinking && "opacity-100",
            !blinking && "opacity-30"
          )}
        />
        <span className="text-accent">{rec}</span>
      </span>
      <span className="text-text-secondary">{fps}</span>
      <span className="text-text-secondary">{take}</span>
      <Timecode />
    </div>
  );
}

const GROK_KEYS = ["g", "r", "o", "k"] as const;

interface GrokStripProps {
  className?: string;
  label?: string;
  words: Record<(typeof GROK_KEYS)[number], string>;
}

export function GrokStrip({ className, label = "GROK", words }: GrokStripProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActive((i) => (i + 1) % GROK_KEYS.length), 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 font-mono-tech text-xs", className)}
      aria-label={`${label} — ${words.g}, ${words.r}, ${words.o}, ${words.k}`}
    >
      <span className="text-text-secondary">{label}</span>
      <span className="flex items-center gap-2">
        {GROK_KEYS.map((key, index) => (
          <span key={key} className="flex items-center gap-2">
            {index > 0 && <span className="text-text-secondary/40">→</span>}
            <span
              className={cn(
                "font-bold tracking-widest transition-colors duration-300",
                active === index ? "text-accent" : "text-text-secondary"
              )}
            >
              {key.toUpperCase()}
            </span>
          </span>
        ))}
      </span>
      <span className="text-text-secondary/80 hidden sm:inline tabular-nums">
        — {words[GROK_KEYS[active]]}
      </span>
    </div>
  );
}
