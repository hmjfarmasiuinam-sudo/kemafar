# Plan: Members Refactor - Auto-populate from Leadership

## 🎯 Tujuan
Mengubah Members dari CRUD manual menjadi **read-only auto-populated** dari Leadership yang sudah expired (alumni/non-aktif).

## 📋 Konsep

### Logika Bisnis Baru:
- **Leadership** = Kepengurusan aktif (period_end >= today)
- **Members** = Alumni/Arsip kepengurusan (period_end < today)
- **NIM** = Grouping key untuk merge multiple positions dari orang yang sama

### Alur Data:
```
Leadership (CRUD) → Auto-filter by period_end → Members (Read-only)
                                                      ↓
                                              Group by NIM
                                                      ↓
                                          Show person + history
```

## 🗑️ Phase 1: CLEANING (Hapus yang Tidak Diperlukan)

### 1.1 Database Schema
**File:** Supabase Dashboard / Migration files

**Action:**
- [ ] **DROP table `members`** (jika ada table terpisah)
  ```sql
  DROP TABLE IF EXISTS members CASCADE;
  ```
- [ ] **Hapus RLS policies untuk members** (jika ada)
- [ ] **Hapus indexes untuk members** (jika ada)

**Note:** Leadership table tetap dipertahankan, cukup hapus members table

---

### 1.2 API Layer
**File:** `/home/rahmat/mvp/next-supabase-vercel-kit/src/lib/api/members.ts`

**Action:**
- [ ] **HAPUS seluruh file** `src/lib/api/members.ts`
- [ ] Buat file baru nanti di Phase 2

---

### 1.3 Types
**File:** `/home/rahmat/mvp/next-supabase-vercel-kit/src/types/forms.ts`

**Action:**
- [ ] **HAPUS** `MemberFormData` interface (lines 44-62)
  ```typescript
  // HAPUS INI:
  export interface MemberFormData {
    name: string;
    nim: string;
    email: string;
    phone: string;
    photo: string;
    batch: string;
    status: MemberStatus;
    division: string;
    position: string;
    joined_at: string;
    graduated_at: string;
    bio: string;
    interests: string;
    achievements: string;
    social_media_instagram: string;
    social_media_linkedin: string;
    social_media_twitter: string;
  }
  ```

**File:** `/home/rahmat/mvp/next-supabase-vercel-kit/src/types/database.ts` (jika ada)

**Action:**
- [ ] **HAPUS** member-related types (jika ada)

---

### 1.4 Constants
**File:** `/home/rahmat/mvp/next-supabase-vercel-kit/src/lib/constants/admin.ts`

**Action:**
- [ ] **HAPUS** `MemberStatus` type (jika tidak digunakan di tempat lain)
- [ ] Review apakah ada constant lain yang terkait members

---

### 1.5 Admin CRUD Pages
**Directory:** `/home/rahmat/mvp/next-supabase-vercel-kit/src/app/admin/members`

**Action:**
- [ ] **HAPUS seluruh folder** `src/app/admin/members`
  - `page.tsx` (list page with CRUD)
  - `[id]/page.tsx` (form page)
  - Semua file terkait

---

### 1.6 Public Members Page (akan di-refactor)
**File:** `/home/rahmat/mvp/next-supabase-vercel-kit/src/app/(public)/members/page.tsx`

**Action:**
- [ ] **BACKUP** file ini dulu (copy ke `page.tsx.backup`)
- [ ] **HAPUS seluruh konten** untuk ditulis ulang di Phase 2

---

### 1.7 Admin Navigation (jika ada link ke Members CRUD)
**File:** `/home/rahmat/mvp/next-supabase-vercel-kit/src/config/navigation.config.ts` atau similar

**Action:**
- [ ] **HAPUS** link ke `/admin/members` dari admin sidebar/navigation
- [ ] atau **ubah** jadi read-only link (tanpa create/edit/delete)

---

## ✨ Phase 2: IMPLEMENTATION (Logika Baru)

### 2.1 Create New API Layer
**File:** `/home/rahmat/mvp/next-supabase-vercel-kit/src/lib/api/members.ts` (buat baru)

**Action:**
- [ ] **Create file baru** dengan fungsi:

