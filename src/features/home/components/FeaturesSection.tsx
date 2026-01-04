/**
 * FeaturesSection Component
 * Highlight key features
 */

import { Leaf, Users, GraduationCap, Heart, LucideIcon } from 'lucide-react';
import homeData from '../../../../public/data/home.json';

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Users,
  GraduationCap,
  Heart,
};

export function FeaturesSection() {
  const { features } = homeData;

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {features.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {features.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.items.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Leaf;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className={`inline-flex p-4 rounded-full ${feature.color} mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
