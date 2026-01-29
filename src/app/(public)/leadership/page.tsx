'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { getActiveLeadership, type LeadershipMember } from '@/lib/api/leadership';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

/**
 * Format position string for display
 * Examples: 'ketua' → 'Ketua', 'wakil-ketua' → 'Wakil Ketua'
 */
function formatPosition(position: string): string {
  return position
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format division string for display
 * Examples: 'internal-affairs' → 'Internal Affairs'
 */
function formatDivision(division: string): string {
  return division
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Core positions
const corePositions = ['ketua', 'wakil-ketua', 'sekretaris', 'bendahara'];

// Skeleton Loader Components
function CoreMemberSkeleton() {
  return (
    <div className="group relative animate-pulse">
      {/* Poster Skeleton */}
      <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-800 rounded" />

      {/* Text Skeleton */}
      <div className="border-t border-gray-800 pt-4">
        <div className="h-6 bg-gray-800 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
}

function DivisionMemberSkeleton() {
  return (
    <div className="flex items-center gap-6 animate-pulse">
      {/* Avatar Skeleton */}
      <div className="w-20 h-20 rounded-full bg-gray-800 flex-shrink-0" />

      {/* Info Skeleton */}
      <div className="flex-1">
        <div className="h-6 bg-gray-800 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
}

function DivisionSection({
  division,
  members
}: {
  division: string,
  members: LeadershipMember[]
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Optimized: Combine transforms into single translateX + opacity only
  // Remove blur and scale for better mobile performance
  const x = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [200, 0, 0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{
        x,
        opacity,
        willChange: 'transform, opacity',
      }}
      className="mb-48 py-12 last:mb-0 relative"
    >
      {/* Division Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-700/50 pb-6 mb-12">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white shadow-black drop-shadow-2xl break-words">
          {formatDivision(division)}
        </h2>
        <span className="text-2xl font-mono text-primary-400 mt-4 md:mt-0 font-bold">
          {String(members.length).padStart(2, '0')}
        </span>
      </div>

      {/* Division Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-6 group"
          >
            {/* Avatar */}
            <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-full bg-gray-800 border-2 border-gray-700 group-hover:border-primary-400 transition-colors duration-300">
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  sizes="80px"
                  loading="lazy"
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500 group-hover:text-primary-400 transition-colors" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-100 group-hover:text-white transition-colors tracking-tight break-words">
                {member.name}
              </h4>
              <p className="text-xs sm:text-sm text-primary-300 font-mono mt-1 uppercase tracking-wider group-hover:text-primary-200 transition-colors font-semibold">
                {formatPosition(member.position)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function LeadershipPage() {
  const [coreLeadership, setCoreLeadership] = useState<LeadershipMember[]>([]);
  const [groupedByDivision, setGroupedByDivision] = useState<Record<string, LeadershipMember[]>>({});
  const [loading, setLoading] = useState(true);

  // Parallax Setup
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll(); // Use global scroll for sticky effect

  // Optimized parallax: Reduced blur for smoother performance
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const blur = useTransform(scrollY, [0, 400], ["blur(0px)", "blur(8px)"]); // Reduced blur for performance

  useEffect(() => {
    const fetchData = async () => {
      try {
        const all = await getActiveLeadership();

        // Split into core and division leadership
        const core = all.filter((member) => !member.division && corePositions.includes(member.position));
        const divisionLeadership = all.filter((member) => member.division);

        // Group by division
        const grouped = divisionLeadership.reduce((acc, member) => {
          const div = member.division ?? '';
          if (!acc[div]) {
            acc[div] = [];
          }
          acc[div].push(member);
          return acc;
        }, {} as Record<string, LeadershipMember[]>);

        setCoreLeadership(core);
        setGroupedByDivision(grouped);
      } catch (error) {
        console.error('Failed to fetch leadership:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black" ref={containerRef}>
      {/* Fixed Background Hero */}
      <div className="fixed inset-0 z-0 flex items-start pt-32 justify-center pointer-events-none px-4">
        <motion.div
          style={{
            y,
            opacity,
            filter: blur,
            willChange: 'transform, opacity, filter',
            transform: 'translateZ(0)',
          }}
          className="text-center w-full max-w-4xl"
        >
          <h1 className="text-[2.5rem] leading-tight sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white mb-4 break-words hyphens-auto">
            Kepengurusan
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto px-4">
            Visi di balik gerakan.
          </p>
        </motion.div>

        {/* Ambient Background Glows - Desktop only for performance */}
        <div className="hidden md:block absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-primary-900/20 rounded-full blur-[100px] -z-10" />
        <div className="hidden md:block absolute bottom-1/4 right-1/4 w-[25rem] h-[25rem] bg-secondary-900/20 rounded-full blur-[100px] -z-10" />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Spacer */}
        <div className="h-[60vh] w-full" />

        {/* Core Team */}
        <section className="pb-20 md:pb-32 text-white min-h-screen">
          <div className="container-custom pt-20">
            {loading ? (
              // Skeleton Loader for Core Team
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
                {[...Array(4)].map((_, i) => (
                  <CoreMemberSkeleton key={i} />
                ))}
              </div>
            ) : (
              // Actual Core Team
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
                {coreLeadership.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-150px", amount: 0.1 }}
                    transition={{
                      delay: index * 0.02,
                      duration: 0.25,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    className="group relative"
                  >
                    {/* Poster Image */}
                    <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-900 flex items-center justify-center rounded">
                      {member.photo ? (
                        <>
                          <Image
                            src={member.photo}
                            alt={member.name}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            priority={index < 4}
                            loading={index < 4 ? "eager" : "lazy"}
                            className="object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-200"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-700 group-hover:text-primary-500 transition-colors">
                          <User className="w-20 h-20 mb-4" />
                          <span className="text-xs uppercase tracking-widest">Tanpa Foto</span>
                        </div>
                      )}
                    </div>

                    {/* Typography */}
                    <div className="border-t border-gray-800 pt-4 group-hover:border-white transition-colors duration-150">
                      <h3 className="text-xl font-bold mb-1 tracking-tight text-white group-hover:text-primary-400 transition-colors duration-150">{member.name}</h3>
                      <p className="text-gray-500 text-xs font-mono tracking-widest uppercase">
                        {formatPosition(member.position)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Division Leadership */}
          <div className="container-custom mt-32 overflow-hidden">
            {loading ? (
              // Skeleton Loader for Divisions
              <div className="space-y-32">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    {/* Division Header Skeleton */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-700/50 pb-6 mb-12">
                      <div className="h-12 bg-gray-800 rounded w-64" />
                      <div className="h-8 bg-gray-800 rounded w-12 mt-4 md:mt-0" />
                    </div>

                    {/* Members Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
                      {[...Array(6)].map((_, j) => (
                        <DivisionMemberSkeleton key={j} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Actual Divisions
              Object.entries(groupedByDivision).map(([division, members]) => (
                <DivisionSection key={division} division={division} members={members} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
