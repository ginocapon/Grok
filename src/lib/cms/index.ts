import fs from "fs/promises";
import path from "path";
import type { BlogArticle, ContactSubmission, Project, SiteSettings } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return readJson<SiteSettings>("site-settings.json");
}

export async function getProjects(): Promise<Project[]> {
  return readJson<Project[]>("projects.json");
}

export async function getPublishedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const projects = await getPublishedProjects();
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug && p.published);
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const projects = await getPublishedProjects();
  if (category === "all") return projects;
  return projects.filter((p) => p.category === category);
}

export async function getProjectsTimeline(): Promise<
  Record<number, Record<number, Project[]>>
> {
  const projects = await getPublishedProjects();
  const timeline: Record<number, Record<number, Project[]>> = {};

  for (const project of projects) {
    if (!timeline[project.year]) timeline[project.year] = {};
    if (!timeline[project.year][project.month]) timeline[project.year][project.month] = [];
    timeline[project.year][project.month].push(project);
  }

  return timeline;
}

export async function getBlogArticles(): Promise<BlogArticle[]> {
  return readJson<BlogArticle[]>("blog-articles.json");
}

export async function getPublishedArticles(): Promise<BlogArticle[]> {
  const articles = await getBlogArticles();
  return articles
    .filter((a) => a.published)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getFeaturedArticles(limit = 6): Promise<BlogArticle[]> {
  const articles = await getPublishedArticles();
  return articles
    .filter((a) => a.featured)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, limit);
}

export async function getArticleBySlug(slug: string): Promise<BlogArticle | undefined> {
  const articles = await getBlogArticles();
  return articles.find((a) => a.slug === slug && a.published);
}

export async function getArticlesTimeline(): Promise<
  Record<number, Record<number, BlogArticle[]>>
> {
  const articles = await getPublishedArticles();
  const timeline: Record<number, Record<number, BlogArticle[]>> = {};

  for (const article of articles) {
    const date = new Date(article.publishedAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    if (!timeline[year]) timeline[year] = {};
    if (!timeline[year][month]) timeline[year][month] = [];
    timeline[year][month].push(article);
  }

  return timeline;
}

export async function saveContactSubmission(
  submission: Omit<ContactSubmission, "id" | "createdAt" | "status">
): Promise<ContactSubmission> {
  const contacts = await readJson<ContactSubmission[]>("contacts.json");
  const newContact: ContactSubmission = {
    ...submission,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
  };
  contacts.push(newContact);
  await writeJson("contacts.json", contacts);
  return newContact;
}

export async function getContacts(): Promise<ContactSubmission[]> {
  return readJson<ContactSubmission[]>("contacts.json");
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await writeJson("projects.json", projects);
}

export async function saveBlogArticles(articles: BlogArticle[]): Promise<void> {
  await writeJson("blog-articles.json", articles);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id);
}

export async function getArticleById(id: string): Promise<BlogArticle | undefined> {
  const articles = await getBlogArticles();
  return articles.find((a) => a.id === id);
}

export { getLocalized } from "@/lib/i18n-content";
export { MONTH_NAMES } from "@/lib/constants";
