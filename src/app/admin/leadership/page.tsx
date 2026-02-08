'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAdminTable } from '@/shared/hooks/useAdminTable';
import { Edit, Trash2, Calendar, CheckCircle } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import Link from 'next/link';
import { Leadership } from '@/types/leadership';
import { ITEMS_PER_PAGE } from '@/lib/constants/admin';
import { AdminDataTable } from '@/shared/components/datatables/AdminDataTable';
import { POSITION_LABELS, DIVISION_LABELS } from '@/lib/constants/leadership';

export default function LeadershipPage() {
  // Confirmation Modal State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
    variant: 'danger' | 'primary';
    isLoading: boolean;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: async () => { },
    variant: 'primary',
    isLoading: false,
  });

  const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

  // Memoize searchColumns to prevent infinite re-renders
  const searchColumns = useMemo(() => ['name', 'position', 'email'], []);

  const {
    items: leaders,
    loading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalCount,
    totalPages,
    deleteItem,
  } = useAdminTable<Leadership>({
    tableName: 'leadership',
    selectColumns: '*',
    sortColumn: 'order',
    sortAscending: true,
    itemsPerPage: ITEMS_PER_PAGE,
    searchColumns,
  });

  const handleDelete = useCallback((id: string, name: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Leader',
      description: `Are you sure you want to delete ${name}? This action cannot be undone.`,
      variant: 'danger',
      isLoading: false,
      onConfirm: async () => await deleteItem(id),
    });
  }, [deleteItem]);

  // Handle actual confirmation click
  const onConfirmClick = async () => {
    setConfirmState(prev => ({ ...prev, isLoading: true }));
    await confirmState.onConfirm();
    setConfirmState(prev => ({ ...prev, isOpen: false, isLoading: false }));
  };

  // Table Configuration
  const tableConfig = useMemo(() => ({
    tableName: 'leadership',
    columns: [
      {
        data: 'order',
        title: 'Order',
        sortable: true,
        responsivePriority: 2,
        className: 'text-gray-700',
      },
      {
        data: 'name',
        title: 'Name',
        sortable: true,
        responsivePriority: 1,
        render: (_: unknown, __: string, row: Record<string, unknown>) => {
          const leader = row as unknown as Leadership;
          return (
            <div className="flex items-center gap-3">
              {leader.photo ? (
                <img
                  src={leader.photo}
                  alt={leader.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-semibold text-sm">
                  {leader.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900">{leader.name}</div>
                {leader.email && (
                  <div className="text-sm text-gray-500">{leader.email}</div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        data: 'position',
        title: 'Position',
        sortable: true,
        render: (val: unknown) => <span className="text-gray-700">{POSITION_LABELS[String(val)] || String(val)}</span>,
      },
      {
        data: 'division',
        title: 'Division',
        sortable: true,
        render: (val: unknown) => <span className="text-gray-700">{val ? DIVISION_LABELS[String(val)] || String(val) : '-'}</span>,
      },
      {
        data: 'period_start', // Using period_start as key
        title: 'Period',
        sortable: true,
        render: (_: unknown, __: string, row: Record<string, unknown>) => {
          const leader = row as unknown as Leadership;
          return (
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <Calendar className="w-4 h-4" />
              {new Date(leader.period_start).getFullYear()} - {new Date(leader.period_end).getFullYear()}
            </div>
          );
        },
      },
      {
        data: 'id',
        title: 'Actions',
        sortable: false,
        className: 'text-right',
        render: (id: unknown, _: string, row: Record<string, unknown>) => {
          const leader = row as unknown as Leadership;
          return (
            <div className="flex items-center justify-end gap-2">
              <Link
                href={`/admin/leadership/${id}`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleDelete(id as string, leader.name)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        },
      },
    ],
    pageLength: ITEMS_PER_PAGE,
    search: {
      placeholder: 'Search by name, position, or email...',
    },
  }), [handleDelete]);

  return (
    <div className="space-y-6">
      {/* Info Banner - Alumni System */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Sistem Alumni & Multiple Jabatan
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Satu orang bisa punya beberapa record Leadership</strong> dengan NIM yang sama.
                Setiap record merepresentasikan 1 periode jabatan.
              </p>
              <div className="bg-white rounded border border-blue-100 p-3">
                <p className="font-medium text-gray-700 mb-1.5">Contoh: Budi Santoso</p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• Record 1: NIM 60200121001 → Sekretaris (2020-2021)</li>
                  <li>• Record 2: NIM 60200121001 → Ketua (2021-2022)</li>
                </ul>
                <p className="mt-2 text-xs text-blue-700">
                  → Di halaman Alumni: Budi muncul 1x dengan 2 riwayat jabatan
                </p>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Otomatis jadi Alumni jika:</strong> period_end sudah lewat + NIM terisi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminDataTable
        config={tableConfig}
        data={leaders}
        createButton={{
          label: 'Add Leader',
          href: '/admin/leadership/new',
        }}
        header={{
          title: 'Leadership',
          description: 'Manage organization leadership',
        }}
        isLoading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        manualPagination={{
          currentPage,
          pageCount: totalPages,
          totalRecords: totalCount,
          onPageChange: setCurrentPage,
        }}
      />

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        title={confirmState.title}
      >
        <div className="space-y-4">
          <p className="text-gray-600">{confirmState.description}</p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={closeConfirm}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={confirmState.isLoading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirmClick}
              disabled={confirmState.isLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                ${confirmState.variant === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                }`}
            >
              {confirmState.isLoading ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
