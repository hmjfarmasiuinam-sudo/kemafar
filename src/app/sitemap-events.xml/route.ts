import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/api/events';
import { SITE_CONFIG } from '@/config/site.config';

export const dynamic = 'force-dynamic';

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    // Remove any remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Truncate to 160 characters for image caption
    .substring(0, 160);
}

export async function GET() {
  const events = await getEvents();
  const baseUrl = SITE_CONFIG.url;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${events
    .map(
      (event) => `
  <url>
    <loc>${baseUrl}/events/${event.slug}</loc>
    <lastmod>${new Date(event.updatedAt || event.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    ${event.coverImage ? `<image:image>
      <image:loc>${escapeXml(event.coverImage)}</image:loc>
      <image:title>${escapeXml(event.title)}</image:title>
      <image:caption>${escapeXml(event.description || '')}</image:caption>
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
