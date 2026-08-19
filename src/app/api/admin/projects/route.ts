import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects } from "@/lib/cms";
import { verifyAdmin, adminUnauthorized, slugify } from "@/lib/admin/auth";
import type { Project } from "@/types";

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) return adminUnauthorized();
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) return adminUnauthorized();

  try {
    const body = await request.json();
    const projects = await getProjects();

    const project: Project = {
      id: crypto.randomUUID(),
      slug: body.slug || slugify(body.title?.en || "project"),
      title: body.title || { en: "", it: "" },
      description: body.description || { en: "", it: "" },
      client: body.client ?? null,
      year: body.year ?? new Date().getFullYear(),
      month: body.month ?? new Date().getMonth() + 1,
      date: body.date ?? new Date().toISOString().split("T")[0],
      category: body.category ?? "commercial",
      role: body.role ?? "Director · Editor",
      featured: body.featured ?? false,
      displayOrder: body.displayOrder ?? projects.length + 1,
      published: body.published ?? false,
      heroImage: body.heroImage ?? null,
      heroVideo: body.heroVideo ?? null,
      previewVideo: body.previewVideo ?? null,
      gallery: body.gallery ?? [],
      bts: body.bts ?? [],
      caseStudy: body.caseStudy || { en: "", it: "" },
      services: body.services ?? [],
      credits: body.credits ?? [],
      equipment: body.equipment ?? [],
      software: body.software ?? [],
      seo: body.seo || {
        title: "",
        description: "",
        canonical: "",
        ogImage: null,
        socialTitle: "",
        socialDescription: "",
      },
    };

    projects.push(project);
    await saveProjects(projects);
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
