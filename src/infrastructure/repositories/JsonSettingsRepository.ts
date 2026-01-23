/**
 * JSON Settings Repository Implementation
 */

import {
  ISettingsRepository,
  HomeSettings,
  AboutSettings,
} from '@/core/repositories/ISettingsRepository';
import homeData from '../../../public/data/home.json';
import aboutData from '../../../public/data/about.json';

export class JsonSettingsRepository implements ISettingsRepository {
  async getHomeSettings(): Promise<HomeSettings> {
    return homeData as HomeSettings;
  }

  async getAboutSettings(): Promise<AboutSettings> {
    return aboutData as AboutSettings;
  }
}
