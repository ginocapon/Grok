-- Supabase schema for production CMS migration
-- Run when connecting Supabase

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_it TEXT,
  description_en TEXT,
  description_it TEXT,
  client TEXT,
  year INT NOT NULL,
  month INT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  role TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT false,
  hero_image TEXT,
  hero_video TEXT,
  preview_video TEXT,
  gallery JSONB DEFAULT '[]',
  bts JSONB DEFAULT '[]',
  case_study_en TEXT,
  case_study_it TEXT,
  services JSONB DEFAULT '[]',
  credits JSONB DEFAULT '[]',
  equipment JSONB DEFAULT '[]',
  software JSONB DEFAULT '[]',
  seo JSONB DEFAULT '{}',
  translation_status TEXT DEFAULT 'draft',
  last_translated TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_it TEXT,
  subtitle_en TEXT,
  subtitle_it TEXT,
  excerpt_en TEXT,
  excerpt_it TEXT,
  content_en TEXT,
  content_it TEXT,
  featured_image TEXT,
  author TEXT DEFAULT 'Grok',
  category TEXT NOT NULL,
  tags JSONB DEFAULT '[]',
  featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  reading_time_minutes INT DEFAULT 5,
  seo JSONB DEFAULT '{}',
  translation_status TEXT DEFAULT 'draft',
  last_translated TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  project_type TEXT,
  budget TEXT,
  timeline TEXT,
  message TEXT NOT NULL,
  gdpr_consent BOOLEAN NOT NULL,
  locale TEXT DEFAULT 'en',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  path TEXT NOT NULL,
  locale TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "Public read published projects" ON projects FOR SELECT USING (published = true);
CREATE POLICY "Public read published articles" ON blog_articles FOR SELECT USING (published = true);
