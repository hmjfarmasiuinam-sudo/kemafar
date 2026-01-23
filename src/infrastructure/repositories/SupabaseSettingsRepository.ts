/**
 * Supabase Settings Repository Implementation
 */

import { supabase } from '@/lib/supabase/client';
import {
  ISettingsRepository,
  HomeSettings,
  AboutSettings,
} from '@/core/repositories/ISettingsRepository';

interface SettingsRow {
  content: unknown;
}

export class SupabaseSettingsRepository implements ISettingsRepository {
  async getHomeSettings(): Promise<HomeSettings> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('content')
      .eq('key', 'home')
      .single();

    if (error || !data) {
      console.error('Error fetching home settings:', error);
      throw new Error('Failed to fetch home settings');
    }

    const row = data as SettingsRow;
    return row.content as HomeSettings;
  }

  async getAboutSettings(): Promise<AboutSettings> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('content')
      .eq('key', 'about')
      .single();

    if (error || !data) {
      console.error('Error fetching about settings:', error);
      throw new Error('Failed to fetch about settings');
    }

    const row = data as SettingsRow;
    return row.content as AboutSettings;
  }
}
