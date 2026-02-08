/**
 * Convert Google Drive share URL to direct image URL
 *
 * Input formats supported:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID&export=download
 *
 * Output format:
 * - https://drive.google.com/uc?export=view&id=FILE_ID
 *
 * @param url - The URL to process (can be Google Drive or regular image URL)
 * @returns Direct image URL suitable for <img> src
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url || url.trim() === '') {
    return '';
  }

  const trimmedUrl = url.trim();

  // Check if it's a Google Drive URL
  if (trimmedUrl.includes('drive.google.com')) {
    // Extract file ID from various Google Drive URL formats
    let fileId: string | null = null;

    // Format 1: /file/d/FILE_ID/view
    const match1 = trimmedUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match1) {
      fileId = match1[1];
    }

    // Format 2: ?id=FILE_ID or &id=FILE_ID
    if (!fileId) {
      const match2 = trimmedUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match2) {
        fileId = match2[1];
      }
    }

    // If we found a file ID, convert to direct view URL
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }

  // Return original URL if not Google Drive or couldn't parse
  return trimmedUrl;
}

/**
 * Check if a URL is a Google Drive URL
 */
export function isGoogleDriveUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('drive.google.com');
}
