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
