export function getLocalized<T extends { en: string; it: string }>(
  field: T,
  locale: "en" | "it"
): string {
  return locale === "it" && field.it ? field.it : field.en;
}
