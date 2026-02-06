/**
 * Scrape Articles from kemafar.org with Supabase Storage Integration
 * Downloads images and uploads to Supabase bucket
 * Generates SQL INSERT statements for seed.sql
 */

import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import TurndownService from 'turndown';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = path.join(__dirname, '../.env.local');
dotenv.config({ path: envPath });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'article-images';

const supabase = createClient(supabaseUrl, supabaseKey);

// Default placeholder image (professional pharmacy/medical theme)
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1920&q=80';

interface Article {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'post' | 'blog' | 'opinion' | 'publication' | 'info';
  publishedAt: string;
  coverImage: string;
  tags: string[];
}

interface ImageUploadResult {
  success: boolean;
  url: string;
  originalUrl: string;
}

/**
 * Download image from URL and return as Buffer
 */
async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    console.log(`    Downloading image: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`    ✗ Failed to download image: ${error}`);
    return null;
  }
}

/**
 * Upload image to Supabase Storage bucket
 * Follows the same pattern as StorageService in codebase
 */
async function uploadImageToSupabase(
  imageBuffer: Buffer,
  originalUrl: string,
  folder: string = 'articles'
): Promise<ImageUploadResult> {
  try {
    // Process image with Sharp (convert to WebP, resize if needed)
    const processedImage = await sharp(imageBuffer)
      .resize(1920, 1920, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 }) // Convert to WebP with 80% quality
      .toBuffer();

    // Generate unique filename using UUID
    const fileName = `${uuidv4()}.webp`;
    const filePath = `${folder}/${fileName}`;

    console.log(`    Uploading to bucket: ${bucketName}/${filePath}`);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, processedImage, {
        contentType: 'image/webp',
        cacheControl: '3600', // Cache for 1 hour
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log(`    ✓ Uploaded successfully: ${data.publicUrl}`);

    return {
      success: true,
      url: data.publicUrl,
      originalUrl
    };
  } catch (error) {
    console.error(`    ✗ Failed to upload image: ${error}`);
    return {
      success: false,
      url: PLACEHOLDER_IMAGE,
      originalUrl
    };
  }
}

/**
 * Process cover image: download and upload to Supabase
 */
async function processCoverImage(imageUrl: string): Promise<string> {
  console.log(`  → Processing cover image...`);

  // Download image
  const imageBuffer = await downloadImage(imageUrl);
  if (!imageBuffer) {
    console.log(`  → Using placeholder for cover image`);
    return PLACEHOLDER_IMAGE;
  }

  // Upload to Supabase
  const result = await uploadImageToSupabase(imageBuffer, imageUrl, 'articles');
  return result.url;
}

/**
 * Process images in content: download, upload, and replace URLs in markdown
 */
async function processContentImages(content: string): Promise<string> {
  console.log(`  → Processing images in content...`);

  // Find all image URLs in markdown
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images: { alt: string; url: string; fullMatch: string }[] = [];

  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    images.push({
      alt: match[1],
      url: match[2],
      fullMatch: match[0]
    });
  }

  if (images.length === 0) {
    console.log(`    No images found in content`);
    return content;
  }

  console.log(`    Found ${images.length} images in content`);

  // Process each image
  let updatedContent = content;
  for (const img of images) {
    // Skip if already uploaded to Supabase
    if (img.url.includes('supabase.co')) {
      console.log(`    Skipping already uploaded image: ${img.url}`);
      continue;
    }

    // Download and upload
    const imageBuffer = await downloadImage(img.url);
    if (imageBuffer) {
      const result = await uploadImageToSupabase(imageBuffer, img.url, 'articles');

      // Replace URL in content
      const newImageMarkdown = `![${img.alt}](${result.url})`;
      updatedContent = updatedContent.replace(img.fullMatch, newImageMarkdown);
    }
  }

  return updatedContent;
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return await response.text();
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Improved category detection from article metadata
 */
function detectCategory(url: string, html: string): Article['category'] {
  // Check URL for category hints
  if (url.includes('/news/') || url.includes('berita')) return 'info';
  if (url.includes('/esai/') || url.includes('opini')) return 'opinion';
  if (url.includes('/publication/') || url.includes('publikasi')) return 'publication';
  if (url.includes('/blog/')) return 'blog';

  // Parse HTML for category meta
  const $ = cheerio.load(html);
  const categoryText = $('.category, .post-category, a[rel="category tag"]')
    .first()
    .text()
    .toLowerCase();

  if (categoryText.includes('news') || categoryText.includes('berita')) return 'info';
  if (categoryText.includes('esai') || categoryText.includes('opini')) return 'opinion';
  if (categoryText.includes('publication') || categoryText.includes('publikasi')) return 'publication';
  if (categoryText.includes('blog')) return 'blog';

  // Default fallback
  return 'post';
}

/**
 * Scrape all article links from homepage and pagination
 */
async function scrapeAllArticleLinks(): Promise<{ title: string; url: string }[]> {
  console.log(`\n📄 Scraping article links from homepage...\n`);

  const allLinks: { title: string; url: string }[] = [];
  const baseUrl = 'https://kemafar.org';

  // Start from homepage
  let page = 1;
  let hasMorePages = true;

  while (hasMorePages && page <= 15) { // Max 15 pages
    const pageUrl = page === 1 ? baseUrl : `${baseUrl}/page/${page}/`;
    console.log(`Scraping page ${page}: ${pageUrl}`);

    try {
      const html = await fetchPage(pageUrl);
      const $ = cheerio.load(html);

      // Find all article links (WordPress standard)
      let foundOnThisPage = 0;
      $('article h2 a, article h3 a, article h4 a, .entry-title a, .post-title a').each((_i, el) => {
        const $link = $(el);
        const title = $link.text().trim();
        const url = $link.attr('href') || '';

        // Only article URLs (contain year in path like /2024/)
        if (title && url && url.match(/kemafar\.org\/\d{4}\//)) {
          // Avoid duplicates
          if (!allLinks.some(a => a.url === url)) {
            allLinks.push({ title, url });
            foundOnThisPage++;
          }
        }
      });

      console.log(`  → Found ${foundOnThisPage} articles on this page`);

      if (foundOnThisPage === 0) {
        hasMorePages = false;
      } else {
        page++;
        await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit
      }
    } catch (err) {
      console.log(`  → Page ${page} not accessible, stopping pagination`);
      hasMorePages = false;
    }
  }

  console.log(`\n✅ Total articles found: ${allLinks.length}\n`);
  return allLinks;
}

/**
 * Scrape full article content
 */
async function scrapeArticleContent(
  url: string,
  title: string
): Promise<{ content: string; excerpt: string; coverImage: string; category: Article['category'] } | null> {
  console.log(`\nScraping: ${title}`);
  console.log(`URL: ${url}`);

  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);

    // Detect category
    const category = detectCategory(url, html);
    console.log(`  → Category: ${category}`);

    // Initialize Turndown for HTML to Markdown conversion
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      emDelimiter: '_',
      strongDelimiter: '**',
    });

    // Ensure images are converted to markdown, not kept as HTML
    turndownService.keep([]); // Don't keep any HTML tags
    turndownService.remove(['script', 'style']); // Remove scripts and styles

    // Extract content HTML
    let contentHtml = '';
    const selectors = [
      '.entry-content',
      '.post-content',
      '.article-content',
      '.bs-blog-post',
      'article .content',
      'article',
    ];

    for (const selector of selectors) {
      const contentEl = $(selector).first();
      if (contentEl.length > 0) {
        const cloned = contentEl.clone();

        // Remove unwanted elements
        cloned.find('script, style, iframe, .sharedaddy, .jp-relatedposts, .navigation, .comment, .post-meta, .entry-header, .entry-footer, header, footer, .breadcrumbs').remove();

        contentHtml = cloned.html() || '';

        if (contentHtml.length > 200) {
          console.log(`  → Content found (${contentHtml.length} chars)`);
          break;
        }
      }
    }

    // Fallback: get paragraphs
    if (!contentHtml || contentHtml.length < 100) {
      const paragraphs = $('article p, .post p, .entry p');
      if (paragraphs.length > 0) {
        contentHtml = paragraphs.map((_i, el) => $(el).html()).get().join('</p><p>');
        contentHtml = `<p>${contentHtml}</p>`;
      }
    }

    // Extract FIRST REAL image from content as cover (skip gravatar/author images)
    let coverImageUrl = '';
    const $contentHtml = cheerio.load(contentHtml);
    let firstRealImage: any = null;

    // Find first image that is NOT gravatar or small author image
    $contentHtml('img').each((_i, img) => {
      const src = $contentHtml(img).attr('src') || '';

      // Skip gravatars and author images
      if (src.includes('gravatar.com') ||
          src.includes('avatar') ||
          src.includes('author')) {
        console.log(`  → Skipping author/gravatar image: ${src}`);
        // Remove author images from content
        $contentHtml(img).remove();
        return; // continue to next
      }

      // This is the first real article image
      if (!firstRealImage) {
        firstRealImage = $contentHtml(img);
        coverImageUrl = src;
        console.log(`  → Found first real image as cover: ${coverImageUrl}`);

        // Remove cover image from content HTML so it doesn't appear in body
        $contentHtml(img).remove();
      }
    });

    // Update contentHtml after removing images
    contentHtml = $contentHtml.html() || contentHtml;

    // Fallback: try og:image or wp-post-image if no image in content
    if (!coverImageUrl) {
      coverImageUrl = $('meta[property="og:image"]').attr('content') ||
                      $('.wp-post-image').attr('src') ||
                      '';
    }

    // If still no cover image found, use placeholder
    if (!coverImageUrl) {
      console.log(`  → No cover image found, using placeholder`);
      coverImageUrl = PLACEHOLDER_IMAGE;
    }

    // Process cover image (download & upload to Supabase)
    const coverImage = await processCoverImage(coverImageUrl);

    // Convert HTML to Markdown (after removing first image)
    let content = contentHtml ? turndownService.turndown(contentHtml) : '';
    content = content.replace(/\n{3,}/g, '\n\n').trim();

    // Process remaining images in content (download & upload, replace URLs)
    content = await processContentImages(content);

    // Generate excerpt
    const plainText = content.replace(/[#*`\[\]!]/g, '').trim();
    const excerpt = plainText.length > 200
      ? plainText.substring(0, 200).trim() + '...'
      : plainText || 'Artikel dari KEMAFAR UIN Alauddin Makassar';

    console.log(`✓ Successfully scraped and processed article\n`);

    return { content, excerpt, coverImage, category };
  } catch (error) {
    console.error(`✗ Failed to scrape article: ${error}\n`);
    return null;
  }
}

