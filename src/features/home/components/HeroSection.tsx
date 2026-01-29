/**
 * HeroSection Component
 * Main hero section for homepage - Optimized
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { CountingNumber } from '@/shared/components/ui/CountingNumber';
import { HomeSettings } from '@/config';

// Optimized animation variants for better performance
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
};

interface HeroSectionProps {
  data: HomeSettings['hero'];
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <div className="relative min-h-[90vh] flex items-center bg-white overflow-hidden pt-20">
      {/* Abstract Background Shapes - Clean & Modern */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-50 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-50 rounded-full blur-[100px] opacity-60 translate-y-1/3 -translate-x-1/4" />

      <div className="container-custom relative z-10 w-full" style={{ minHeight: '600px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Text Content - Editorially aligned */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 flex flex-col justify-center"
            style={{ minHeight: '500px' }}
          >
            {/* Badge - Minimalist pill */}
            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-accent-300 w-fit mb-8">
              <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
              <span className="text-sm font-medium text-secondary-600 tracking-wide uppercase">{data.badge}</span>
            </motion.div>

            {/* Headline with Logo - Horizontal logo style on mobile */}
            <div className="flex items-center gap-4 lg:block mb-8">
              {/* Mobile Logo - Same height as text */}
              <motion.div
                variants={item}
                className="lg:hidden flex-shrink-0 w-28 h-32 sm:w-32 sm:h-36 bg-white rounded-2xl shadow-xl p-3 flex items-center justify-center"
              >
                <Image
                  src="/images/logo-hero.jpeg"
                  alt="Logo HMJF"
                  width={128}
                  height={128}
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* Headline - Same height container on mobile */}
              <motion.h1
                variants={item}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-primary-600 leading-tight tracking-tighter flex-1 h-32 sm:h-36 lg:h-auto flex lg:block items-center"
                style={{ contentVisibility: 'auto' }}
              >
                <span className="block lg:inline">
                  {data.title}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                    {data.titleHighlight}
                  </span>
                </span>
              </motion.h1>
            </div>

            {/* Description - Reader friendly */}
            <motion.p variants={item} className="text-lg md:text-xl text-secondary-600 leading-relaxed max-w-2xl border-l-4 border-primary-200 pl-6 mb-10">
              {data.description}
            </motion.p>

            {/* CTAs - Minimal buttons */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
              <Link
                href={data.primaryCTA.link}
                className="px-8 py-4 bg-primary-600 text-white rounded-full font-bold text-lg hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                {data.primaryCTA.text}
                <Activity className="w-5 h-5" />
              </Link>
              <Link
                href={data.secondaryCTA.link}
                className="px-8 py-4 bg-transparent text-primary-600 border border-primary-600 rounded-full font-bold text-lg hover:bg-primary-50 transition-all flex items-center justify-center"
              >
                {data.secondaryCTA.text}
              </Link>
            </motion.div>

            {/* Stats - Horizontal minimalist */}
            <motion.div variants={item} className="flex items-center gap-12 mt-16 pt-8 border-t border-accent-300">
              {data.stats.map((stat, index) => (
                <div key={index}>
                  <p className="text-3xl font-black text-primary-600">
                    <CountingNumber
                      value={parseInt(stat.value.replace(/\D/g, ''))}
                      suffix={stat.value.replace(/[0-9]/g, '')}
                      duration={2.5}
                    />
                  </p>
                  <p className="text-sm text-secondary-600 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual - Editorial Image Composition (Desktop Only) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="hidden lg:block lg:col-span-5 relative h-[600px]"
            style={{ minHeight: '600px' }}
          >
            {/* Main Hero Image - Organic Shape */}
            <div className="relative z-10 w-full h-full">
              <div className="absolute right-0 top-0 w-4/5 h-4/5 rounded-[4rem] rounded-tr-[10rem] overflow-hidden shadow-2xl shadow-primary-900/10 bg-white p-6 flex items-center justify-center" style={{ transform: 'rotate(3deg)' }}>
                <div className="relative w-full h-full" style={{ transform: 'rotate(-3deg)' }}>
                  <Image
                    src="/images/logo-hero.jpeg"
                    alt="HIMPUNAN MAHASISWA JURUSAN FARMASI UIN ALAUDDIN MAKASSAR"
                    fill
                    className="object-contain p-4"
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/5 to-transparent pointer-events-none" />
              </div>

              {/* Floating Accent Image */}
              <div className="absolute left-0 bottom-20 w-3/5 h-2/5 rounded-[3rem] rounded-bl-[6rem] overflow-hidden shadow-xl shadow-secondary-900/10 border-4 border-white bg-white p-4 flex items-center justify-center" style={{ transform: 'rotate(-6deg)' }}>
                <div className="relative w-full h-full" style={{ transform: 'rotate(6deg)' }}>
                  <Image
                    src="/images/logo-hero.jpeg"
                    alt="Logo HMJF"
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, 30vw"
                  />
                </div>
              </div>

              {/* Minimal floating elements */}
              <div className="absolute top-20 -left-10 bg-white/80 backdrop-blur-md p-4 rounded-full shadow-lg animate-float">
                <Sparkles className="w-6 h-6 text-primary-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
