import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects } from "@/lib/cms";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  if (!verifyAdmin(request)) return adminUnauthorized();

  const { id } = await params;
  const body = await request.json();
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  projects[index] = { ...projects[index], ...body, id };
  await saveProjects(projects);
  return NextResponse.json(projects[index]);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!verifyAdmin(request)) return adminUnauthorized();

  const { id } = await params;
  const projects = await getProjects();
  const filtered = projects.filter((p) => p.id !== id);

  if (filtered.length === projects.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await saveProjects(filtered);
  return NextResponse.json({ success: true });
}
