"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ProjectsVisual } from "./ProjectsVisual";
import { ProjectsTimeline } from "./ProjectsTimeline";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectsPageClientProps {
  projects: Project[];
  timeline: Record<number, Record<number, Project[]>>;
}

export function ProjectsPageClient({ projects, timeline }: ProjectsPageClientProps) {
  const t = useTranslations("projects");
  const [mode, setMode] = useState<"visual" | "timeline">("visual");

  return (
    <div className="pt-32 pb-24 px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <span className="font-mono-tech text-xs text-accent">PROJECTS</span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl font-bold tracking-tight">
          {t("title")}
        </h1>

        <div className="mt-10 flex gap-2">
          {(["visual", "timeline"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "btn-toggle font-mono-tech tracking-widest",
                mode === m && "btn-toggle-active"
              )}
            >
              {t(m)}
            </button>
          ))}
        </div>

        <div className="mt-12">
          {mode === "visual" ? (
            <ProjectsVisual projects={projects} />
          ) : (
            <ProjectsTimeline timeline={timeline} />
          )}
        </div>
      </div>
    </div>
  );
}
