import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSiteSettings, getLocalized } from "@/lib/cms";

export async function Footer() {
  const t = await getTranslations("footer");
  const locale = (await getLocale()) as "en" | "it";
  const settings = await getSiteSettings();

  return (
    <footer className="border-t border-white/5 bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-bold">{settings.footer.name}</p>
            <p className="mt-2 text-sm text-text-secondary">
              {getLocalized(settings.footer.role, locale)}
            </p>
            <a
              href={`mailto:${settings.footer.email}`}
              className="mt-4 inline-block text-sm text-accent hover:text-accent-light transition-colors"
            >
              {settings.footer.email}
            </a>
            {settings.footer.location && (
              <p className="mt-1 text-sm text-text-secondary">{settings.footer.location}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/privacy" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              {t("privacy")}
            </Link>
            <Link href="/cookies" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              {t("cookies")}
            </Link>
            <Link href="/digital-transparency" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              {t("transparency")}
            </Link>
          </div>

          <div className="md:text-right">
            {settings.footer.social.length > 0 && (
              <div className="flex md:justify-end gap-4 mb-6">
                {settings.footer.social.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
            <p className="font-mono-tech text-xs text-text-secondary">{t("tagline")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
