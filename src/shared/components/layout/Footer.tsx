/**
 * Footer Component
 * Server component that fetches dynamic contact settings
 */

import { getContactSettings } from '@/lib/api/settings';
import { SITE_CONFIG } from '@/config/site.config';
import { FooterClient } from './FooterClient';

export async function Footer() {
  const contactSettings = await getContactSettings();

  return <FooterClient contactSettings={contactSettings} siteName={SITE_CONFIG.name} />;
}
