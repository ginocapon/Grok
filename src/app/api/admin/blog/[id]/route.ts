import { NextRequest, NextResponse } from "next/server";
import { getBlogArticles, saveBlogArticles } from "@/lib/cms";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  if (!verifyAdmin(request)) return adminUnauthorized();

  const { id } = await params;
  const body = await request.json();
  const articles = await getBlogArticles();
  const index = articles.findIndex((a) => a.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  articles[index] = {
    ...articles[index],
    ...body,
    id,
    updatedAt: new Date().toISOString(),
  };
  await saveBlogArticles(articles);
  return NextResponse.json(articles[index]);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!verifyAdmin(request)) return adminUnauthorized();

  const { id } = await params;
  const articles = await getBlogArticles();
  const filtered = articles.filter((a) => a.id !== id);

  if (filtered.length === articles.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await saveBlogArticles(filtered);
  return NextResponse.json({ success: true });
}
