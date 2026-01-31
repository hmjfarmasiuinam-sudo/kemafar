'use client';

import { useEffect, useState } from 'react';
import { getMembers } from '@/lib/api/members';
import type { Member } from '@/types/member';
import { Eye, ChevronDown, ChevronRight, Info } from 'lucide-react';
import Image from 'next/image';

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNim, setExpandedNim] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers();
        setMembers(data);
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const toggleExpand = (nim: string) => {
    setExpandedNim(expandedNim === nim ? null : nim);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alumni</h1>
        <p className="text-gray-600 mt-1">Mantan pengurus yang pernah mengabdi untuk HMJF</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">Data Alumni Otomatis</h3>
          <p className="text-sm text-blue-700">
            Data alumni di halaman ini <strong>otomatis dipopulasi</strong> dari tabel Leadership yang sudah berakhir masa jabatannya (period_end &lt; hari ini).
            Untuk mengedit data alumni, silakan update record Leadership mereka di halaman{' '}
            <a href="/admin/leadership" className="underline font-medium hover:text-blue-900">Leadership</a>.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold text-emerald-600">{members.length}</span>
          <span className="text-gray-600">alumni tercatat</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-4 inline-block"></span> {/* For expand icon */}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIM
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Angkatan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jabatan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Terakhir Aktif
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data alumni
                  </td>
                </tr>
              ) : (
                members.map((member) => {
                  const isExpanded = expandedNim === member.nim;
                  return (
                    <>
                      <tr key={member.nim} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleExpand(member.nim)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{member.nim}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            {member.photo ? (
                              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                  src={member.photo}
                                  alt={member.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <Eye className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              {member.email && (
                                <div className="text-xs text-gray-500">{member.email}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.batch || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {member.positions.length} {member.positions.length === 1 ? 'jabatan' : 'jabatan'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(member.lastPeriodEnd).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                            })}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Row - Position History */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-gray-50">
                            <div className="space-y-4">
                              <h4 className="text-sm font-semibold text-gray-900">Riwayat Jabatan</h4>
                              <div className="space-y-3">
                                {member.positions.map((pos, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start space-x-4 p-3 bg-white rounded-lg border border-gray-200"
                                  >
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                      <span className="text-emerald-700 text-sm font-semibold">{idx + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-semibold text-gray-900">{pos.position}</div>
                                      {pos.division && (
                                        <div className="text-xs text-gray-600 mt-0.5">{pos.division}</div>
                                      )}
                                      <div className="text-xs text-gray-500 mt-1">
                                        {new Date(pos.periodStart).toLocaleDateString('id-ID', {
                                          year: 'numeric',
                                          month: 'short',
                                        })}{' '}
                                        -{' '}
                                        {new Date(pos.periodEnd).toLocaleDateString('id-ID', {
                                          year: 'numeric',
                                          month: 'short',
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
