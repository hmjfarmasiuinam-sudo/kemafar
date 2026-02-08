import { unstable_noStore as noStore } from 'next/cache';
import { createServerSupabase } from '@/lib/supabase/server';
import { HOME_CONTENT, ABOUT_CONTENT, CONTACT_CONTENT, HomeSettings, AboutSettings, ContactSettings } from '@/config';
import { getTimeline } from './timeline';

/**
 * Site Settings from database (raw)
 */
interface SiteSettingsRaw {
  id: string;
  key: string;
  content: HomeSettings | AboutSettings | ContactSettings; // JSONB column
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

/**
 * Fetch home settings from database with fallback to config
 */
export async function getHomeSettings(): Promise<HomeSettings> {
  // Disable Next.js caching - always fetch fresh data
  noStore();

  // Check if we should use database for settings
  const useSupabaseSettings = process.env.NEXT_PUBLIC_USE_SUPABASE_SETTINGS === 'true';

  // If flag is disabled, return config immediately
  if (!useSupabaseSettings) {
    return HOME_CONTENT;
  }

  // Fetch from database
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'home')
    .single();

  // If error or no data, use fallback from config
  if (error || !data) {
    return HOME_CONTENT;
  }

  // Return content from database
  return (data as SiteSettingsRaw).content as HomeSettings;
}

/**
 * Fetch about settings from database with fallback to config
 */
export async function getAboutSettings(): Promise<AboutSettings> {
  // Disable Next.js caching - always fetch fresh data
  noStore();

  // Check if we should use database for settings
  const useSupabaseSettings = process.env.NEXT_PUBLIC_USE_SUPABASE_SETTINGS === 'true';
  const useSupabaseTimeline = process.env.NEXT_PUBLIC_USE_SUPABASE_TIMELINE === 'true';

  // Get base settings (from database or config based on flag)
  let baseSettings: AboutSettings = ABOUT_CONTENT;

  if (useSupabaseSettings) {
    // Fetch settings from site_settings table
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'about')
      .single();

    // Use database settings if available, otherwise fallback to config
    if (!error && data) {
      baseSettings = (data as SiteSettingsRaw).content as AboutSettings;
    }
  }

  // Fetch timeline from organization_timeline table if flag is enabled
  if (useSupabaseTimeline) {
    try {
      const timelineItems = await getTimeline();

      // If timeline exists in database, use it; otherwise use config fallback
      const timeline = timelineItems.length > 0
        ? timelineItems.map(item => ({
            year: item.year,
            title: item.title,
            description: item.description,
          }))
        : baseSettings.timeline;

      // Return merged settings with timeline from database
      return {
        ...baseSettings,
        timeline,
      };
    } catch (timelineError) {
      console.error('Error fetching timeline, using fallback:', timelineError);
      // If timeline fetch fails, return base settings with config timeline
      return baseSettings;
    }
  }

  // Return settings (either from config or database, without timeline override)
  return baseSettings;
}

/**
 * Fetch contact settings from database with fallback to config
 */
export async function getContactSettings(): Promise<ContactSettings> {
  // Disable Next.js caching - always fetch fresh data
  noStore();

  // Check if we should use database for settings
  const useSupabaseSettings = process.env.NEXT_PUBLIC_USE_SUPABASE_SETTINGS === 'true';

  // If flag is disabled, return config immediately
  if (!useSupabaseSettings) {
    return CONTACT_CONTENT;
  }

  // Fetch from database
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'contact')
    .single();

  // If error or no data, use fallback from config
  if (error || !data) {
    return CONTACT_CONTENT;
  }

  // Return content from database
  return (data as SiteSettingsRaw).content as ContactSettings;
}
