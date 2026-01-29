'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { getActiveLeadership, type LeadershipMember } from '@/lib/api/leadership';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

/**
 * Format position string for display
 * Examples: 'ketua' → 'Ketua', 'wakil-ketua' → 'Wakil Ketua', 'coordinator' → 'Koordinator'
 */
function formatPosition(position: string): string {
  return position
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format division string for display
 * Examples: 'internal-affairs' → 'Internal Affairs', 'media-information' → 'Media Information'
 */
function formatDivision(division: string): string {
  return division
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Core positions determined by absence of division (already dynamic)
const corePositions = ['ketua', 'wakil-ketua', 'sekretaris', 'bendahara'];

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

  // Scroll Down: 
  // 0.0 - 0.35: Enter from Right (250px -> 0)
  // 0.35 - 0.65: STABLE CENTER (0 -> 0) - This gives the "Auto Center" feel
  // 0.65 - 1.0: Exit to Left (0 -> -250px)
  const x = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [250, 0, 0, -250]);

  // Spotlight Effects:
  // Opacity: Fade in/out
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.8, 1], [0, 1, 1, 0]);
  // Scale: Popping effect in center
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.85, 1, 1, 0.85]);
  // Blur: Blur edges to focus center
  const blur = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], ["blur(4px)", "blur(0px)", "blur(0px)", "blur(4px)"]);
  // Background Highlight: Subtle glow when active
  const bgOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 0.1, 0.1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{
        x,
        opacity,
        scale,
        filter: blur,
        willChange: 'transform, opacity, filter',
        transform: 'translateZ(0)', // Force GPU acceleration
      }}
      className="mb-48 py-12 last:mb-0 relative"
    >
      {/* Active State Backdrop Glow */}
      <motion.div
        style={{
          opacity: bgOpacity,
          willChange: 'opacity',
        }}
        className="absolute -inset-8 bg-gradient-to-r from-transparent via-primary-900/30 to-transparent rounded-3xl -z-10 blur-xl transition-all duration-500"
      />

      {/* Division Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-700/50 pb-6 mb-12">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white shadow-black drop-shadow-2xl">
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
            <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-full bg-gray-800 border-2 border-gray-700 group-hover:border-primary-400 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-all duration-500">
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500 group-hover:text-primary-400 transition-colors" />
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h4 className="text-2xl font-bold text-gray-100 group-hover:text-white transition-colors tracking-tight">
                {member.name}
              </h4>
              <p className="text-sm text-primary-300 font-mono mt-1 uppercase tracking-wider group-hover:text-primary-200 transition-colors font-semibold">
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
  const [_loading, setLoading] = useState(true);

  // Parallax Setup
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll(); // Use global scroll for sticky effect

  // Parallax transforms for the Hero Title
  const y = useTransform(scrollY, [0, 1000], [0, 400]); // Moves down slower than scroll to create parallax
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]); // Fade partially but stay visible
  const blur = useTransform(scrollY, [0, 400], ["blur(0px)", "blur(20px)"]); // Stronger blur effect

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
      {/* 
        FIXED BACKGROUND LAYER 
        Contains the Title "LEADERSHIP" which stays and gets blurred/covered
      */}
      <div className="fixed inset-0 z-0 flex items-start pt-32 justify-center pointer-events-none">
        <motion.div
          style={{
            y,
            opacity,
            filter: blur,
            willChange: 'transform, opacity, filter',
            transform: 'translateZ(0)', // Force GPU acceleration
          }}
          className="text-center"
        >
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter text-white mb-4">
            Leadership
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto">
            The visionaries behind the movement.
          </p>
        </motion.div>

        {/* Ambient Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-primary-900/20 rounded-full blur-[100px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[25rem] h-[25rem] bg-secondary-900/20 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* 
        SCROLLABLE CONTENT LAYER 
        This div scrolls normally. We add a huge top margin (spacer) so we see the hero first.
        Then the content slides UP over the fixed background.
      */}
      <div className="relative z-10">

        {/* Spacer to show the Hero Title initially */}
        <div className="h-[60vh] w-full" />

        {/* Core Team - Slides over the title */}
        <section className="pb-20 md:pb-32 text-white min-h-screen">
          <div className="container-custom pt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
              {coreLeadership.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px", amount: 0.3 }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                  style={{
                    willChange: 'transform, opacity',
                  }}
                  className="group relative"
                >
                  {/* Poster Image */}
                  <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-900 flex items-center justify-center">
                    {member.photo ? (
                      <>
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-700 group-hover:text-primary-500 transition-colors">
                        <User className="w-20 h-20 mb-4" />
                        <span className="text-xs uppercase tracking-widest">No Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Minimal Typography */}
                  <div className="border-t border-gray-800 pt-4 group-hover:border-white transition-colors duration-300">
                    <h3 className="text-xl font-bold mb-1 tracking-tight text-white group-hover:text-primary-400 transition-colors">{member.name}</h3>
                    <p className="text-gray-500 text-xs font-mono tracking-widest uppercase">
                      {formatPosition(member.position)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Division Leadership Section */}
          <div className="container-custom mt-32 overflow-hidden">
            {Object.entries(groupedByDivision).map(([division, members]) => (
              <DivisionSection key={division} division={division} members={members} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
