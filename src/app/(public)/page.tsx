import { HeroSection } from '@/features/home/components/HeroSection';
import { FeaturesSection } from '@/features/home/components/FeaturesSection';
import { StatsSection } from '@/features/home/components/StatsSection';
import { ArticlesPreview } from '@/features/home/components/ArticlesPreview';
import { EventsPreview } from '@/features/home/components/EventsPreview';
import { CTASection } from '@/features/home/components/CTASection';
import { RepositoryFactory } from '@/infrastructure/repositories/RepositoryFactory';

export default async function HomePage() {
  const settingsRepo = RepositoryFactory.getSettingsRepository();
  const homeSettings = await settingsRepo.getHomeSettings();

  return (
    <>
      <HeroSection data={homeSettings.hero} />
      <FeaturesSection data={homeSettings.features} />
      <StatsSection />
      <ArticlesPreview />
      <EventsPreview />
      <CTASection data={homeSettings.cta} />
    </>
  );
}
