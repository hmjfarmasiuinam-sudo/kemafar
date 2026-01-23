/**
 * About Page
 * Company information and history
 */

import { Metadata } from 'next';
import { AboutContent } from '@/features/about/components/AboutContent';
import { RepositoryFactory } from '@/infrastructure/repositories/RepositoryFactory';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Tentang HMJF UIN Alauddin Makassar - Himpunan Mahasiswa Jurusan Farmasi',
};

export default async function AboutPage() {
  const settingsRepo = RepositoryFactory.getSettingsRepository();
  const aboutSettings = await settingsRepo.getAboutSettings();

  return <AboutContent data={aboutSettings} />;
}
