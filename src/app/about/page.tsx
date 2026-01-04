/**
 * About Page
 * Company information and history
 */

import { Metadata } from 'next';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Timeline } from '@/features/about/components/Timeline';
import { Leaf, Target, Heart, Award, Users, TrendingUp } from 'lucide-react';
import aboutData from '../../../public/data/about.json';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Tentang Griya Flora Babulu - Agrowisata Organik',
};

export default function AboutPage() {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tentang Kami
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mengenal lebih dekat Griya Flora Babulu dan perjalanan kami dalam mengembangkan agrowisata organik.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <Card variant="bordered">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Leaf className="w-8 h-8 text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-900">Cerita Kami</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {aboutData.story}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card variant="bordered">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">Misi Kami</h3>
              </div>
              <p className="text-gray-700">{aboutData.mission}</p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">Visi Kami</h3>
              </div>
              <p className="text-gray-700">{aboutData.vision}</p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Nilai-Nilai Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutData.values.map((value, index) => (
              <Card key={index} variant="bordered">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(aboutData.statistics).map(([key, value]) => (
              <Card key={key} variant="bordered" className="bg-primary-50">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {value}
                  </div>
                  <div className="text-sm text-gray-700">
                    {key === 'landArea' && 'Luas Lahan'}
                    {key === 'productTypes' && 'Jenis Produk'}
                    {key === 'visitorsPerYear' && 'Pengunjung/Tahun'}
                    {key === 'farmerPartners' && 'Mitra Petani'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Perjalanan Kami
          </h2>
          <Timeline items={aboutData.timeline} />
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Tim Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutData.team.map((member) => (
              <Card key={member.name} variant="bordered">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-primary-600 mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Affiliations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Kemitraan & Afiliasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutData.affiliations.map((affiliation) => (
              <Card key={affiliation.name} variant="bordered">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <Award className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{affiliation.name}</h3>
                  <p className="text-xs text-primary-600 mb-2">{affiliation.type}</p>
                  <p className="text-sm text-gray-600">{affiliation.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Sertifikasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {aboutData.certifications.map((cert) => (
              <Card key={cert.name} variant="bordered">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{cert.name}</h3>
                    <p className="text-sm text-gray-600">Tahun {cert.year}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
