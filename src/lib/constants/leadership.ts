/**
 * Leadership Constants
 * Centralized position and division definitions
 */

// Position definitions
export const POSITIONS = [
  { value: 'ketua', label: 'Ketua' },
  { value: 'wakil-ketua', label: 'Wakil Ketua' },
  { value: 'sekretaris', label: 'Sekretaris' },
  { value: 'bendahara', label: 'Bendahara' },
  { value: 'coordinator', label: 'Koordinator' },
  { value: 'member', label: 'Anggota' },
];

// Division definitions
export const DIVISIONS = [
  { value: 'presidium', label: 'Presidium' },
  { value: 'kaderisasi', label: 'Kaderisasi' },
  { value: 'minat-bakat', label: 'Minat Bakat' },
  { value: 'media-publikasi', label: 'Media dan Publikasi' },
  { value: 'pendidikan-profesi', label: 'Pendidikan dan Profesi' },
  { value: 'logistik-keuangan', label: 'Logistik dan Keuangan' },
  { value: 'akhlak-moral', label: 'Akhlak dan Moral' },
  { value: 'eksternal', label: 'Eksternal' },
  { value: 'kajian-strategis-advokasi', label: 'Kajian Strategis dan Advokasi' },
];

// Position labels mapping
export const POSITION_LABELS: Record<string, string> = {
  'ketua': 'Ketua',
  'wakil-ketua': 'Wakil Ketua',
  'sekretaris': 'Sekretaris',
  'bendahara': 'Bendahara',
  'coordinator': 'Koordinator',
  'member': 'Anggota',
};

// Division labels mapping
export const DIVISION_LABELS: Record<string, string> = {
  'presidium': 'Presidium',
  'kaderisasi': 'Kaderisasi',
  'minat-bakat': 'Minat Bakat',
  'media-publikasi': 'Media dan Publikasi',
  'pendidikan-profesi': 'Pendidikan dan Profesi',
  'logistik-keuangan': 'Logistik dan Keuangan',
  'akhlak-moral': 'Akhlak dan Moral',
  'eksternal': 'Eksternal',
  'kajian-strategis-advokasi': 'Kajian Strategis dan Advokasi',
};

// Core positions (for grouping/filtering)
export const CORE_POSITIONS = ['ketua', 'wakil-ketua', 'sekretaris', 'bendahara'];

// Helper function to get position label
export function getPositionLabel(position: string): string {
  return POSITION_LABELS[position] || position;
}

// Helper function to get division label
export function getDivisionLabel(division: string | null | undefined): string {
  if (!division) {
    return '-';
  }
  return DIVISION_LABELS[division] || division;
}
