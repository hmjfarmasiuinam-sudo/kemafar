'use client';

/**
 * Navigation Component
 * Desktop navigation menu
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/shared/utils/cn';

const navItems = [
  { label: 'Beranda', href: ROUTES.home },
  { label: 'Tentang Kami', href: ROUTES.about },
  { label: 'Galeri', href: ROUTES.gallery },
  { label: 'Produk', href: ROUTES.products },
  { label: 'Booking', href: ROUTES.booking },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
