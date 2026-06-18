import {
  getRatgeberExcerpt as getStaticRatgeberExcerpt,
  ratgeberArticles,
  ratgeberMeta,
  type RatgeberArticle,
} from "@/data/ratgeber";
import { createPublicClient } from "@/lib/supabase/public";

type BlogPostRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  body_md: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author: string | null;
  category: string | null;
  tags: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  published: boolean;
  published_at: string | null;
};

export type RatgeberPost = {
  slug: string;
  title: string;
  meta: { title: string; description: string };
  imageSrc: string;
  imageAlt: string;
  excerpt: string;
  bodyHtml?: string;
  paragraphs?: string[];
  author?: string;
  category?: string;
  tags?: string[];
  publishedAt?: string;
};

const BLOG_POST_SELECT =
  "slug, title, excerpt, body_md, cover_image_url, cover_image_alt, author, category, tags, meta_title, meta_description, published, published_at";

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function mapStaticArticle(article: RatgeberArticle): RatgeberPost {
  return {
    slug: article.slug,
    title: article.title,
    meta: article.meta,
    imageSrc: article.imageSrc,
    imageAlt: article.title,
    excerpt: getStaticRatgeberExcerpt(article),
    paragraphs: article.paragraphs,
  };
}

function mapBlogRow(row: BlogPostRow): RatgeberPost {
  return {
    slug: row.slug,
    title: row.title,
    meta: {
      title: row.meta_title ?? row.title,
      description: row.meta_description ?? row.excerpt ?? "",
    },
    imageSrc: row.cover_image_url ?? "",
    imageAlt: row.cover_image_alt ?? row.title,
    excerpt: row.excerpt ?? "",
    bodyHtml: row.body_md ?? "",
    author: row.author ?? undefined,
    category: row.category ?? undefined,
    tags: row.tags ?? undefined,
    publishedAt: row.published_at ?? undefined,
  };
}

async function fetchPublishedBlogRows(): Promise<BlogPostRow[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(BLOG_POST_SELECT)
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(`Ratgeber aus Supabase laden fehlgeschlagen: ${error.message}`);
  }

  return (data ?? []) as BlogPostRow[];
}

export const ratgeberListingMeta = ratgeberMeta;

export function getRatgeberExcerpt(post: RatgeberPost): string {
  if (post.excerpt.trim()) {
    return post.excerpt.length > 180 ? `${post.excerpt.slice(0, 180)}…` : post.excerpt;
  }

  if (post.paragraphs?.[0]) {
    const text = post.paragraphs[0];
    return text.length > 180 ? `${text.slice(0, 180)}…` : text;
  }

  if (post.bodyHtml) {
    const text = post.bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return text.length > 180 ? `${text.slice(0, 180)}…` : text;
  }

  return "";
}

export async function getPublishedRatgeberPosts(): Promise<RatgeberPost[]> {
  if (!hasSupabaseConfig()) {
    return ratgeberArticles.map(mapStaticArticle);
  }

  const rows = await fetchPublishedBlogRows();
  return rows.map(mapBlogRow);
}

export async function getRatgeberPost(slug: string): Promise<RatgeberPost | null> {
  if (!hasSupabaseConfig()) {
    const article = ratgeberArticles.find((entry) => entry.slug === slug);
    return article ? mapStaticArticle(article) : null;
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(BLOG_POST_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Ratgeber-Artikel „${slug}“ laden fehlgeschlagen: ${error.message}`);
  }

  return data ? mapBlogRow(data as BlogPostRow) : null;
}

export async function getAllRatgeberSlugs(): Promise<string[]> {
  const posts = await getPublishedRatgeberPosts();
  return posts.map((post) => post.slug);
}
