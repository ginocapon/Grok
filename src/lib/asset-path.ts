const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix local public asset paths for GitHub Pages (e.g. /Grok/uploads/...). */
export function assetPath(src: string | null | undefined): string {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;

  const path = src.startsWith("/") ? src : `/${src}`;
  return `${basePath}${path}`;
}
