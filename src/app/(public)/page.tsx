import dynamicImport from 'next/dynamic';
import { HeroSection } from '@/features/home/components/HeroSection';
import { getHomeSettings, getAboutSettings } from '@/lib/api/settings';

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';

const FeaturesSection = dynamicImport(() => import('@/features/home/components/FeaturesSection').then(mod => ({ default: mod.FeaturesSection })), {
  loading: () => <div className="h-96" />,
});

const StatsSection = dynamicImport(() => import('@/features/home/components/StatsSection').then(mod => ({ default: mod.StatsSection })), {
  loading: () => <div className="h-64" />,
});

const ArticlesPreview = dynamicImport(() => import('@/features/home/components/ArticlesPreview').then(mod => ({ default: mod.ArticlesPreview })), {
  loading: () => <div className="h-96" />,
});

const EventsPreview = dynamicImport(() => import('@/features/home/components/EventsPreview').then(mod => ({ default: mod.EventsPreview })), {
  loading: () => <div className="h-96" />,
});

const CTASection = dynamicImport(() => import('@/features/home/components/CTASection').then(mod => ({ default: mod.CTASection })), {
  loading: () => <div className="h-64" />,
});

export default async function HomePage() {
  const homeContent = await getHomeSettings();
  const aboutContent = await getAboutSettings();

  // Transform programs from about settings to features format for home page
  // Fallback to home features if programs not available
  const featuresData = {
    title: homeContent.features.title,
    description: homeContent.features.description,
    items: aboutContent.programs && aboutContent.programs.length > 0
      ? aboutContent.programs.map(program => ({
          icon: program.icon || 'GraduationCap',
          title: program.title,
          description: program.description,
          color: '', // Not used in the component
        }))
      : homeContent.features.items,
  };

  return (
    <>
      <HeroSection data={homeContent.hero} />
      <FeaturesSection data={featuresData} />
      <StatsSection />
      <ArticlesPreview />
      <EventsPreview />
      <CTASection data={homeContent.cta} />
    </>
  );
}
