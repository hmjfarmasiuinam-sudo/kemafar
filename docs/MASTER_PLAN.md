# Master Plan: Next.js + Supabase Starterkit

**Goal:** Transform this codebase into a production-ready starterkit seperti Laravel Breeze.

**Timeline:** 6-9 hours total | **Status:** Phase 0 (Planning)

---

## 🚨 SACRED RULES - WAJIB DIIKUTI SELALU

> **CRITICAL:** Rules ini MUST be followed in EVERY phase, especially during compact mode.

### Rule #1: Complete File Tracking
```
BEFORE editing anything:
✅ List ALL files to be edited in this phase
✅ Find ALL files that import from files being changed
✅ Create complete checklist
✅ Check off one by one after completion

FORBIDDEN:
❌ Edit files not in checklist
❌ Skip files in checklist
❌ Forget to update import statements
```

### Rule #2: One Phase Completion
```
✅ Complete 1 phase FULLY before moving to next
✅ Test each phase before commit
✅ Fix errors immediately before proceeding

FORBIDDEN:
❌ Jump to another phase before completion
❌ Commit code with errors
❌ Mix changes from 2 different phases
```

### Rule #3: Import Dependencies
```
✅ Find ALL files importing from changed files
✅ Update ALL import statements
✅ Verify no broken imports

FORBIDDEN:
❌ Forget to update imports
❌ Leave broken imports
❌ Assume "probably no other files import this"
```

### Rule #4: Verification Checklist
```
Each phase MUST check:
✅ npm run build → success
✅ npm run lint → no errors
✅ All imports resolved
✅ No unused imports/variables
✅ Features still working (manual test)

FORBIDDEN:
❌ Skip verification
❌ Commit without testing build
❌ "Will fix errors later"
```

### Rule #5: Compact Mode Protection
```
IF COMPACT MODE HAPPENS:
✅ Still follow checklist strictly
✅ Explicitly state which files edited
✅ Confirm all imports updated
✅ Don't skip verification

FORBIDDEN:
❌ Rush because of compact mode
❌ Skip "small" files
❌ Forget imports due to rushing
```

---

## 📋 EXECUTION PHASES

### Phase 0: Discovery & Analysis ⏳ IN PROGRESS

**Goal:** Identify everything that needs refactoring

**Tasks:**
1. ✅ Scan for constants that should be config
2. ✅ Find files importing from `constants.ts`
3. ✅ Check for unused imports (ESLint)
4. ✅ Identify code duplication
5. ✅ Check for inconsistent patterns
6. ✅ List undocumented critical code

**Output:** Complete inventory for phases 1-6

**Status:** ⏸️ Waiting to start

---

### Phase 1: Extract Configuration 📦 NOT STARTED

**Goal:** Move hardcoded values to config files

**Estimated Time:** 1.5-2 hours

#### Pre-Phase Checklist:
- [ ] Run: `grep -r "from '@/lib/constants'" src/`
- [ ] List all importing files
- [ ] Verify no circular dependencies

#### Files to CREATE:
```
[ ] config/site.config.ts
    Content: SITE_CONFIG (name, email, phone, address, social)

[ ] config/domain.config.ts
    Content: ARTICLE_CATEGORIES, EVENT_CATEGORIES, DIVISIONS, GALLERY_CATEGORIES

[ ] config/navigation.config.ts
    Content: ROUTES, admin navigation structure
```

#### Files to EDIT:
```
[ ] src/lib/constants.ts
    Action: Split into 3 config files above
    Keep: Only framework-level constants (if any)
    Lines: ALL (entire file restructure)

[ ] tsconfig.json
    Action: Add config path alias
    Add to paths: "@/config/*": ["./config/*"]
    Lines: ~15 (compilerOptions.paths)
```

#### Files that IMPORT (MUST UPDATE):

**Step 1: Find all importing files**
```bash
grep -r "from '@/lib/constants'" src/ --include="*.ts" --include="*.tsx"
```

**Step 2: Update each file individually**

```
[ ] src/shared/components/layout/Footer.tsx
    OLD: import { SITE_CONFIG, ROUTES } from '@/lib/constants'
    NEW: import { SITE_CONFIG } from '@/config/site.config'
         import { ROUTES } from '@/config/navigation.config'
    Lines: ~9

[ ] src/shared/components/layout/Header.tsx
    OLD: import { SITE_CONFIG, ROUTES } from '@/lib/constants'
    NEW: import { SITE_CONFIG } from '@/config/site.config'
         import { ROUTES } from '@/config/navigation.config'
    Lines: ~11

[ ] src/app/admin/layout.tsx
    Action: Check if imports constants, update if needed
    Lines: TBD (check first)

[ ] [RUN GREP TO FIND ALL OTHER FILES]
    Process each one individually
    Track in checklist
```

