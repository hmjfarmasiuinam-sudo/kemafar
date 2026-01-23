# Phase 0: Discovery & Analysis Inventory
**Date:** 2026-01-24
**Status:** ✅ Complete

---

## 1. Files Importing from `@/lib/constants`

**Total: 14 files**

### Public Pages (4)
- `src/app/layout.tsx`
- `src/app/(public)/articles/page.tsx`
- `src/app/(public)/articles/[slug]/page.tsx`
- `src/app/(public)/events/[slug]/page.tsx`
- `src/app/(public)/leadership/page.tsx`

### Features (3)
- `src/features/articles/components/ArticlesGrid.tsx`
- `src/features/events/components/EventsGrid.tsx`
- `src/features/home/components/ArticlesPreview.tsx`

### Shared Components (6)
- `src/shared/components/layout/FloatingDock.tsx`
- `src/shared/components/layout/Footer.tsx`
- `src/shared/components/layout/Header.tsx`
- `src/shared/components/layout/MobileMenu.tsx`
- `src/shared/components/layout/Navigation.tsx`
- `src/shared/components/ui/WhatsAppButton.tsx`

---

## 2. Constants to be Extracted

### From `src/lib/constants.ts`:

#### Site Configuration (→ `config/site.config.ts`)
```typescript
- SITE_CONFIG (name, fullName, url, description, whatsappNumber, email, instagram, address)
```

#### Domain Configuration (→ `config/domain.config.ts`)
```typescript
- ARTICLE_CATEGORIES
- EVENT_CATEGORIES
- DIVISIONS
- GALLERY_CATEGORIES
```

#### Navigation Configuration (→ `config/navigation.config.ts`)
```typescript
- ROUTES (home, about, articles, events, leadership, members, gallery)
```

---

## 3. Unused Variables (ESLint)

**Found: 2 unused variables**

1. **File:** Unknown (line 31)
   - Variable: `authorId`
   - Issue: Assigned but never used

2. **File:** Unknown (line 6)
   - Variable: `Variant`
   - Issue: Defined but never used

**Action:** Will be fixed in Phase 2 (Clean Up Imports)

---

## 4. Files with Error Handling (try-catch blocks)

**Total: 32 files**

### Admin Pages (12)
- `src/app/admin/articles/[id]/page.tsx`
- `src/app/admin/articles/page.tsx`
- `src/app/admin/dashboard/page.tsx`
- `src/app/admin/events/[id]/page.tsx`
- `src/app/admin/events/page.tsx`
- `src/app/admin/leadership/[id]/page.tsx`
- `src/app/admin/leadership/page.tsx`
- `src/app/admin/members/[id]/page.tsx`
- `src/app/admin/members/page.tsx`
- `src/app/admin/settings/page.tsx`
- `src/app/admin/users/[id]/page.tsx`
- `src/app/admin/users/page.tsx`

### API Routes (8)
- `src/app/api/admin/create-user/route.ts`
- `src/app/api/admin/settings/about/route.ts`
- `src/app/api/admin/settings/home/route.ts`
- `src/app/api/admin/settings/route.ts`
- `src/app/api/admin/users/[id]/route.ts`
- `src/app/api/admin/users/route.ts`
- `src/app/api/articles/featured/route.ts`
- `src/app/api/events/upcoming/route.ts`

### Auth (1)
- `src/app/auth/login/page.tsx`

### Public Pages (2)
- `src/app/(public)/leadership/page.tsx`
- `src/app/(public)/members/page.tsx`

### Features (2)
- `src/features/home/components/ArticlesPreview.tsx`
- `src/features/home/components/EventsPreview.tsx`

### Infrastructure (5)
- `src/infrastructure/repositories/JsonEventRepository.ts`
- `src/infrastructure/repositories/SupabaseArticleRepository.ts`
- `src/infrastructure/repositories/SupabaseEventRepository.ts`
- `src/infrastructure/repositories/SupabaseLeadershipRepository.ts`
- `src/infrastructure/repositories/SupabaseMemberRepository.ts`

### Lib & Components (2)
- `src/lib/auth/AuthContext.tsx`
- `src/lib/utils/error-handler.ts`
- `src/shared/components/RichTextEditor.tsx`

**Action:** Will be reviewed in Phase 4 (Improve Error Handling)

---

## 5. Critical Files Needing Documentation

### High Priority (Phase 3)
1. `src/lib/auth/AuthContext.tsx` - Complex auth flow
2. `src/infrastructure/repositories/Supabase*.ts` - Repository implementations
3. `src/core/repositories/I*.ts` - Repository interfaces
4. `supabase/migrations/20240122000000_initial_schema.sql` - RLS policies

### Medium Priority (Phase 3)
5. `src/lib/supabase/client.ts` - Client-side Supabase setup
6. `src/lib/supabase/server.ts` - Server-side Supabase setup
7. `src/core/factories/RepositoryFactory.ts` - Factory pattern

---

## 6. Code Consistency Issues (to check in Phase 5)

### Areas to Verify:
- [ ] Naming conventions (camelCase, PascalCase, UPPER_SNAKE_CASE)
- [ ] File naming patterns (component.tsx vs component/index.tsx)
- [ ] Import ordering (React, external, internal)
- [ ] Export patterns (named vs default)
- [ ] Component structure consistency
- [ ] Props interface naming (e.g., ComponentProps vs ComponentPropsType)

---

## 7. Documentation Needed (Phase 6)

### New Files to Create:
- [ ] `README.md` (complete rewrite)
- [ ] `docs/SETUP.md`
- [ ] `docs/SUPABASE.md`
- [ ] `docs/ARCHITECTURE.md`
- [ ] `docs/NEW_ENTITY.md`
- [ ] `CONTRIBUTING.md`

### Files to Enhance:
- [ ] `.env.example` (add detailed comments)

---

## 8. Phase 1 Action Items (NEXT)

### Create 3 Config Files:
1. `config/site.config.ts`
2. `config/domain.config.ts`
3. `config/navigation.config.ts`

### Update 16+ Files:
1. `src/lib/constants.ts` (split content)
2. `tsconfig.json` (add path alias)
3. All 14 importing files listed above

### Verification:
- [ ] `npm run build` → success
- [ ] `npm run lint` → no errors
- [ ] All pages render correctly
- [ ] No broken imports

---

## Summary

✅ **14 files** need import updates for constants extraction
✅ **2 unused variables** to remove
✅ **32 files** with error handling to review
✅ **7 critical files** need documentation
✅ **6 new documentation files** to create
✅ Ready to proceed to Phase 1

**Next Step:** Start Phase 1 - Extract Configuration
