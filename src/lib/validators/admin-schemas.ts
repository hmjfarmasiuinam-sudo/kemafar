/**
 * Admin Form Validation Schemas
 * Server-side validation for all admin CRUD operations
 * Prevents XSS, SQL injection, and data integrity issues
 */

import { z } from 'zod';

// =============================================
// ARTICLE VALIDATION
// =============================================

export const articleSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(200, 'Slug must not exceed 200 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens only')
    .trim(),
  excerpt: z
    .string()
    .min(50, 'Excerpt must be at least 50 characters')
    .max(500, 'Excerpt must not exceed 500 characters')
    .trim(),
  content: z
    .string()
    .min(100, 'Content must be at least 100 characters')
    .max(50000, 'Content must not exceed 50,000 characters'),
  category: z.enum(['post', 'blog', 'opinion', 'publication', 'info'], {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  cover_image: z
    .string()
    .url('Cover image must be a valid URL')
    .optional()
    .or(z.literal('')),
  tags: z
    .string()
    .transform((val) =>
      val
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    )
    .pipe(
      z
        .array(z.string().min(2).max(50))
        .max(10, 'Maximum 10 tags allowed')
    )
    .optional(),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'pending', 'published', 'archived']).default('draft'),
});

export type ArticleInput = z.infer<typeof articleSchema>;

// =============================================
// EVENT VALIDATION
// =============================================

export const eventSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(200, 'Slug must not exceed 200 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens only')
    .trim(),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(1000, 'Description must not exceed 1,000 characters')
    .trim(),
  content: z
    .string()
    .min(100, 'Content must be at least 100 characters')
    .max(50000, 'Content must not exceed 50,000 characters'),
  category: z.enum(['seminar', 'workshop', 'community-service', 'competition', 'training', 'other'], {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).default('upcoming'),
  start_date: z
    .string()
    .datetime({ message: 'Invalid start date format' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')),
  end_date: z
    .string()
    .datetime({ message: 'Invalid end date format' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')),
  location_type: z.enum(['online', 'offline', 'hybrid']),
  location_address: z.string().min(5, 'Address must be at least 5 characters').max(500).trim(),
  location_maps_url: z.string().url('Invalid maps URL').optional().or(z.literal('')),
  cover_image: z.string().url('Cover image must be a valid URL').optional().or(z.literal('')),
  organizer_name: z.string().min(2, 'Organizer name must be at least 2 characters').max(200).trim(),
  organizer_contact: z.string().max(200).optional().or(z.literal('')),
  registration_url: z.string().url('Invalid registration URL').optional().or(z.literal('')),
  registration_deadline: z
    .string()
    .datetime({ message: 'Invalid deadline format' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'))
    .optional()
    .or(z.literal('')),
  max_participants: z
    .number()
    .int()
    .positive('Max participants must be positive')
    .max(10000, 'Max participants seems unreasonably high')
    .optional()
    .or(z.literal(0)),
  tags: z
    .string()
    .transform((val) =>
      val
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    )
    .pipe(z.array(z.string().min(2).max(50)).max(10, 'Maximum 10 tags allowed'))
    .optional(),
  featured: z.boolean().default(false),
}).refine(
  (data) => {
    // Ensure end_date is after start_date
    return new Date(data.end_date) >= new Date(data.start_date);
  },
  {
    message: 'End date must be equal to or after start date',
    path: ['end_date'],
  }
);

export type EventInput = z.infer<typeof eventSchema>;

// =============================================
// MEMBER VALIDATION
// =============================================

export const memberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200).trim(),
  nim: z
    .string()
    .min(5, 'NIM must be at least 5 characters')
    .max(50)
    .regex(/^[A-Z0-9]+$/, 'NIM must be uppercase alphanumeric')
    .trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number format')
    .min(8, 'Phone number too short')
    .max(20, 'Phone number too long')
    .optional()
    .or(z.literal('')),
  photo: z.string().url('Photo must be a valid URL').optional().or(z.literal('')),
  batch: z.string().min(4, 'Batch must be at least 4 characters (e.g., 2020)').max(10).trim(),
  status: z.enum(['active', 'inactive', 'alumni']).default('active'),
  division: z.string().max(100).optional().or(z.literal('')),
  position: z.string().max(100).optional().or(z.literal('')),
  joined_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional()
    .or(z.literal('')),
  graduated_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional()
    .or(z.literal('')),
  bio: z.string().max(1000, 'Bio must not exceed 1,000 characters').optional().or(z.literal('')),
  interests: z
    .string()
    .max(500)
    .transform((val) =>
      val
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i.length > 0)
    )
    .optional(),
  achievements: z
    .string()
    .max(1000)
    .transform((val) =>
      val
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0)
    )
    .optional(),
  social_media_instagram: z.string().max(200).optional().or(z.literal('')),
  social_media_linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  social_media_twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
});

export type MemberInput = z.infer<typeof memberSchema>;

// =============================================
// LEADERSHIP VALIDATION
// =============================================

export const leadershipSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200).trim(),
  position: z.enum(
    ['ketua', 'wakil-ketua', 'sekretaris', 'bendahara', 'coordinator', 'member'],
    {
      errorMap: () => ({ message: 'Invalid position' }),
    }
  ),
  division: z.string().max(100).optional().or(z.literal('')),
  photo: z.string().url('Photo must be a valid URL'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number format')
    .min(8)
    .max(20)
    .optional()
    .or(z.literal('')),
  nim: z.string().min(5).max(50).optional().or(z.literal('')),
  batch: z.string().min(4).max(10).optional().or(z.literal('')),
  bio: z.string().max(1000, 'Bio must not exceed 1,000 characters').optional().or(z.literal('')),
  social_media_instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
  social_media_linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  social_media_twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  period_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  order: z.number().int().positive('Order must be positive'),
}).refine(
  (data) => {
    return new Date(data.period_end) >= new Date(data.period_start);
  },
  {
    message: 'Period end must be equal to or after period start',
    path: ['period_end'],
  }
);

export type LeadershipInput = z.infer<typeof leadershipSchema>;

// =============================================
// USER VALIDATION (Admin)
// =============================================

export const userSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(200).trim(),
  role: z.enum(['super_admin', 'admin', 'kontributor', 'user'], {
    errorMap: () => ({ message: 'Invalid role' }),
  }),
  avatar_url: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
});

export type UserInput = z.infer<typeof userSchema>;

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Safely parse and validate data with error handling
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

/**
 * Format Zod errors for user-friendly display
 */
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join('.');
    formatted[path] = err.message;
  });

  return formatted;
}
