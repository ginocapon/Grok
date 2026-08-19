import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin/auth";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const MAX_SIZE = 100 * 1024 * 1024;

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) return adminUnauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 100MB)" }, { status: 400 });
    }

    const safeFolder = folder.replace(/[^a-z0-9-]/gi, "");
    const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const isImage = file.type.startsWith("image/") && file.type !== "image/gif";

    let filename: string;
    let outBuffer: Buffer;

    if (isImage) {
      filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
      outBuffer = await sharp(buffer)
        .rotate()
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
    } else {
      const ext = path.extname(file.name) || (file.type.startsWith("video/") ? ".mp4" : ".webp");
      filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      outBuffer = buffer;
    }

    await writeFile(path.join(uploadDir, filename), outBuffer);

    const url = `/uploads/${safeFolder}/${filename}`;
    return NextResponse.json({ url, filename, type: isImage ? "image/webp" : file.type, size: outBuffer.length });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
