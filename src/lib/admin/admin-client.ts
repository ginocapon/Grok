import type { BlogArticle, Project } from "@/types";
import {
  isPagesAdmin,
  readJsonFile,
  writeJsonFile,
  uploadPublicFile,
  getGitHubToken,
  clearGitHubToken,
  setGitHubToken,
  isPagesSessionSaved,
  setPagesSession,
} from "@/lib/admin/github-storage";
import { slugify } from "@/lib/admin/slugify";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "grok-admin";

export class AdminAuthError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "AdminAuthError";
  }
}

export function isAdminSessionActive(): boolean {
  if (typeof window === "undefined") return false;
  if (!isPagesAdmin()) return false;
  return isPagesSessionSaved() && !!getGitHubToken();
}

export function startPagesAdminSession(password: string, githubToken: string): boolean {
  if (password !== ADMIN_PASSWORD) return false;
  const token = githubToken.trim();
  if (!token) return false;
  setGitHubToken(token, true);
  setPagesSession(true);
  return true;
}

export function clearAdminSession() {
  setPagesSession(false);
  clearGitHubToken();
}

async function localFetch(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });
}

export async function adminLoadProjects(): Promise<Project[]> {
  if (isPagesAdmin()) {
    if (!isAdminSessionActive()) throw new AdminAuthError();
    return readJsonFile<Project[]>("data/projects.json");
  }
  const res = await localFetch("/api/admin/projects");
  if (res.status === 401) throw new AdminAuthError();
  if (!res.ok) throw new Error("Failed to load projects");
  return res.json();
}

export async function adminLoadArticles(): Promise<BlogArticle[]> {
  if (isPagesAdmin()) {
    if (!isAdminSessionActive()) throw new AdminAuthError();
    return readJsonFile<BlogArticle[]>("data/blog-articles.json");
  }
  const res = await localFetch("/api/admin/blog");
  if (res.status === 401) throw new AdminAuthError();
  if (!res.ok) throw new Error("Failed to load articles");
  return res.json();
}

export async function adminSaveProject(form: Partial<Project>): Promise<void> {
  if (isPagesAdmin()) {
    const projects = await readJsonFile<Project[]>("data/projects.json");
    if (form.id) {
      const index = projects.findIndex((p) => p.id === form.id);
      if (index === -1) throw new Error("Progetto non trovato");
      projects[index] = { ...projects[index], ...form, id: form.id } as Project;
    } else {
      const project: Project = {
        id: crypto.randomUUID(),
        slug: form.slug || slugify(form.title?.en || "project"),
        title: form.title || { en: "", it: "" },
        description: form.description || { en: "", it: "" },
        client: form.client ?? null,
        year: form.year ?? new Date().getFullYear(),
        month: form.month ?? new Date().getMonth() + 1,
        date: form.date ?? new Date().toISOString().split("T")[0],
        category: form.category ?? "commercial",
        role: form.role ?? "Director · Editor",
        featured: form.featured ?? false,
        displayOrder: form.displayOrder ?? projects.length + 1,
        published: form.published ?? false,
        heroImage: form.heroImage ?? null,
        heroVideo: form.heroVideo ?? null,
        previewVideo: form.previewVideo ?? null,
        gallery: form.gallery ?? [],
        bts: form.bts ?? [],
        caseStudy: form.caseStudy || { en: "", it: "" },
        services: form.services ?? [],
        credits: form.credits ?? [],
        equipment: form.equipment ?? [],
        software: form.software ?? [],
        seo: form.seo || {
          title: "",
          description: "",
          canonical: "",
          ogImage: null,
          socialTitle: "",
          socialDescription: "",
        },
      };
      projects.push(project);
    }
    await writeJsonFile("data/projects.json", projects, "Admin: update projects");
    return;
  }

  const res = form.id
    ? await localFetch(`/api/admin/projects/${form.id}`, { method: "PUT", body: JSON.stringify(form) })
    : await localFetch("/api/admin/projects", { method: "POST", body: JSON.stringify(form) });
  if (res.status === 401) throw new AdminAuthError();
  if (!res.ok) throw new Error("Salvataggio progetto fallito");
}

