'use client';

/**
 * WhatsAppButton Component
 * Floating WhatsApp contact button
 */

import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export function WhatsAppButton() {
  const handleClick = () => {
    const message = encodeURIComponent(
      `Halo ${SITE_CONFIG.name}, saya ingin bertanya tentang agrowisata.`
    );
    window.open(
      `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`,
      '_blank'
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </button>
  );
}
