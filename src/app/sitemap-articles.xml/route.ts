import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/api/articles';
import { SITE_CONFIG } from '@/config/site.config';

export const dynamic = 'force-dynamic';

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
    ${article.coverImage ? `<image:image>
      <image:loc>${article.coverImage}</image:loc>
      <image:title>${article.title}</image:title>
      ${article.excerpt ? `<image:caption>${article.excerpt}</image:caption>` : ''}
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
