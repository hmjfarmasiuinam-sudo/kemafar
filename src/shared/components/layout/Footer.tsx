/**
 * Footer Component
 * Site footer with contact info and links
 */

import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { SITE_CONFIG, ROUTES } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-bold text-lg mb-4">{SITE_CONFIG.name}</h3>
            <p className="text-sm mb-4">
              Agrowisata organik dengan buah-buahan, sayuran, dan bunga segar.
              Nikmati pengalaman bertani yang menyenangkan dan edukatif.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Menu</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={ROUTES.home} className="hover:text-primary-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href={ROUTES.about} className="hover:text-primary-400 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href={ROUTES.gallery} className="hover:text-primary-400 transition-colors">
                  Galeri
                </Link>
              </li>
              <li>
                <Link href={ROUTES.products} className="hover:text-primary-400 transition-colors">
                  Produk
                </Link>
              </li>
              <li>
                <Link href={ROUTES.booking} className="hover:text-primary-400 transition-colors">
                  Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Jl. Agrowisata No. 123, Babulu, Indonesia</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href={`tel:+${SITE_CONFIG.whatsappNumber}`} className="hover:text-primary-400">
                  +{SITE_CONFIG.whatsappNumber}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href="mailto:info@griyaflorababulu.com"
                  className="hover:text-primary-400"
                >
                  info@griyaflorababulu.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>
            &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
