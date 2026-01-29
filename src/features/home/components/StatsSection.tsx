/**
 * StatsSection Component
 * Animated statistics with parallax blur effect on mobile
 */

'use client';

import { motion, useMotionValue, useTransform, animate, useScroll } from 'framer-motion';
import { Users, Leaf, Award, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Stat {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  {
    id: '1',
    icon: Users,
    value: 200,
    suffix: '+',
    label: 'Anggota Aktif',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: '2',
    icon: Award,
    value: 50,
    suffix: '+',
    label: 'Event per Tahun',
    color: 'from-green-500 to-green-600',
  },
  {
    id: '3',
    icon: TrendingUp,
    value: 8,
    suffix: '',
    label: 'Divisi Aktif',
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: '4',
    icon: Leaf,
    value: 10,
    suffix: ' Tahun',
    label: 'Pengalaman Berorganisasi',
    color: 'from-primary-500 to-primary-600',
  },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      setDisplayValue(latest);
    });

    return unsubscribe;
  }, [rounded]);

  useEffect(() => {
    if (!nodeRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(count, value, { duration: 2, ease: 'easeOut' });
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(nodeRef.current);

    return () => observer.disconnect();
  }, [count, value, hasAnimated]);

  return (
    <div ref={nodeRef} className="text-5xl md:text-6xl font-bold">
      {displayValue}
      <span className="text-4xl md:text-5xl">{suffix}</span>
    </div>
  );
}

export function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll(); // Use global scroll like leadership page
  const [sectionTop, setSectionTop] = useState(0);

  // Get section position on mount
  useEffect(() => {
    if (sectionRef.current) {
      setSectionTop(sectionRef.current.offsetTop);
    }
  }, []);

  // Parallax transforms based on global scroll (like leadership page)
  const y = useTransform(scrollY, [sectionTop - 500, sectionTop + 500], [0, 200]);
  const opacity = useTransform(scrollY, [sectionTop - 300, sectionTop, sectionTop + 300], [0.2, 1, 0.2]);
  const blur = useTransform(scrollY, [sectionTop - 200, sectionTop, sectionTop + 200], ["blur(10px)", "blur(0px)", "blur(10px)"]);

  return (
    <section ref={sectionRef} className="relative py-40 overflow-hidden bg-primary-600">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-primary-700 to-primary-800" />
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-accent-100/5 to-transparent" />

      {/* Background title with parallax blur (mobile only) - FIXED position like leadership */}
      <div className="md:hidden fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        <motion.div
          style={{
            y,
            opacity,
            filter: blur,
            willChange: 'transform, opacity, filter',
            transform: 'translateZ(0)',
          }}
          className="text-center px-4"
        >
          <h2 className="text-8xl font-black text-white/30 leading-tight uppercase tracking-tighter">
            Our<br />Community
          </h2>
        </motion.div>
      </div>

      <div className="container-custom relative z-10">
        {/* Desktop: Normal header, Mobile: Scrollable content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Our Community in <span className="text-accent-200">Numbers</span>
          </h2>
        </motion.div>

        {/* Minimal stats - no cards, just numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                {/* Icon - minimal */}
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-accent-100 mx-auto mb-6" />

                {/* Big number - focus on data */}
                <div className="text-white mb-4">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <p className="text-primary-100 font-medium text-sm md:text-base">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Optional divider */}
        <div className="mt-24 pt-16 border-t border-primary-500/30">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">
              Organisasi mahasiswa farmasi yang aktif mengembangkan akademik, soft skills, dan pengabdian masyarakat
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