/**
 * Main scraping function
 */
async function scrapeAllArticles() {
  // Get all article links
  const articleLinks = await scrapeAllArticleLinks();

  const allArticles: Article[] = [];
  let successCount = 0;
  let failCount = 0;

  console.log(`\n🔍 Starting content scraping for ${articleLinks.length} articles...\n`);
  console.log(`${'='.repeat(80)}\n`);

  // Process each article
  for (const { title, url } of articleLinks) {
    const result = await scrapeArticleContent(url, title);

    if (result) {
      // Extract date from URL
      const dateMatch = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
      let publishedDate: string;

      if (dateMatch) {
        const [, year, month, day] = dateMatch;
        publishedDate = new Date(`${year}-${month}-${day}`).toISOString();
      } else {
        publishedDate = new Date().toISOString();
      }

      const article: Article = {
        title,
        slug: createSlug(title),
        excerpt: result.excerpt,
        content: result.content,
        category: result.category,
        publishedAt: publishedDate,
        coverImage: result.coverImage,
        tags: ['KEMAFAR', 'Farmasi', 'UIN Alauddin'],
      };

      allArticles.push(article);
      successCount++;
    } else {
      failCount++;
    }

    // Rate limiting to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay between articles
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`\n✅ Scraping completed!`);
  console.log(`   Success: ${successCount} articles`);
  console.log(`   Failed: ${failCount} articles`);
  console.log(`   Total: ${allArticles.length} articles ready for database\n`);

  return allArticles;
}