```typescript
import { supabase } from '@/lib/supabase/client';
import type { LeadershipMember } from './leadership';

/**
 * Get all expired leadership (alumni/members)
 * Grouped by NIM to show person history
 */
export async function getMembers() {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('leadership')
    .select('*')
    .lt('period_end', today)
    .order('period_end', { ascending: false });

  if (error) throw error;
  return data as LeadershipMember[];
}

/**
 * Group members by NIM (same person, multiple positions)
 */
export function groupMembersByNIM(members: LeadershipMember[]) {
  return members.reduce((acc, member) => {
    const nim = member.nim || 'unknown';
    if (!acc[nim]) {
      acc[nim] = [];
    }
    acc[nim].push(member);
    return acc;
  }, {} as Record<string, LeadershipMember[]>);
}

/**
 * Get member detail by NIM (all positions)
 */
export async function getMemberByNIM(nim: string) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('leadership')
    .select('*')
    .eq('nim', nim)
    .lt('period_end', today)
    .order('period_end', { ascending: false });

  if (error) throw error;
  return data as LeadershipMember[];
}
```

---

### 2.2 Refactor Public Members Page
**File:** `/home/rahmat/mvp/next-supabase-vercel-kit/src/app/(public)/members/page.tsx`

**Action:**
- [ ] **Rewrite** dengan logika baru:

```typescript
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { getMembers, groupMembersByNIM } from '@/lib/api/members';
import type { LeadershipMember } from '@/lib/api/leadership';

export default function MembersPage() {
  const [groupedMembers, setGroupedMembers] = useState<Record<string, LeadershipMember[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const members = await getMembers();
        const grouped = groupMembersByNIM(members);
        setGroupedMembers(grouped);
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-custom py-20">
      <h1 className="text-4xl font-bold mb-8">Alumni & Anggota</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedMembers).map(([nim, records]) => {
          // Use latest record for display (photo, bio, etc)
          const latest = records[0];
          
          return (
            <div key={nim} className="bg-white rounded-lg shadow-md p-6">
              {/* Photo */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                {latest.photo ? (
                  <Image
                    src={latest.photo}
                    alt={latest.name}
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Personal Info */}
              <h3 className="text-xl font-bold text-center">{latest.name}</h3>
              <p className="text-sm text-gray-600 text-center">NIM: {nim}</p>
              <p className="text-sm text-gray-600 text-center">{latest.batch}</p>

              {/* Position History */}
              <div className="mt-4 border-t pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Riwayat Jabatan:
                </p>
                <ul className="space-y-1">
                  {records.map((record) => (
                    <li key={record.id} className="text-sm text-gray-700">
                      • {record.position} 
                      {record.division && ` - ${record.division}`}
                      <span className="text-gray-500 text-xs ml-2">
                        ({record.period_start.split('-')[0]} - {record.period_end.split('-')[0]})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bio (from latest) */}
              {latest.bio && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {latest.bio.replace(/<[^>]*>/g, '')} {/* Strip HTML */}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

### 2.3 Optional: Member Detail Page
**File:** `/home/rahmat/mvp/next-supabase-vercel-kit/src/app/(public)/members/[nim]/page.tsx` (buat baru)

**Action:**
- [ ] **Create** detail page untuk show full history per person:

```typescript
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMemberByNIM } from '@/lib/api/members';
import type { LeadershipMember } from '@/lib/api/leadership';