#### Verification Checklist:
```
[ ] npm run build → ✅ success
[ ] npm run lint → ✅ no errors
[ ] No console errors about imports
[ ] Header component renders
[ ] Footer component renders
[ ] Admin panel navigates correctly
[ ] Homepage loads without errors
[ ] Run: grep -r "from '@/lib/constants'" src/ → should return minimal or zero results
```

#### Commit Message:
```
refactor: extract configuration from constants

- Split constants.ts into site/domain/navigation configs
- Update all import statements across codebase
- Add @/config/* path alias to tsconfig
- No functional changes, pure refactoring
```

---

### Phase 2: Clean Up Imports 🧹 NOT STARTED

**Goal:** Remove unused imports and organize consistently

**Estimated Time:** 1-1.5 hours

#### Pre-Phase Checklist:
- [ ] Run: `npm run lint`
- [ ] List all files with unused import warnings
- [ ] Prioritize by severity

#### Files to SCAN & FIX:

**Step 1: Get list of files with issues**
```bash
npm run lint 2>&1 | grep "unused" | cut -d':' -f1 | sort -u
```

**Step 2: Fix each file**
```
[ ] For each file with unused imports:
    - Remove unused imports
    - Organize: React → External libs → Internal
    - Remove unused variables
    - Track completion

Pattern:
// ✅ Good import order:
import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/shared/components/ui/Button';
import { SITE_CONFIG } from '@/config/site.config';
```

#### Verification Checklist:
```
[ ] npm run lint → ✅ 0 warnings about unused imports
[ ] npm run build → ✅ success
[ ] All pages still render correctly
[ ] No new console errors
```

#### Commit Message:
```
chore: clean up unused imports and organize

- Remove all unused imports across codebase
- Standardize import order (React, external, internal)
- Remove unused variables
```

---

### Phase 3: Add Critical Documentation 📝 NOT STARTED

**Goal:** Document complex/critical code with JSDoc and inline comments

**Estimated Time:** 2-2.5 hours

#### Files to DOCUMENT:

```
[ ] src/lib/auth/AuthContext.tsx
    Add:
    - JSDoc for AuthContextType interface
    - Explain JWT flow in comments
    - Document each permission function
    - Explain race condition handling
    Lines: Throughout file

[ ] src/core/repositories/IArticleRepository.ts
    Add:
    - JSDoc for each method
    - Explain parameters and return types
    - Document expected behavior
    Lines: Throughout file

[ ] src/core/repositories/IEventRepository.ts
    Similar to above

[ ] src/core/repositories/IMemberRepository.ts
    Similar to above

[ ] src/core/repositories/ILeadershipRepository.ts
    Similar to above

[ ] src/infrastructure/repositories/SupabaseArticleRepository.ts
    Add:
    - Explain RLS policy implications
    - Document query patterns
    - Note performance considerations
    Lines: Throughout file

[ ] supabase/migrations/20240122000000_initial_schema.sql
    Add:
    - Section headers with explanations
    - Explain each RLS policy line by line
    - Document helper functions purpose
    - Note security considerations
    Lines: Throughout file (every 20-30 lines)
```

#### Documentation Standards:

**For TypeScript:**
```typescript
/**
 * Repository interface for managing articles in the system.
 *
 * This follows the repository pattern to abstract data access.
 * Implementations can be swapped (Supabase, JSON, etc.) via factory.
 *
 * @remarks
 * All methods return promises for async database operations.
 * RLS policies are enforced at Supabase level.
 *
 * @see {@link SupabaseArticleRepository} for Supabase implementation
 */
export interface IArticleRepository {
  /**
   * Retrieves all published articles.
   *
   * @returns Promise resolving to array of article list items
   * @throws {Error} If database query fails
   */
  getAll(): Promise<ArticleListItem[]>;
}
```

**For SQL:**
```sql
-- ============================================
-- HELPER FUNCTION: is_admin()
-- ============================================
-- Purpose: Check if current user has admin privileges
-- Strategy: Check JWT claims first (fast), fallback to profiles table
-- Security: SECURITY DEFINER allows safe profiles lookup
-- Used by: RLS policies across multiple tables
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
```

#### Verification Checklist:
```
[ ] No functional code changes
[ ] npm run build → ✅ success (comments don't affect build)
[ ] Documentation is clear and helpful
[ ] No typos in comments
```

#### Commit Message:
```
docs: add comprehensive inline documentation

- Add JSDoc to auth context and repositories
- Document RLS policies and helper functions
- Explain complex patterns and security considerations
```

---

### Phase 4: Improve Error Handling 🛡️ NOT STARTED

