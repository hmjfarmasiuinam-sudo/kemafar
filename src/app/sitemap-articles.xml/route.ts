import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/api/articles';
import { SITE_CONFIG } from '@/config/site.config';

export const dynamic = 'force-dynamic';

// Helper function to escape XML special characters (for URLs)
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';

  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Helper function to clean text content (for titles and captions)
function cleanText(unsafe: string): string {
  if (!unsafe) return '';

  return unsafe
    // Remove HTML tags first
    .replace(/<[^>]*>/g, '')
    // Remove URLs (http/https links) - but not in isolation, only in text
    .replace(/\s*https?:\/\/[^\s)]+/g, '')
    // Remove markdown links like [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove extra whitespace and newlines
    .replace(/\s+/g, ' ')
    // Remove any parentheses with URLs inside
    .replace(/\([^)]*https?[^)]*\)/g, '')
    // Remove "Uncategorized" prefix
    .replace(/^Uncategorized\s*/i, '')
    // Trim
    .trim()
    // Then escape XML special characters
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    // Truncate to 160 characters
    .substring(0, 160)
    .trim();
}

export async function GET() {
  const articles = await getArticles();
  const baseUrl = SITE_CONFIG.url;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${articles
    .map(
      (article) => `
  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${new Date(article.updatedAt || article.publishedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    ${article.coverImage && article.coverImage.startsWith('http') ? `<image:image>
      <image:loc>${escapeXml(article.coverImage)}</image:loc>
      <image:title>${cleanText(article.title)}</image:title>
      ${article.excerpt ? `<image:caption>${cleanText(article.excerpt)}</image:caption>` : ''}
    </image:image>` : ''}
  </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
