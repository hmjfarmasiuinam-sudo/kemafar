/**
 * Scrape Articles from kemafar.org Navigation Menu
 * These are articles that were incorrectly added to the navigation menu
 *
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

// Default placeholder image
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

// Articles found in navigation menu (incorrectly placed)
const NAVIGATION_ARTICLES = [
  {
    title: "Badan POM Umumkan Hasil Pengujian Permen Dot yang Diduga Mengandung Narkoba",
    url: "https://kemafar.org/permen-dot-diduga-mengandung-narkoba/"
  },
  {
    title: "Cegah Penyebaran Covid-19, HMJ Farmasi, Jurusan Farmasi UINAM DAN APTFI Kerja Sama Bagikan Masker dan Sembako ke Masyarakat",
    url: "https://kemafar.org/cegah-penyebaran-covid-19-hmj-farmasi-jurusan-farmasi-uinam-dan-aptfi-kerja-sama-bagikan-masker-dan-sembako-ke-masyarakat/"
  },
  {
    title: "diphp oleh kebijakan",
    url: "https://kemafar.org/diphp-oleh-kebijakan/"
  },
  {
    title: "HMJ Farmasi UINAM Gelar Upgrading Guna Tingkatkan Kinerja Pengurus",
    url: "https://kemafar.org/hmj-farmasi-uinam-gelar-upgrading-guna-tingkatkan-kinerja-pengurus/"
  },
  {
    title: "HMJ Farmasi UINAM Siap Gelar IPAC (Indonesia Pharmaceutical Of Alauddin Competition) On November",
    url: "https://kemafar.org/hmj-farmasi-uinam-siap-gelar-ipac-indonesia-pharmaceutical-of-alauddin-competition-on-november/"
  },
  {
    title: "INDONESIA DARURAT KEKERASAN SEKSUAL",
    url: "https://kemafar.org/indonesia-darurat-kekerasan-seksual/"
  },
  {
    title: "INOVASI TERBARU, KAPSUL YANG DAPAT MENGGANTIKAN SEDIAAN INJEKSI",
    url: "https://kemafar.org/inovasi-terbaru-kapsul-yang-dapat-menggantikan-sediaan-injeksi/"
  },
  {
    title: "Juara Harapan 3 Nasional \"Olimpiade Agama, Sains dan Riset Perguruan Tinggi Keagamaan Islam (OASE PTKI) I dalam Lomba Bidang Karya Inovasi Produk Halal dan Ketahanan Pangan UIN Ar-Raniry Banda Aceh\"",
    url: "https://kemafar.org/juara-harapan-3-nasional-olimpiade-agama-sains-dan-riset-perguruan-tinggi-keagamaan-islam-oase-ptki-i-dalam-lomba-bidang-karya-inovasi-produk-halal-dan-ketahanan-pangan-uin-ar-raniry-banda-aceh/"
  },
  {
    title: "HMJ FARMASI UINAM SUKSES MENGGELAR PHARMACY VAGANZA 2022",
    url: "https://kemafar.org/kabar-terkini/hmj-farmasi-uinam-sukses-menggelarpharmacy-vaganza-2022/"
  },
  {
    title: "KASTRAD OPINION II RUU KEFARMASIAN RESMI DICABUT DARI PROLEGNAS PRIORITAS, PATUTKAH DIPERJUANGKAN?",
    url: "https://kemafar.org/kastrad-opinion-ii-ruu-kefarmasian-resmi-dicabut-dari-prolegnas-prioritas-patutkah-diperjuangkan/"
  },
  {
    title: "Kastrad Opinion II Setujukah anda tentang penerapan New Normal?",
    url: "https://kemafar.org/kastrad-opinion-ii-setujukah-anda-tentang-penerapan-new-normal/"
  },
  {
    title: "kolaborasi bakti sosial hmj farmasi uinam dan mahasiswa fakultas kedokteran dan ilmu kesehatan",
    url: "https://kemafar.org/kolaborasi-bakti-sosial-hmj-farmasi-uinam-dan-mahasiswa-fakultas-kedokteran-dan-ilmu-kesehatan/"
  },
  {
    title: "KULIAH TAMU JURUSAN FARMASI FKIK UINAM",
    url: "https://kemafar.org/623-2/"
  },
  {
    title: "Latihan Kepemimpinan I PERIODE 2015/2016",
    url: "https://kemafar.org/latihan-kepemimpinan-i-periode-2015-2016/"
  },
  {
    title: "MENGHITUNG HARI MENUJU MALAM PUNCAK PHARMACY VAGANZA 2022, SIAPKAN DIRI ANDA!",
    url: "https://kemafar.org/menghitung-hari-menuju-malam-puncak-pharmacy-vaganza-2022-siapkan-diri-anda/"
  },
  {
    title: "Musyawarah Himpunan HMJ Farmasi UINAM periode 2015/2016",
    url: "https://kemafar.org/musyawarah-himpunan-hmj-farmasi-uinam-periode-2015-2016/"
  },
  {
    title: "Musyawarah Luar Biasa 2012",
    url: "https://kemafar.org/musyawarah-luar-biasa-2012/"
  },
  {
    title: "PENGABDIAN MASYARAKAT HMJ FARMASI UINAM",
    url: "https://kemafar.org/pengabdian-masyarakat-hmj-farmasi-uinam/"
  },
  {
    title: "Pesantren Ramadhan 2015",
    url: "https://kemafar.org/pesantren-ramadhan-2015/"
  },
  {
    title: "PHARMACY CAMP 2015",
    url: "https://kemafar.org/pharmacy-camp-2015/"
  },
  {
    title: "Pharmay Camp 2020 Farmasi UINAM",
    url: "https://kemafar.org/pharmay-camp-2020-farmasi-uinam/"
  },
  {
    title: "RAKER & PELANTIKAN TBF ALAUDDIN 2020",
    url: "https://kemafar.org/raker-pelantikan-tbf-alauddin-2020/"
  },
  {
    title: "Rapat Kerja Himpunan Mahasiswa Jurusan Farmasi Periode 2017/2018 UIN Alauddin Makassar",
    url: "https://kemafar.org/rapat-kerja-himpunan-mahasiswa-jurusan-farmasi-periode-2017-2018-uin-alauddin-makassar/"
  },
  {
    title: "Rapat Kerja Himpunan Mahasiswa Jurusan Farmasi periode 2020-2021",
    url: "https://kemafar.org/rapat-kerja-himpunan-mahasiswa-jurusan-farmasi-periode-2020-2021/"
  },
  {
    title: "S-OBAT, Teknologi Pembuatan Resep Termutakhir",
    url: "https://kemafar.org/s-obat-teknologi-pembuatan-resep-termutakhir/"
  },
  {
    title: "SAHKAN RUU KEFARMASIAN",
    url: "https://kemafar.org/sahkan-ruu-kefarmasian/"
  },
  {
    title: "Sosialisasi Jurusan Farmasi ke beberapa SMA tahun 2016",
    url: "https://kemafar.org/sosialisasi-jurusan-farmasi-ke-beberapa-sma-tahun-2016/"
  },
  {
    title: "UPGRADING HMJ FARMASI UINAM PERIODE 2015/2016",
    url: "https://kemafar.org/upgrading-hmj-farmasi-uinam-periode-2015-2016/"
  }
];

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
 */