export default function MemberDetailPage() {
  const params = useParams();
  const nim = params.nim as string;
  const [records, setRecords] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMemberByNIM(nim);
        setRecords(data);
      } catch (error) {
        console.error('Failed to fetch member:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nim]);

  if (loading) return <div>Loading...</div>;
  if (records.length === 0) return <div>Member not found</div>;

  const latest = records[0];

  return (
    <div className="container-custom py-20">
      {/* Full member profile with complete history */}
      <h1>{latest.name}</h1>
      {/* ... detail lengkap ... */}
    </div>
  );
}
```

---

### 2.4 Update Leadership Form (Optional Enhancement)
**File:** `/home/rahmat/mvp/next-supabase-vercel-kit/src/app/admin/leadership/[id]/page.tsx`

**Action:**
- [ ] **Add NIM lookup** untuk auto-fill data dari record sebelumnya:

```typescript
// Di dalam component:
const [nimSearch, setNimSearch] = useState('');

async function handleNimSearch(nim: string) {
  // Search existing records with same NIM
  const { data } = await supabase
    .from('leadership')
    .select('*')
    .eq('nim', nim)
    .order('period_end', { ascending: false })
    .limit(1)
    .single();

  if (data) {
    // Auto-fill personal data
    setFormData({
      ...formData,
      name: data.name,
      email: data.email,
      phone: data.phone,
      photo: data.photo,
      batch: data.batch,
      bio: data.bio,
      social_media_instagram: data.social_media?.instagram || '',
      social_media_linkedin: data.social_media?.linkedin || '',
      social_media_twitter: data.social_media?.twitter || '',
      nim: nim,
    });
    
    toast.info('Data pribadi terisi otomatis dari record sebelumnya');
  }
}
```

---

## 🧪 Phase 3: TESTING

### 3.1 Test Scenarios
- [ ] **Test 1:** Leadership dengan period_end < today muncul di Members
- [ ] **Test 2:** Leadership dengan period_end >= today TIDAK muncul di Members
- [ ] **Test 3:** Multiple positions dengan NIM sama ter-group dengan benar
- [ ] **Test 4:** History ditampilkan dengan urutan yang benar (terbaru ke lama)
- [ ] **Test 5:** Data personal (foto, bio) diambil dari record terbaru
- [ ] **Test 6:** Member detail page (jika dibuat) menampilkan full history

### 3.2 Edge Cases
- [ ] **Test:** NIM kosong/null → how to handle?
- [ ] **Test:** Duplicate NIM dalam periode yang sama → allowed or not?
- [ ] **Test:** Update foto di leadership lama → apakah perlu sync?

---

## 📊 Phase 4: DATA MIGRATION (Jika ada data members existing)

**Jika sudah ada data di table members yang terpisah:**

### 4.1 Backup Data
```sql
-- Backup existing members data
CREATE TABLE members_backup AS SELECT * FROM members;
```

### 4.2 Migrate to Leadership
```sql
-- Insert members data ke leadership table
INSERT INTO leadership (
  name, nim, email, phone, photo, batch, bio,
  position, division, period_start, period_end,
  social_media, order
)
SELECT 
  name, nim, email, phone, photo, batch, bio,
  position, division, joined_at, graduated_at,
  jsonb_build_object(
    'instagram', social_media_instagram,
    'linkedin', social_media_linkedin,
    'twitter', social_media_twitter
  ),
  999 -- default order
FROM members;
```

### 4.3 Verify Migration
```sql
-- Check count
SELECT COUNT(*) FROM members;
SELECT COUNT(*) FROM leadership WHERE period_end < CURRENT_DATE;

-- Spot check
SELECT * FROM leadership WHERE nim IN (
  SELECT nim FROM members LIMIT 5
);
```

### 4.4 Drop Old Table
```sql
-- Setelah verifikasi OK
DROP TABLE members CASCADE;
```

---

## 🚀 Phase 5: DEPLOYMENT

### 5.1 Pre-deployment Checklist
- [ ] All tests passed
- [ ] Data migration completed (if needed)
- [ ] No broken links in navigation
- [ ] No TypeScript errors
- [ ] No console errors

### 5.2 Deployment Steps
1. [ ] Commit all changes
2. [ ] Push to staging/dev branch
3. [ ] Test di staging environment
4. [ ] Merge to main
5. [ ] Deploy to production
6. [ ] Monitor for errors

### 5.3 Rollback Plan
**Jika ada masalah:**
- [ ] Restore members table dari backup
- [ ] Revert code changes
- [ ] Deploy rollback

---

## 📝 Summary of Changes

### Files to DELETE:
```
❌ src/app/admin/members/              (entire folder)
❌ src/lib/api/members.ts               (old version)
❌ MemberFormData from src/types/forms.ts
```

### Files to CREATE:
```
✅ src/lib/api/members.ts               (new version - read-only)
✅ src/app/(public)/members/[nim]/page.tsx (optional detail page)
```

### Files to MODIFY:
```
🔧 src/app/(public)/members/page.tsx    (refactor to read-only)
🔧 src/types/forms.ts                   (remove MemberFormData)
🔧 src/lib/constants/admin.ts           (remove MemberStatus if unused)
🔧 src/app/admin/leadership/[id]/page.tsx (optional NIM lookup)
```

### Database Changes:
```
🗑️ DROP TABLE members (if exists)
🗑️ DROP RLS policies for members
```

---

## ⏱️ Estimasi Waktu
- Phase 1 (Cleaning): ~30 menit
- Phase 2 (Implementation): ~2 jam
- Phase 3 (Testing): ~1 jam
- Phase 4 (Migration): ~30 menit (jika ada data existing)
- Phase 5 (Deployment): ~30 menit

**Total:** ~4-5 jam

---

## ✅ Success Criteria
1. ✅ Members page menampilkan alumni dari leadership
2. ✅ Group by NIM bekerja dengan benar
3. ✅ Position history ditampilkan per person
4. ✅ Tidak ada CRUD di members (read-only)
5. ✅ Leadership CRUD tetap berfungsi normal
6. ✅ No TypeScript errors
7. ✅ No broken UI/UX

---

## 🎯 Next Steps After This Plan
1. Review plan ini
2. Approve atau request changes
3. Mulai eksekusi Phase 1 (Cleaning)
4. Progress ke Phase 2, 3, 4, 5

---

**Created:** 2026-01-30  
**Status:** DRAFT - Waiting for Approval
