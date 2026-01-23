/**
 * Navigation Configuration
 *
 * Contains all route definitions for the application:
 * - Public routes (homepage, articles, events, etc.)
 * - Admin routes (dashboard, CRUD pages)
 *
 * @remarks
 * Centralizing routes here makes it easy to:
 * - Update URLs without searching through multiple files
 * - Ensure consistency across the application
 * - Maintain type safety with 'as const'
 *
 * @example
 * ```typescript
 * import { ROUTES } from '@/config/navigation.config';
 *
 * <Link href={ROUTES.articles}>Articles</Link>
 * ```
 */

/**
 * Public Routes
 *
 * Main navigation routes for the public-facing website.
 * These are used in headers, footers, and navigation menus.
 */
export const ROUTES = {
  home: '/',
  about: '/about',
  articles: '/articles',
  events: '/events',
  leadership: '/leadership',
  members: '/members',
  gallery: '/gallery',
} as const;

/**
 * Admin Routes
 *
 * Routes for the admin panel and management pages.
 * Access is controlled by RLS policies and middleware.
 */
export const ADMIN_ROUTES = {
  dashboard: '/admin/dashboard',
  articles: '/admin/articles',
  events: '/admin/events',
  members: '/admin/members',
  leadership: '/admin/leadership',
  users: '/admin/users',
  settings: '/admin/settings',
} as const;

/**
 * Auth Routes
 *
 * Routes for authentication pages.
 */
export const AUTH_ROUTES = {
  login: '/auth/login',
  logout: '/auth/logout',
} as const;

/**
 * Type helper for route values
 *
 * @example
 * ```typescript
 * type PublicRoute = RouteValue<typeof ROUTES>;
 * // 'home' | 'about' | 'articles' | ...
 * ```
 */
export type RouteValue<T> = T[keyof T];
