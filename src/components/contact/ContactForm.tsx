"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Button3D } from "@/components/ui/Button3D";
import { ScrollReveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  compact?: boolean;
}

export function ContactForm({ compact = false }: ContactFormProps) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [gdpr, setGdpr] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!gdpr) return;

    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      company: data.get("company") || "",
      projectType: data.get("projectType") || "",
      budget: data.get("budget") || "",
      timeline: data.get("timeline") || "",
      message: data.get("message"),
      locale,
    };

    try {
      const isStaticHost = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";
      const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@grok.film";

      const res = isStaticHost
        ? await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              ...payload,
              _subject: "Grok — Nuovo messaggio dal sito",
              _template: "table",
            }),
          })
        : await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, gdprConsent: gdpr }),
          });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      form.reset();
      setGdpr(false);
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent focus:outline-none transition-colors min-h-[44px]";

  const labelClass = "font-mono-tech text-xs tracking-widest text-text-secondary mb-2 block";

  if (status === "success") {
    return (
      <div className="rounded-sm border border-accent/30 bg-surface p-8 md:p-12 text-center">
        <p className="font-display text-2xl md:text-3xl font-bold text-text-primary">
          {t("success")}
        </p>
      </div>
    );
  }

  return (
    <ScrollReveal>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className={cn("grid gap-6", compact ? "md:grid-cols-2" : "md:grid-cols-2")}>
          <div>
            <label htmlFor="name" className={labelClass}>{t("name")}</label>
            <input id="name" name="name" type="text" required className={inputClass} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>{t("email")}</label>
            <input id="email" name="email" type="email" required className={inputClass} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="company" className={labelClass}>{t("company")}</label>
            <input id="company" name="company" type="text" className={inputClass} />
          </div>
          <div>
            <label htmlFor="projectType" className={labelClass}>{t("projectType")}</label>
            <input id="projectType" name="projectType" type="text" className={inputClass} />
          </div>
          {!compact && (
            <>
              <div>
                <label htmlFor="budget" className={labelClass}>{t("budget")}</label>
                <input id="budget" name="budget" type="text" className={inputClass} />
              </div>
              <div>
                <label htmlFor="timeline" className={labelClass}>{t("timeline")}</label>
                <input id="timeline" name="timeline" type="text" className={inputClass} />
              </div>
            </>
          )}
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>{t("message")}</label>
          <textarea
            id="message"
            name="message"
            required
            rows={compact ? 4 : 6}
            className={cn(inputClass, "resize-y min-h-[120px]")}
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
          <input
            type="checkbox"
            checked={gdpr}
            onChange={(e) => setGdpr(e.target.checked)}
            required
            className="mt-1 h-4 w-4 accent-accent"
          />
          <span className="text-sm text-text-secondary">{t("gdpr")}</span>
        </label>

        {status === "error" && (
          <p className="text-sm text-accent" role="alert">{t("error")}</p>
        )}

        <Button3D
          variant="primary"
          type="submit"
          disabled={status === "loading" || !gdpr}
          className={cn(status === "loading" && "opacity-60 pointer-events-none")}
        >
          {status === "loading" ? t("sending") : t("submit")}
        </Button3D>
      </form>
    </ScrollReveal>
  );
}