/**
 * Generate SQL INSERT statements
 */
function generateSQLInserts(articles: Article[]): string {
  let sql = `-- =============================================
-- ARTICLES FROM KEMAFAR.ORG
-- Auto-generated with Supabase Storage Integration
-- Total: ${articles.length} articles
-- Images uploaded to: ${bucketName}
-- Generated: ${new Date().toISOString()}
-- =============================================

`;

  articles.forEach((article, index) => {
    const authorJson = JSON.stringify({
      name: 'Admin KEMAFAR',
      role: 'admin',
      email: 'admin@kemafar.org'
    }).replace(/'/g, "''");

    const tagsArray = `ARRAY[${article.tags.map(t => `'${t}'`).join(', ')}]`;

    sql += `-- Article ${index + 1}: ${article.title}\n`;
    sql += `INSERT INTO public.articles (title, slug, excerpt, content, category, status, cover_image, published_at, author, tags, featured)\n`;
    sql += `VALUES (\n`;
    sql += `  '${article.title.replace(/'/g, "''")}',\n`;
    sql += `  '${article.slug}',\n`;
    sql += `  '${article.excerpt.replace(/'/g, "''")}',\n`;
    sql += `  '${article.content.replace(/'/g, "''")}',\n`;
    sql += `  '${article.category}',\n`;
    sql += `  'published',\n`;
    sql += `  '${article.coverImage}',\n`;
    sql += `  '${article.publishedAt}',\n`;
    sql += `  '${authorJson}'::jsonb,\n`;
    sql += `  ${tagsArray},\n`;
    sql += `  ${index < 5 ? 'true' : 'false'}\n`; // First 5 articles featured
    sql += `)\n`;
    sql += `ON CONFLICT (slug) DO UPDATE SET\n`;
    sql += `  content = EXCLUDED.content,\n`;
    sql += `  cover_image = EXCLUDED.cover_image,\n`;
    sql += `  excerpt = EXCLUDED.excerpt,\n`;
    sql += `  category = EXCLUDED.category;\n\n`;
  });

  // Add cleanup SQL
  sql += `\n-- =============================================\n`;
  sql += `-- AUTOMATIC CLEANUP & STANDARDIZATION\n`;
  sql += `-- =============================================\n\n`;

  sql += `-- Update all incorrect category variants to standardized 'post'\n`;
  sql += `UPDATE public.articles \n`;
  sql += `SET category = 'post' \n`;
  sql += `WHERE category IN ('uncategorized', 'pos', 'Pos', 'Post', 'Uncategorized', 'UNCATEGORIZED', 'POST');\n\n`;

  sql += `-- Remove category link text from excerpt and content\n`;
  sql += `UPDATE public.articles\n`;
  sql += `SET \n`;
  sql += `  excerpt = REGEXP_REPLACE(excerpt, '\\\\[.*?\\\\]\\\\(https?://kemafar\\\\.org/category/[^)]+\\\\)', '', 'g'),\n`;
  sql += `  content = REGEXP_REPLACE(content, '\\\\[.*?\\\\]\\\\(https?://kemafar\\\\.org/category/[^)]+\\\\)', '', 'g')\n`;
  sql += `WHERE \n`;
  sql += `  excerpt ~ '\\\\[.*?\\\\]\\\\(https?://kemafar\\\\.org/category/' OR \n`;
  sql += `  content ~ '\\\\[.*?\\\\]\\\\(https?://kemafar\\\\.org/category/';\n\n`;

  sql += `-- Verification: Check category distribution\n`;
  sql += `SELECT category, COUNT(*) as count \n`;
  sql += `FROM public.articles \n`;
  sql += `GROUP BY category \n`;
  sql += `ORDER BY count DESC;\n`;

  return sql;
}

/**
 * Main function
 */
async function main() {
  console.log('\n🚀 KEMAFAR Article Scraper with Supabase Storage Integration\n');
  console.log(`${'='.repeat(80)}\n`);
  console.log(`Environment:`);
  console.log(`  - Supabase URL: ${supabaseUrl}`);
  console.log(`  - Storage Bucket: ${bucketName}`);
  console.log(`  - Placeholder Image: ${PLACEHOLDER_IMAGE}`);
  console.log(`\n${'='.repeat(80)}`);

  try {
    const articles = await scrapeAllArticles();

    if (articles.length === 0) {
      console.error('❌ No articles scraped. Exiting...');
      process.exit(1);
    }

    // Generate SQL
    const sql = generateSQLInserts(articles);
    const outputPath = path.join(__dirname, '../supabase/seed-articles.sql');

    fs.writeFileSync(outputPath, sql, 'utf-8');
    console.log(`\n📝 SQL seed file saved to: ${outputPath}`);

    // Summary
    console.log(`\n📊 Summary:`);
    console.log(`   - Total articles: ${articles.length}`);
    console.log(`   - Featured articles: ${articles.filter((_a, i) => i < 5).length}`);
    console.log(`   - Categories breakdown:`);
    const categoryCounts = articles.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      console.log(`     • ${cat}: ${count}`);
    });
    console.log(`   - Images uploaded to Supabase: ${bucketName}`);

    console.log(`\n✨ Done! Run the SQL file to seed your database.\n`);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
