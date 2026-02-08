'use client';

import { useParams } from 'next/navigation';
import { useAdminForm } from '@/shared/hooks/useAdminForm';
import { FormInput } from '@/shared/components/FormInput';
import { FormTextarea } from '@/shared/components/FormTextarea';
import { FormActions } from '@/shared/components/FormActions';
import { TimelineFormData } from '@/types/forms';

export default function TimelineFormPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    formData,
    setFormData,
    loading,
    fetching,
    isCreateMode,
    handleSubmit,
  } = useAdminForm<TimelineFormData>({
    tableName: 'organization_timeline',
    id,
    initialData: {
      year: '',
      title: '',
      description: '',
      order_index: 0,
    },
    redirectPath: '/admin/timeline',
    onBeforeSave: (data) => {
      // Auto-calculate order_index from year if it's 0 or empty
      let orderIndex = data.order_index;
      if (!orderIndex || orderIndex === 0) {
        orderIndex = parseInt(data.year, 10);
      }

      return {
        ...data,
        order_index: orderIndex,
      };
    },
  });

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isCreateMode ? 'Add Timeline Item' : 'Edit Timeline Item'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isCreateMode
            ? 'Create a new timeline item for the organization history'
            : 'Update the timeline item details'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Year */}
          <FormInput
            label="Year"
            id="year"
            type="text"
            value={formData.year}
            onChange={(value) => setFormData({ ...formData, year: value })}
            placeholder="e.g., 2024"
            required
          />

          {/* Title */}
          <FormInput
            label="Title"
            id="title"
            type="text"
            value={formData.title}
            onChange={(value) => setFormData({ ...formData, title: value })}
            placeholder="e.g., Organization Founded"
            required
          />

          {/* Description */}
          <FormTextarea
            label="Description"
            id="description"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Detailed description of what happened in this year..."
            required
            rows={4}
          />

          {/* Order Index */}
          <FormInput
            label="Order Index (Optional)"
            id="order_index"
            type="number"
            value={formData.order_index.toString()}
            onChange={(value) => setFormData({ ...formData, order_index: parseInt(value, 10) || 0 })}
            placeholder="e.g., 1, 2, 3..."
          />
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <FormActions backUrl="/admin/timeline" loading={loading} isCreateMode={isCreateMode} />
        </div>
      </form>
    </div>
  );
}
