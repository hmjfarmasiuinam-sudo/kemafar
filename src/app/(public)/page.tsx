import { HeroSection } from '@/features/home/components/HeroSection';
import { FeaturesSection } from '@/features/home/components/FeaturesSection';
import { StatsSection } from '@/features/home/components/StatsSection';
import { ArticlesPreview } from '@/features/home/components/ArticlesPreview';
import { EventsPreview } from '@/features/home/components/EventsPreview';
import { CTASection } from '@/features/home/components/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <ArticlesPreview />
      <EventsPreview />
      <CTASection />
    </>
  );
}
