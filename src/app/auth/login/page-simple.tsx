'use client';

import Link from 'next/link';
import { SITE_CONFIG } from '@/config';

export default function SimpleLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-emerald-600">{SITE_CONFIG.name}</h1>
            <p className="text-sm text-gray-600 mt-1">Admin Panel - Simple Test</p>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Test Page</h2>
          <p className="text-gray-600">
            If you can see this, the basic page rendering works.
          </p>
          <p className="text-gray-600 mt-4">
            The issue is likely with AuthContext or Supabase client.
          </p>
        </div>
      </div>
    </div>
  );
}
