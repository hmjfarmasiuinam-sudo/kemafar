/**
 * Settings Repository Interface
 * Handles site-wide settings data access
 */

export interface HomeSettings {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    primaryCTA: { text: string; link: string };
    secondaryCTA: { text: string; link: string };
    stats: Array<{ value: string; label: string }>;
  };
  features: {
    title: string;
    description: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
      color: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    primaryCTA: { text: string; link: string };
    secondaryCTA: { text: string; phone: string };
  };
}

export interface AboutSettings {
  mission: string;
  vision: string;
  story: string;
  values: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  timeline: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  statistics: {
    activeMembers: string;
    eventsPerYear: string;
    divisions: string;
    yearsActive: string;
  };
  affiliations: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  certifications: Array<{
    name: string;
    year: string;
  }>;
}

export interface ISettingsRepository {
  /**
   * Get home page settings
   */
  getHomeSettings(): Promise<HomeSettings>;

  /**
   * Get about page settings
   */
  getAboutSettings(): Promise<AboutSettings>;
}
