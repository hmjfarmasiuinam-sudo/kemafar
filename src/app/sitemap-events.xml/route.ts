import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/api/events';
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
    ${event.coverImage && event.coverImage.startsWith('http') ? `<image:image>
      <image:loc>${escapeXml(event.coverImage)}</image:loc>
      <image:title>${cleanText(event.title)}</image:title>
      <image:caption>${cleanText(event.description || '')}</image:caption>
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
