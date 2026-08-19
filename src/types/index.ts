export type Locale = "en" | "it";
export type TranslationStatus = "draft" | "published" | "needs_review";

export type ProjectCategory =
  | "commercial"
  | "brand-film"
  | "fashion"
  | "music"
  | "social"
  | "events"
  | "short-film"
  | "experimental";

export type BlogCategory =
  | "filmmaking"
  | "cameras"
  | "gear"
  | "lighting"
  | "editing"
  | "color-grading"
  | "audio"
  | "ai"
  | "video-marketing"
  | "social-video"
  | "behind-the-scenes"
  | "case-studies"
  | "creative-process";

export interface LocalizedField {
  en: string;
  it: string;
  translationStatus?: TranslationStatus;
  lastTranslated?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: LocalizedField;
  description: LocalizedField;
  client: string | null;
  year: number;
  month: number;
  date: string;
  category: ProjectCategory;
  role: string | null;
  featured: boolean;
  displayOrder: number;
  published: boolean;
  heroImage: string | null;
  heroVideo: string | null;
  previewVideo: string | null;
  gallery: string[];
  bts: string[];
  caseStudy: LocalizedField;
  services: string[];
  credits: { role: string; name: string }[];
  equipment: string[];
  software: string[];
  seo: SeoFields;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: LocalizedField;
  subtitle: LocalizedField;
  excerpt: LocalizedField;
  content: LocalizedField;
  featuredImage: string | null;
  cartoonImage: string | null;
  author: string;
  category: BlogCategory;
  tags: string[];
  featured: boolean;
  displayOrder: number;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  seo: SeoFields;
}

export interface SeoFields {
  title: string;
  description: string;
  canonical: string;
  ogImage: string | null;
  socialTitle: string;
  socialDescription: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  projectType: string | null;
  budget: string | null;
  timeline: string | null;
  message: string;
  gdprConsent: boolean;
  locale: Locale;
  createdAt: string;
  status: "new" | "read" | "replied" | "archived";
}

export interface SiteSettings {
  hero: {
    videoUrl: string | null;
    posterUrl: string | null;
    headline: LocalizedField;
    subheadline: LocalizedField;
    ctaPrimary: LocalizedField;
    ctaSecondary: LocalizedField;
  };
  intro: LocalizedField;
  aboutPreview: LocalizedField;
  contactHeadline: LocalizedField;
  contactSubheadline: LocalizedField;
  footer: {
    name: string;
    role: LocalizedField;
    email: string;
    location: string | null;
    social: { platform: string; url: string }[];
  };
}

export interface AnalyticsEvent {
  type:
    | "page_view"
    | "project_click"
    | "article_click"
    | "video_start"
    | "video_complete"
    | "cta_click"
    | "scroll_depth"
    | "contact_submit";
  path: string;
  locale: Locale;
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
}

export interface GrokInsight {
  insight: string;
  dataSource: string;
  confidence: number;
  reason: string;
  recommendation: string;
}

export interface GrokProposal {
  id: string;
  idea: string;
  source: string;
  why: string;
  brandFit: number;
  technicalCost: number;
  performanceImpact: number;
  risk: string;
  recommendation: string;
  scores: {
    creativeValue: number;
    brandFit: number;
    uxValue: number;
    technicalFeasibility: number;
    performanceCost: number;
    accessibilityRisk: number;
    seoRisk: number;
    maintenanceCost: number;
  };
  level: 1 | 2 | 3;
  status: "pending" | "approved" | "rejected" | "implemented";
  createdAt: string;
}
