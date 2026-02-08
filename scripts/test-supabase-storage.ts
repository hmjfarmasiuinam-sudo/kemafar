/**
 * Test Supabase Storage Connection & Bucket Access
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

console.log('\n🔍 Testing Supabase Storage Connection...\n');
console.log('Configuration:');
console.log(`  - Supabase URL: ${supabaseUrl}`);
console.log(`  - Service Role Key: ${supabaseKey ? '✓ Set' : '✗ Missing'}`);
console.log(`  - Bucket Name: ${bucketName}`);
console.log('\n' + '='.repeat(60) + '\n');

async function testStorage() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test 1: List all buckets
    console.log('1️⃣ Listing all buckets...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('   ✗ Error listing buckets:', listError.message);
      return;
    }

    console.log(`   ✓ Found ${buckets.length} bucket(s):`);
    buckets.forEach(bucket => {
      console.log(`     - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });

    // Test 2: Check if target bucket exists
    console.log(`\n2️⃣ Checking if bucket "${bucketName}" exists...`);
    const bucketExists = buckets.some(b => b.name === bucketName);

    if (!bucketExists) {
      console.log(`   ✗ Bucket "${bucketName}" NOT FOUND!`);
      console.log(`\n💡 Creating bucket "${bucketName}"...`);

      const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/*']
      });

      if (createError) {
        console.error(`   ✗ Failed to create bucket: ${createError.message}`);
        return;
      }

      console.log(`   ✓ Bucket "${bucketName}" created successfully!`);
    } else {
      console.log(`   ✓ Bucket "${bucketName}" exists!`);
    }

    // Test 3: Test upload
    console.log(`\n3️⃣ Testing upload to bucket...`);
    const testContent = Buffer.from('Test file content');
    const testPath = 'test/test-file.txt';

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testPath, testContent, {
        contentType: 'text/plain',
        upsert: true
      });

    if (uploadError) {
      console.error(`   ✗ Upload failed: ${uploadError.message}`);
      return;
    }

    console.log(`   ✓ Test upload successful!`);

    // Test 4: Get public URL
    console.log(`\n4️⃣ Getting public URL...`);
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(testPath);

    console.log(`   ✓ Public URL: ${urlData.publicUrl}`);

    // Test 5: Delete test file
    console.log(`\n5️⃣ Cleaning up test file...`);
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([testPath]);

    if (deleteError) {
      console.error(`   ✗ Delete failed: ${deleteError.message}`);
    } else {
      console.log(`   ✓ Test file deleted`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ All tests passed! Storage is ready.\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
  }
}

testStorage();