**Goal:** Consistent, user-friendly error handling

**Estimated Time:** 1.5-2 hours

#### Pre-Phase Checklist:
- [ ] Find all try-catch blocks: `grep -r "try {" src/ --include="*.ts" --include="*.tsx"`
- [ ] List files with error handling
- [ ] Check if error utility exists

#### Files to SCAN & IMPROVE:

**Step 1: Find all error handling**
```bash
grep -rn "try {" src/ --include="*.ts" --include="*.tsx" | cut -d':' -f1 | sort -u
```

**Step 2: For each try-catch block:**
```
[ ] Check error handling quality:
    - ✅ User-friendly error message shown
    - ✅ Error logged appropriately (console.error in dev)
    - ✅ Loading/error state managed
    - ✅ Toast notification if applicable
    - ❌ Silent failures
    - ❌ Generic "Error occurred" messages

[ ] Update if needed:
    - Add specific error messages
    - Use existing error utilities
    - Show actionable feedback to user
```

#### Error Handling Patterns:

**Good Pattern:**
```typescript
try {
  await supabase.from('articles').insert(data);
  toast.success('Article created successfully');
  router.push('/admin/articles');
} catch (error) {
  console.error('Failed to create article:', error);
  const message = error instanceof Error
    ? error.message
    : 'Failed to create article. Please try again.';
  toast.error(message);
}
```

**Bad Pattern:**
```typescript
try {
  await supabase.from('articles').insert(data);
} catch (error) {
  console.log(error); // ❌ Silent failure, user doesn't know what happened
}
```

#### Verification Checklist:
```
[ ] Test error scenarios manually
[ ] Check error messages in UI are helpful
[ ] Verify errors are logged in dev console
[ ] npm run build → ✅ success
[ ] No breaking changes
```

#### Commit Message:
```
improve: consistent error handling patterns

- Add user-friendly error messages
- Ensure all errors are properly logged
- Add toast notifications where appropriate
```

---

### Phase 5: Code Consistency 🎨 NOT STARTED

**Goal:** Consistent naming, structure, and patterns

**Estimated Time:** 1-1.5 hours

#### Areas to CHECK & FIX:

```
[ ] Naming Conventions
    Check: camelCase for variables/functions
    Check: PascalCase for components/types
    Check: UPPER_SNAKE_CASE for constants
    Fix: Any inconsistencies

[ ] File Naming
    Check: PascalCase for components (Header.tsx)
    Check: kebab-case for utilities (error-handler.ts)
    Fix: Inconsistent file names

[ ] Component Structure
    Check: Consistent order (imports, types, component, export)
    Check: Props interface before component
    Fix: Inconsistent structures

[ ] Export Patterns
    Check: Named exports for utilities
    Check: Default exports for pages/layouts
    Fix: Inconsistent patterns
```

#### Verification Checklist:
```
[ ] npm run lint → ✅ pass
[ ] npm run build → ✅ success
[ ] Manual review of changed files
[ ] No functional changes
```

#### Commit Message:
```
refactor: improve code consistency

- Standardize naming conventions across codebase
- Consistent component structure and exports
- No functional changes
```

---

### Phase 6: Documentation & Polish 📚 NOT STARTED

**Goal:** Create comprehensive docs for starterkit users

**Estimated Time:** 2.5-3 hours

#### Files to CREATE:

```
[ ] README.md (COMPLETE REWRITE)
    Sections:
    - Hero: What is this starterkit
    - Features: What's included (bullets with ✅)
    - Quick Start: 3 steps to run
    - Tech Stack: List all technologies
    - Documentation: Links to guides
    - What You Get: Detailed features showcase
    - Deploy: Vercel button
    Content: ~200-300 lines

[ ] docs/SETUP.md
    Sections:
    1. Prerequisites (Node, npm, Supabase account)
    2. Clone & Install (commands)
    3. Supabase Setup (detailed, copy-paste SQL)
    4. Environment Variables (explained line by line)
    5. Run Dev Server
    6. Create First Admin User
    7. Deploy to Vercel
    Content: ~150-200 lines

[ ] docs/SUPABASE.md
    Sections:
    1. Authentication Flow (JWT, roles, triggers)
    2. RLS Policies Explained (each table, line by line)
    3. Data Fetching (client vs server, repository pattern)
    4. Common Issues & Solutions (troubleshooting)
    Content: ~200-250 lines

[ ] docs/ARCHITECTURE.md
    Sections:
    1. Project Structure (folder tree with explanations)
    2. Clean Architecture Layers (diagram + explanation)
    3. Repository Pattern (why, how, examples)
    4. Data Flow (request → response diagram)
    5. Component Organization
    Content: ~150-200 lines

[ ] docs/NEW_ENTITY.md
    Sections:
    Step-by-step tutorial: How to add new entity
    1. Create Migration
    2. Create Entity Type
    3. Create Repository Interface
    4. Implement Supabase Repository
    5. Add to Factory
    6. Create Admin CRUD Pages
    7. Add RLS Policies
    8. Create Public Pages
    Content: ~200-250 lines

[ ] .env.example (ENHANCE)
    Add: Comprehensive comments for every variable
    Explain: What each variable does
    Content: ~25-30 lines with comments

[ ] CONTRIBUTING.md
    Sections:
    - Code style guidelines
    - Branch naming conventions
    - Commit message format
    - PR process
    Content: ~50-80 lines
```