export async function adminDeleteProject(id: string): Promise<void> {
  if (isPagesAdmin()) {
    const projects = await readJsonFile<Project[]>("data/projects.json");
    await writeJsonFile(
      "data/projects.json",
      projects.filter((p) => p.id !== id),
      "Admin: delete project"
    );
    return;
  }
  const res = await localFetch(`/api/admin/projects/${id}`, { method: "DELETE" });
  if (res.status === 401) throw new AdminAuthError();
  if (!res.ok) throw new Error("Eliminazione fallita");
}

export async function adminSaveArticle(form: Partial<BlogArticle>): Promise<void> {
  if (isPagesAdmin()) {
    const articles = await readJsonFile<BlogArticle[]>("data/blog-articles.json");
    const now = new Date().toISOString();
    if (form.id) {
      const index = articles.findIndex((a) => a.id === form.id);
      if (index === -1) throw new Error("Articolo non trovato");
      articles[index] = { ...articles[index], ...form, id: form.id, updatedAt: now } as BlogArticle;
    } else {
      const article: BlogArticle = {
        id: crypto.randomUUID(),
        slug: form.slug || slugify(form.title?.en || "article"),
        title: form.title || { en: "", it: "" },
        subtitle: form.subtitle || { en: "", it: "" },
        excerpt: form.excerpt || { en: "", it: "" },
        content: form.content || { en: "", it: "" },
        featuredImage: form.featuredImage ?? null,
        cartoonImage: form.cartoonImage ?? null,
        author: form.author ?? "Grok",
        category: form.category ?? "filmmaking",
        tags: form.tags ?? [],
        featured: form.featured ?? false,
        displayOrder: form.displayOrder ?? articles.length + 1,
        published: form.published ?? false,
        publishedAt: form.publishedAt ?? now,
        updatedAt: now,
        readingTimeMinutes: form.readingTimeMinutes ?? 5,
        seo: form.seo || {
          title: "",
          description: "",
          canonical: "",
          ogImage: null,
          socialTitle: "",
          socialDescription: "",
        },
      };
      articles.push(article);
    }
    await writeJsonFile("data/blog-articles.json", articles, "Admin: update blog");
    return;
  }

  const res = form.id
    ? await localFetch(`/api/admin/blog/${form.id}`, { method: "PUT", body: JSON.stringify(form) })
    : await localFetch("/api/admin/blog", { method: "POST", body: JSON.stringify(form) });
  if (res.status === 401) throw new AdminAuthError();
  if (!res.ok) throw new Error("Salvataggio articolo fallito");
}

export async function adminDeleteArticle(id: string): Promise<void> {
  if (isPagesAdmin()) {
    const articles = await readJsonFile<BlogArticle[]>("data/blog-articles.json");
    await writeJsonFile(
      "data/blog-articles.json",
      articles.filter((a) => a.id !== id),
      "Admin: delete article"
    );
    return;
  }
  const res = await localFetch(`/api/admin/blog/${id}`, { method: "DELETE" });
  if (res.status === 401) throw new AdminAuthError();
  if (!res.ok) throw new Error("Eliminazione fallita");
}

export async function adminUploadFile(folder: string, file: File): Promise<string> {
  if (isPagesAdmin()) {
    const result = await uploadPublicFile(folder, file);
    return result.url;
  }
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await localFetch("/api/admin/upload", { method: "POST", body: fd });
  if (res.status === 401) throw new AdminAuthError();
  if (!res.ok) throw new Error("Upload fallito");
  const data = await res.json();
  return data.url as string;
}

export async function adminLoginLocal(password: string): Promise<boolean> {
  const res = await fetch("/api/admin/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
    credentials: "include",
  });
  return res.ok;
}

export async function adminLogoutLocal(): Promise<void> {
  await localFetch("/api/admin/auth", { method: "DELETE" });
}
