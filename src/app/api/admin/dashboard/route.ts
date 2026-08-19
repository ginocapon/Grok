import { NextResponse } from "next/server";
import { getContacts, getProjects, getBlogArticles } from "@/lib/cms";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  const authHeader = process.env.ADMIN_SECRET;
  if (!authHeader) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }

  const [projects, articles, contacts] = await Promise.all([
    getProjects(),
    getBlogArticles(),
    getContacts(),
  ]);

  let analyticsCount = 0;
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", "analytics.json"), "utf-8");
    analyticsCount = JSON.parse(raw).length;
  } catch {
    analyticsCount = 0;
  }

  return NextResponse.json({
    projects: { total: projects.length, published: projects.filter((p) => p.published).length },
    articles: { total: articles.length, published: articles.filter((a) => a.published).length },
    contacts: { total: contacts.length, new: contacts.filter((c) => c.status === "new").length },
    analytics: { events: analyticsCount },
  });
}
