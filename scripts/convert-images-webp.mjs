/**
 * Converte PNG/JPG in public/ → WebP (max width 1920, quality 82).
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const publicDir = path.join(process.cwd(), "public");
const exts = new Set([".png", ".jpg", ".jpeg"]);

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (exts.has(path.extname(entry.name).toLowerCase())) await convert(full);
  }
}

async function convert(filePath) {
  const ext = path.extname(filePath);
  const outPath = filePath.slice(0, -ext.length) + ".webp";
  const before = fs.statSync(filePath).size;

  await sharp(filePath)
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(outPath);

  const after = fs.statSync(outPath).size;
  fs.unlinkSync(filePath);
  console.log(
    `${path.relative(publicDir, filePath)} → ${path.basename(outPath)} (${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB)`
  );
}

await walk(publicDir);
console.log("Conversione WebP completata.");
