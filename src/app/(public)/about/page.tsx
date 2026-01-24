/**
 * About Page
 * Company information and history
 */

import { Metadata } from 'next';
import { AboutContent } from '@/features/about/components/AboutContent';
import { ABOUT_CONTENT } from '@/config';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'About Your Organization - Learn more about our mission and vision',
};

export default function AboutPage() {
  return <AboutContent data={ABOUT_CONTENT} />;
}
