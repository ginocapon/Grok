import Image, { type ImageProps } from "next/image";
import { assetPath } from "@/lib/asset-path";

export function SiteImage({ src, ...props }: ImageProps) {
  const resolvedSrc = typeof src === "string" ? assetPath(src) : src;
  return <Image src={resolvedSrc} {...props} />;
}