async function uploadImageToSupabase(
  imageBuffer: Buffer,
  originalUrl: string,
  folder: string = 'articles'
): Promise<ImageUploadResult> {
  try {
    // Process image with Sharp
    const processedImage = await sharp(imageBuffer)
      .resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toBuffer();

    const fileName = `${uuidv4()}.webp`;
    const filePath = `${folder}/${fileName}`;

    console.log(`    Uploading to bucket: ${bucketName}/${filePath}`);

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, processedImage, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

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
 * Process cover image
 */
async function processCoverImage(imageUrl: string): Promise<string> {
  console.log(`  → Processing cover image...`);

  const imageBuffer = await downloadImage(imageUrl);
  if (!imageBuffer) {
    console.log(`  → Using placeholder for cover image`);
    return PLACEHOLDER_IMAGE;
  }

  const result = await uploadImageToSupabase(imageBuffer, imageUrl, 'articles');
  return result.url;
}

/**
 * Process images in content
 */
async function processContentImages(content: string): Promise<string> {
  console.log(`  → Processing images in content...`);

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

  let updatedContent = content;
  for (const img of images) {
    if (img.url.includes('supabase.co')) {
      console.log(`    Skipping already uploaded image: ${img.url}`);
      continue;
    }

    const imageBuffer = await downloadImage(img.url);
    if (imageBuffer) {
      const result = await uploadImageToSupabase(imageBuffer, img.url, 'articles');
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
 * Extract published date from title or content
 */
function extractPublishedDate(title: string, content: string, url: string): string {
  // Try to extract year from title (e.g., "tahun 2016", "2020", "periode 2015/2016")
  const yearMatches = [
    title.match(/(?:tahun|year)\s*(\d{4})/i),
    title.match(/(?:periode|period)\s*(\d{4})/i),
    title.match(/(\d{4})\/(\d{4})/), // Handle "2015/2016" format
    title.match(/\b(20[012]\d)\b/), // Match any 4-digit year 2000-2029
  ];

  for (const match of yearMatches) {
    if (match && match[1]) {
      const year = parseInt(match[1]);
      if (year >= 2010 && year <= new Date().getFullYear()) {
        // Use July 1st as middle of the year for estimated dates
        return new Date(`${year}-07-01`).toISOString();
      }
    }
  }

  // Try URL pattern
  const urlDate = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
  if (urlDate) {
    const [, year, month, day] = urlDate;
    return new Date(`${year}-${month}-${day}`).toISOString();
  }

  // Extract from content if has specific date patterns
  const contentDate = content.match(/(\d{1,2})\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+(\d{4})/i);
  if (contentDate) {
    const months: Record<string, string> = {
      'januari': '01', 'februari': '02', 'maret': '03', 'april': '04',
      'mei': '05', 'juni': '06', 'juli': '07', 'agustus': '08',
      'september': '09', 'oktober': '10', 'november': '11', 'desember': '12'
    };
    const day = contentDate[1].padStart(2, '0');
    const month = months[contentDate[2].toLowerCase()];
    const year = contentDate[3];
    if (month) {
      return new Date(`${year}-${month}-${day}`).toISOString();
    }
  }

  // Fallback: Use a reasonable old date for archived articles (2015-01-01)
  // This is better than using "now" for old articles
  return new Date('2015-01-01').toISOString();
}

/**
 * Detect category from article
 */
function detectCategory(url: string, html: string): Article['category'] {
  if (url.includes('/news/') || url.includes('berita')) return 'info';
  if (url.includes('/esai/') || url.includes('opini') || url.includes('opinion')) return 'opinion';
  if (url.includes('/publication/') || url.includes('publikasi')) return 'publication';
  if (url.includes('/blog/')) return 'blog';

  const $ = cheerio.load(html);
  const categoryText = $('.category, .post-category, a[rel="category tag"]')
    .first()
    .text()
    .toLowerCase();

  if (categoryText.includes('news') || categoryText.includes('berita')) return 'info';
  if (categoryText.includes('esai') || categoryText.includes('opini') || categoryText.includes('opinion')) return 'opinion';
  if (categoryText.includes('publication') || categoryText.includes('publikasi')) return 'publication';
  if (categoryText.includes('blog')) return 'blog';

  return 'post';
}

/**
 * Scrape article content
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

    const category = detectCategory(url, html);
    console.log(`  → Category: ${category}`);

    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      emDelimiter: '_',
      strongDelimiter: '**',
    });

    turndownService.keep([]);
    turndownService.remove(['script', 'style']);

    let contentHtml = '';

    // Strategy 1: Try to find the main article content container
    const selectors = [
      '.bs-card-box.padding-20',  // Specific content container for kemafar.org
      '.entry-content',
      '.post-content',
      '.post-body',
      '.article-content',
      'article .entry-content',
      '#content article',
    ];

    for (const selector of selectors) {
      const contentEl = $(selector).first();
      if (contentEl.length > 0) {
        const cloned = contentEl.clone();

        // Remove unwanted elements from content
        cloned.find('script, style, iframe, .sharedaddy, .jp-relatedposts, .navigation, .comment, .post-meta, .entry-header, .entry-footer, .sidebar, aside, .widget, .breadcrumb-trail, .page-entry-title, .bs-blog-post, .related-posts, .post-navigation').remove();

        // Remove title/heading only if it matches article title
        cloned.find('h1').each((_i, el) => {
          const headingText = $(el).text().trim();
          if (headingText === title) {
            $(el).remove();
          }
        });

        contentHtml = cloned.html() || '';

        if (contentHtml.length > 500) {
          console.log(`  → Content found via '${selector}' (${contentHtml.length} chars)`);
          break;
        }
      }
    }

    // Strategy 2: If still no content, collect all paragraphs
    if (!contentHtml || contentHtml.length < 500) {
      console.log(`  → Using fallback: collecting paragraphs...`);
      const paragraphs = $('article p, .post p, .entry p, main p, .content p');
      const collected: string[] = [];

      paragraphs.each((_i, el) => {
        const text = $(el).text().trim();
        if (text.length > 50) {
          collected.push($(el).html() || '');
        }
      });

      if (collected.length > 0) {
        contentHtml = collected.join('</p><p>');
        contentHtml = `<p>${contentHtml}</p>`;
        console.log(`  → Collected ${collected.length} paragraphs (${contentHtml.length} chars)`);
      }
    }

    // If still insufficient, skip article
    if (!contentHtml || contentHtml.length < 200) {
      console.log(`  ⚠️  Insufficient content (${contentHtml.length} chars) - skipping`);
      return null;
    }

    // Extract cover image (without modifying contentHtml yet)
    let coverImageUrl = '';
    const $contentHtml = cheerio.load(contentHtml);
    let firstImageIndex = -1;
    const allImages: string[] = [];

    // Collect all images
    $contentHtml('img').each((index, img) => {
      const src = $contentHtml(img).attr('src') || '';

      // Skip gravatar/author images
      if (src.includes('gravatar.com') ||
          src.includes('avatar') ||
          src.includes('author')) {
        console.log(`  → Skipping author/gravatar image: ${src}`);
        return;
      }

      allImages.push(src);

      // First real image becomes cover
      if (firstImageIndex === -1) {
        firstImageIndex = index;
        coverImageUrl = src;
        console.log(`  → Found first real image as cover: ${coverImageUrl}`);
      }
    });

    console.log(`  → Total images found in content: ${allImages.length}`);

    // Now remove only the cover image (first one) from content
    if (firstImageIndex >= 0) {
      let imageCount = 0;
      $contentHtml('img').each((index, img) => {
        const src = $contentHtml(img).attr('src') || '';
        if (!src.includes('gravatar.com') && !src.includes('avatar') && !src.includes('author')) {
          if (imageCount === 0) {
            // Remove first image (it's the cover)
            $contentHtml(img).parent('figure, a').remove(); // Remove parent figure/link too
            $contentHtml(img).remove();
          }
          imageCount++;
        }
      });
    }

    contentHtml = $contentHtml.html() || contentHtml;

    if (!coverImageUrl) {
      coverImageUrl = $('meta[property="og:image"]').attr('content') ||
                      $('.wp-post-image').attr('src') ||
                      '';
    }

    if (!coverImageUrl) {
      console.log(`  → No cover image found, using placeholder`);
      coverImageUrl = PLACEHOLDER_IMAGE;
    }

    const coverImage = await processCoverImage(coverImageUrl);

    let content = contentHtml ? turndownService.turndown(contentHtml) : '';
    content = content.replace(/\n{3,}/g, '\n\n').trim();

    content = await processContentImages(content);

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
async function scrapeNavigationArticles() {
  const allArticles: Article[] = [];
  let successCount = 0;
  let failCount = 0;

  console.log(`\n🔍 Starting scraping for ${NAVIGATION_ARTICLES.length} navigation menu articles...\n`);
  console.log(`${'='.repeat(80)}\n`);

  for (const { title, url } of NAVIGATION_ARTICLES) {
    const result = await scrapeArticleContent(url, title);

    if (result) {
      // Extract published date from title, content, or URL
      const publishedDate = extractPublishedDate(title, result.content, url);

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

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
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
  const AUTHOR_ID = '16bc2e11-06d0-48cd-a720-4634bbf14783';

  let sql = `-- =============================================
-- NAVIGATION MENU ARTICLES FROM KEMAFAR.ORG
-- Auto-generated with Supabase Storage Integration
-- Total: ${articles.length} articles
-- Images uploaded to: ${bucketName}
-- Author: HMJ Farmasi UINAM (${AUTHOR_ID})
-- Generated: ${new Date().toISOString()}
-- =============================================

`;

  articles.forEach((article, index) => {
    const authorJson = JSON.stringify({
      name: 'HMJ Farmasi UINAM',
      role: 'admin',
      email: 'hmjfarmasiuinam@gmail.com'
    }).replace(/'/g, "''");

    const tagsArray = `ARRAY[${article.tags.map(t => `'${t}'`).join(', ')}]`;

    sql += `-- Article ${index + 1}: ${article.title}\n`;
    sql += `INSERT INTO public.articles (title, slug, excerpt, content, category, status, cover_image, published_at, author, author_id, tags, featured)\n`;
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
    sql += `  '${AUTHOR_ID}'::uuid,\n`;
    sql += `  ${tagsArray},\n`;
    sql += `  false\n`;
    sql += `)\n`;
    sql += `ON CONFLICT (slug) DO UPDATE SET\n`;
    sql += `  content = EXCLUDED.content,\n`;
    sql += `  cover_image = EXCLUDED.cover_image,\n`;
    sql += `  excerpt = EXCLUDED.excerpt,\n`;
    sql += `  category = EXCLUDED.category,\n`;
    sql += `  author_id = EXCLUDED.author_id;\n\n`;
  });

  return sql;
}

/**
 * Main function
 */
async function main() {
  console.log('\n🚀 KEMAFAR Navigation Menu Article Scraper\n');
  console.log(`${'='.repeat(80)}\n`);
  console.log(`Environment:`);
  console.log(`  - Supabase URL: ${supabaseUrl}`);
  console.log(`  - Storage Bucket: ${bucketName}`);
  console.log(`  - Articles to scrape: ${NAVIGATION_ARTICLES.length}`);
  console.log(`\n${'='.repeat(80)}`);

  try {
    const articles = await scrapeNavigationArticles();

    if (articles.length === 0) {
      console.error('❌ No articles scraped. Exiting...');
      process.exit(1);
    }

    const sql = generateSQLInserts(articles);
    const outputPath = path.join(__dirname, '../supabase/seed-navigation-articles.sql');

    fs.writeFileSync(outputPath, sql, 'utf-8');
    console.log(`\n📝 SQL seed file saved to: ${outputPath}`);

    console.log(`\n📊 Summary:`);
    console.log(`   - Total articles: ${articles.length}`);
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
