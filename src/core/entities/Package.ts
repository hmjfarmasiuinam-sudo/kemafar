/**
 * Package Entity
 * Domain model untuk paket wisata
 */

export type PackageType = 'educational' | 'family' | 'custom';

export interface Package {
  id: string;
  name: string;
  type: PackageType;
  description: string;
  duration: string;
  minVisitors: number;
  maxVisitors: number;
  includes: string[];
  price: string;
  highlights?: string[];
}

// Factory function
export function createPackage(data: Partial<Package>): Package {
  if (!data.id || !data.name || !data.type || !data.description) {
    throw new Error('Missing required package fields');
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    description: data.description,
    duration: data.duration || 'Fleksibel',
    minVisitors: data.minVisitors || 1,
    maxVisitors: data.maxVisitors || 100,
    includes: data.includes || [],
    price: data.price || 'Hubungi kami',
    highlights: data.highlights,
  };
}
