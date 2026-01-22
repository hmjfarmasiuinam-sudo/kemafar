'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Award, 
  LogOut,
  Menu,
  X,
  UserCog
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: ('super_admin' | 'admin' | 'kontributor')[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'kontributor'] },
  { name: 'Members', href: '/admin/members', icon: Users, roles: ['super_admin', 'admin'] },
  { name: 'Articles', href: '/admin/articles', icon: FileText, roles: ['super_admin', 'admin', 'kontributor'] },
  { name: 'Events', href: '/admin/events', icon: Calendar, roles: ['super_admin', 'admin', 'kontributor'] },
  { name: 'Leadership', href: '/admin/leadership', icon: Award, roles: ['super_admin', 'admin'] },
  { name: 'Users', href: '/admin/users', icon: UserCog, roles: ['super_admin'] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[AdminLayout] Auth check:', { loading, user: !!user, profile: !!profile });
    }

    if (!loading && !user) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[AdminLayout] No user, redirecting to login');
      }
      router.push('/auth/login');
    } else if (!loading && user && !profile) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[AdminLayout] User exists but no profile, redirecting to login');
      }
      router.push('/auth/login');
    }
  }, [loading, user, profile, router]);

  // Show loading state
  if (loading) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[AdminLayout] Showing loading state');
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user || !profile) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[AdminLayout] No user or profile, returning null');
    }
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  // Filter navigation based on role
  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(profile.role)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-emerald-600">Kemafar</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-600 font-medium text-sm">
                  {profile.full_name?.charAt(0).toUpperCase() || profile.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile.full_name || profile.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {profile.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign out */}
          <div className="px-3 py-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-full px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1" />
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              View Website
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
