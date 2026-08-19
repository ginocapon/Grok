/** Converte immagini in WebP nel browser (admin GitHub Pages). */
export async function prepareImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/webp" || file.type === "image/gif") {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const maxWidth = 1920;
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.82)
  );
  if (!blob) return file;

  const base = file.name.replace(/\.[^.]+$/, "") || "upload";
  return new File([blob], `${base}.webp`, { type: "image/webp" });
}
