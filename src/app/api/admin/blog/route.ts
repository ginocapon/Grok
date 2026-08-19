import { NextRequest, NextResponse } from "next/server";
import { getBlogArticles, saveBlogArticles } from "@/lib/cms";
import { verifyAdmin, adminUnauthorized, slugify } from "@/lib/admin/auth";
import type { BlogArticle } from "@/types";

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) return adminUnauthorized();
  const articles = await getBlogArticles();
  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) return adminUnauthorized();

  try {
    const body = await request.json();
    const articles = await getBlogArticles();
    const now = new Date().toISOString();

    const article: BlogArticle = {
      id: crypto.randomUUID(),
      slug: body.slug || slugify(body.title?.en || "article"),
      title: body.title || { en: "", it: "" },
      subtitle: body.subtitle || { en: "", it: "" },
      excerpt: body.excerpt || { en: "", it: "" },
      content: body.content || { en: "", it: "" },
      featuredImage: body.featuredImage ?? null,
      cartoonImage: body.cartoonImage ?? null,
      author: body.author ?? "Grok",
      category: body.category ?? "filmmaking",
      tags: body.tags ?? [],
      featured: body.featured ?? false,
      displayOrder: body.displayOrder ?? articles.length + 1,
      published: body.published ?? false,
      publishedAt: body.publishedAt ?? now,
      updatedAt: now,
      readingTimeMinutes: body.readingTimeMinutes ?? 5,
      seo: body.seo || {
        title: "",
        description: "",
        canonical: "",
        ogImage: null,
        socialTitle: "",
        socialDescription: "",
      },
    };

    articles.push(article);
    await saveBlogArticles(articles);
    return NextResponse.json(article, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
