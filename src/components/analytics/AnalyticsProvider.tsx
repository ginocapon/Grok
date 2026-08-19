"use client";

import { useEffect } from "react";
import type { Locale } from "@/types";

interface AnalyticsProviderProps {
  children: React.ReactNode;
  locale: Locale;
}

export function AnalyticsProvider({ children, locale }: AnalyticsProviderProps) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") return;

    const path = window.location.pathname;
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "page_view",
        path,
        locale,
        metadata: {
          referrer: document.referrer || "direct",
          device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
        },
      }),
    }).catch(() => {});
  }, [locale]);

  return <>{children}</>;
}

export function trackEvent(
  type: string,
  path: string,
  locale: Locale,
  metadata?: Record<string, string | number | boolean>
) {
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, path, locale, metadata }),
  }).catch(() => {});
}