#### Verification Checklist:
```
[ ] All markdown files render correctly in GitHub
[ ] All internal links work
[ ] Code examples in docs are correct
[ ] No typos or grammar errors
[ ] Documentation is clear and helpful
```

#### Commit Message:
```
docs: comprehensive starterkit documentation

- Complete README rewrite showcasing features
- Add detailed setup guide for Supabase
- Document architecture and patterns
- Add tutorial for extending with new entities
- Enhance .env.example with explanations
```

---

## 🎯 WHAT THIS STARTERKIT OFFERS

### 1. **Supabase Auth + RLS (Fully Configured)** ⭐
- JWT-based authentication
- 3-tier role system (super_admin, admin, kontributor)
- RLS policies on every table
- Helper functions for permissions
- Auto-profile creation trigger
- **This is the hardest part - already done!**

### 2. **Complete Admin Panel CRUD** ⭐
- 4 entity examples (articles, events, members, leadership)
- Consistent CRUD patterns
- Easy to replicate for new entities
- Role-based access control
- Dashboard with statistics
- User management

### 3. **Rich Text Editor (Production Ready)** ⭐
- TipTap integration
- Markdown support
- Image upload
- Tables, links, code blocks
- Preview mode

### 4. **Reusable UI Components** ⭐
- **Animations:** ParallaxHero, TiltCard, SpotlightCard, ScrollReveal
- **Layouts:** FloatingDock, Header, Footer
- **Content:** MarkdownContent renderer
- **Loading:** Skeleton components

### 5. **Public Pages with Supabase Data** ⭐
- Homepage (hero, features, stats, CTA)
- Articles listing & detail
- Events listing & detail
- Members directory
- Leadership page
- **Both client-side and server-side fetching examples**

### 6. **Clean Architecture** ⭐
- Repository pattern
- Factory pattern for swapping implementations
- Clear separation of concerns
- Type-safe throughout

---

## 📊 PROGRESS TRACKING

### Overall Progress: 0/6 Phases Complete

```
[ ] Phase 0: Discovery & Analysis     (0%)
[ ] Phase 1: Extract Configuration    (0%)
[ ] Phase 2: Clean Up Imports         (0%)
[ ] Phase 3: Add Documentation        (0%)
[ ] Phase 4: Improve Error Handling   (0%)
[ ] Phase 5: Code Consistency         (0%)
[ ] Phase 6: Documentation & Polish   (0%)
```

### Time Tracking:

| Phase | Estimated | Actual | Status |
|-------|-----------|--------|--------|
| 0     | 0.5h      | -      | ⏸️      |
| 1     | 2h        | -      | ⏸️      |
| 2     | 1.5h      | -      | ⏸️      |
| 3     | 2.5h      | -      | ⏸️      |
| 4     | 2h        | -      | ⏸️      |
| 5     | 1.5h      | -      | ⏸️      |
| 6     | 3h        | -      | ⏸️      |
| **TOTAL** | **13h** | **-** | ⏸️ |

---

## ✅ SUCCESS CRITERIA

When finished, this starterkit will enable:

- ✅ **Clone → Setup → Run in < 5 minutes**
- ✅ **Clear documentation for Supabase setup**
- ✅ **Obvious patterns for adding new entities**
- ✅ **README that showcases all features**
- ✅ **Architecture that's easy to understand**
- ✅ **Code that's clean and consistent**
- ✅ **Comments that explain complex parts**

---

## 🚀 NEXT STEPS

**RIGHT NOW:**
1. Exit plan mode
2. Start Phase 0: Discovery & Analysis
3. Create detailed inventory of refactoring needs

**Command to start:**
```bash
# Scan for constants imports
grep -r "from '@/lib/constants'" src/ --include="*.ts" --include="*.tsx"

# Check for unused imports
npm run lint | grep "unused"

# Check for anti-patterns
# ... (manual review)
```

---

**Last Updated:** 2026-01-24
**Version:** 1.0
**Status:** Ready to execute
