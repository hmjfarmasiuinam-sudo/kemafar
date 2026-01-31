'use client';
import Image from 'next/image';
import { User } from 'lucide-react';
import { getMembers, getMemberBatches } from '@/lib/api/members';
import type { Member } from '@/types/member';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';

export default function MembersPage({
  searchParams,
}: {
  searchParams: { batch?: string };
}) {
  const [members, setMembers] = useState<Member[]>([]);
  const [batches, setBatches] = useState<string[]>([]);
  const [_loading, setLoading] = useState(true);
  const { batch } = searchParams;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedMembers, uniqueBatches] = await Promise.all([
          getMembers(),
          getMemberBatches(),
        ]);

        // Filter by batch if specified
        const filtered = batch
          ? fetchedMembers.filter((m) => m.batch === batch)
          : fetchedMembers;

        setMembers(filtered);
        setBatches(uniqueBatches);
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [batch]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-gray-900" />
        <div className="container-custom relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Alumni
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl leading-relaxed">
            Mantan pengurus yang pernah mengabdi untuk HMJF
          </p>
        </div>
      </section>

      {/* Filters */}
      <SegmentedControl
        basePath="/members"
        paramName="batch"
        currentValue={batch}
        allLabel="Semua Angkatan"
        options={batches.map((b) => ({
          value: b,
          label: `Angkatan ${b}`,
        }))}
      />

      {/* Members Grid */}
      <section className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xl text-gray-600">
            Menampilkan <span className="text-3xl font-bold text-gray-900">{members.length}</span> alumni
          </p>
        </motion.div>

        {members.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-gray-500 text-xl">Tidak ada alumni ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {members.map((member, index) => (
              <motion.div
                key={member.nim}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: (index % 15) * 0.05,
                  duration: 0.6,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 },
                }}
                className="group"
              >
                {/* Photo */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-4 bg-gradient-to-br from-primary-100/50 to-gray-100/50 flex items-center justify-center">
                  {member.photo ? (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full"
                    >
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                    >
                      <User className="w-16 h-16 text-primary-300" />
                    </motion.div>
                  )}
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                    {member.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-1">{member.nim}</p>
                  {member.batch && (
                    <p className="text-xs text-primary-600 font-bold">
                      Angkatan {member.batch}
                    </p>
                  )}

                  {/* Position History - Timeline */}
                  <div className="mt-3 space-y-1">
                    {member.positions.slice(0, 2).map((pos, idx) => (
                      <div key={idx} className="text-xs">
                        <p className="font-semibold text-gray-700 line-clamp-1">
                          {pos.position}
                        </p>
                        {pos.division && (
                          <p className="text-gray-500 line-clamp-1">
                            {pos.division}
                          </p>
                        )}
                        <p className="text-gray-400 text-[10px]">
                          {new Date(pos.periodStart).getFullYear()} - {new Date(pos.periodEnd).getFullYear()}
                        </p>
                      </div>
                    ))}
                    {member.positions.length > 2 && (
                      <p className="text-[10px] text-gray-400">
                        +{member.positions.length - 2} jabatan lainnya
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
