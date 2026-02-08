/**
 * Fix Supabase Storage - Make article-images bucket public
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = path.join(__dirname, '../.env.local');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'article-images';

console.log('\n🔧 Fixing Supabase Storage Public Access...\n');
console.log('Configuration:');
console.log(`  - Bucket: ${bucketName}`);
console.log(`  - Making bucket PUBLIC for read access\n`);

async function fixStorageAccess() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Update bucket to be public
    console.log('1️⃣ Setting bucket to PUBLIC...');
    const { data: updateData, error: updateError } = await supabase.storage
      .updateBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/*']
      });

    if (updateError) {
      console.error(`   ✗ Failed: ${updateError.message}`);
      return;
    }

    console.log(`   ✓ Bucket "${bucketName}" is now PUBLIC!`);

    // Test access
    console.log('\n2️⃣ Testing public access...');
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list('articles', {
        limit: 1
      });

    if (listError) {
      console.error(`   ✗ Failed to list files: ${listError.message}`);
      return;
    }

    if (files && files.length > 0) {
      const testFile = files[0];
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`articles/${testFile.name}`);

      console.log(`   ✓ Sample public URL: ${urlData.publicUrl}`);
      console.log(`   ✓ Try accessing this URL in your browser`);
    }

    console.log('\n✅ Storage is now publicly accessible!\n');
    console.log('💡 Refresh your Next.js app to see images load correctly.\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
  }
}

fixStorageAccess();
