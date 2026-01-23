import { NextResponse, type NextRequest } from 'next/server';

// Middleware disabled: Supabase v2 uses localStorage for session storage, not cookies
// Auth checks are handled by AdminLayout component instead
export function middleware(_req: NextRequest): NextResponse {
  return NextResponse.next();
}
