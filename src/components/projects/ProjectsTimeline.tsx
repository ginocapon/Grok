"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getLocalized } from "@/lib/i18n-content";
import { MONTH_NAMES } from "@/lib/constants";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectsTimelineProps {
  timeline: Record<number, Record<number, Project[]>>;
}

export function ProjectsTimeline({ timeline }: ProjectsTimelineProps) {
  const t = useTranslations("projects");
  const locale = useLocale() as "en" | "it";
  const years = Object.keys(timeline).map(Number).sort((a, b) => b - a);
  const [activeYear, setActiveYear] = useState(years[0] ?? new Date().getFullYear());

  const months = timeline[activeYear]
    ? Object.keys(timeline[activeYear]).map(Number).sort((a, b) => b - a)
    : [];

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-3 lg:sticky lg:top-32 lg:self-start">
        <p className="font-mono-tech text-xs text-accent mb-6">TIMELINE</p>
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setActiveYear(year)}
              className={cn(
                "font-display text-3xl md:text-4xl font-bold px-4 py-2 min-h-[44px] text-left transition-colors whitespace-nowrap",
                activeYear === year ? "text-accent" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-9 space-y-16">
        {months.length === 0 ? (
          <p className="font-mono-tech text-sm text-text-secondary">{t("empty")}</p>
        ) : (
          months.map((month) => (
            <div key={month}>
              <h3 className="font-mono-tech text-sm text-accent mb-6 sticky top-24 bg-bg/90 backdrop-blur-sm py-2">
                {MONTH_NAMES[locale][month - 1]}
              </h3>
              <div className="space-y-4">
                {timeline[activeYear][month].map((project) => (
                  <Link
                    key={project.id}
                    href={{ pathname: "/projects/[slug]", params: { slug: project.slug } }}
                    className="group flex gap-6 items-center p-4 rounded-sm border border-white/5 hover:border-accent/30 transition-all"
                  >
                    <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-sm bg-surface-2">
                      {project.heroImage && (
                        <Image
                          src={project.heroImage}
                          alt={getLocalized(project.title, locale)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="128px"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-bold group-hover:text-accent transition-colors">
                        {getLocalized(project.title, locale)}
                      </h4>
                      <p className="font-mono-tech text-xs text-text-secondary mt-1">
                        {project.client ?? "—"} · {project.year}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
