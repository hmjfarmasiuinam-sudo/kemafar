'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { RichTextEditor } from '@/shared/components/RichTextEditorDynamic';
import { FormInput } from '@/shared/components/FormInput';
import { FormSelect } from '@/shared/components/FormSelect';
import { FormActions } from '@/shared/components/FormActions';
import { LeadershipFormData } from '@/types/forms';

const POSITIONS = [
  { value: 'ketua', label: 'Ketua' },
  { value: 'wakil-ketua', label: 'Wakil Ketua' },
  { value: 'sekretaris', label: 'Sekretaris' },
  { value: 'bendahara', label: 'Bendahara' },
  { value: 'coordinator', label: 'Koordinator' },
  { value: 'member', label: 'Anggota' },
];

const DIVISIONS = [
  { value: 'internal-affairs', label: 'Internal Affairs' },
  { value: 'external-affairs', label: 'External Affairs' },
  { value: 'academic', label: 'Academic' },
  { value: 'student-development', label: 'Student Development' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' },
  { value: 'media-information', label: 'Media & Information' },
  { value: 'sports-arts', label: 'Sports & Arts' },
  { value: 'islamic-spirituality', label: 'Islamic Spirituality' },
];

export default function LeadershipFormPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isCreateMode = id === 'new';

  const [formData, setFormData] = useState<LeadershipFormData>({
    name: '',
    position: '',
    division: '',
    photo: '',
    email: '',
    phone: '',
    nim: '',
    batch: '',
    bio: '',
    social_media_instagram: '',
    social_media_linkedin: '',
    social_media_twitter: '',
    period_start: '',
    period_end: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!isCreateMode) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchData(): Promise<void> {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('leadership')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        toast.error('Data not found');
        router.push('/admin/leadership');
        return;
      }

      // Transform social_media from JSONB to form fields
      const record = data as Record<string, unknown>;
      const socialMedia = record.social_media as Record<string, string> | null | undefined;

      setFormData({
        name: record.name as string,
        position: record.position as string,
        division: (record.division as string) || '',
        photo: (record.photo as string) || '',
        email: (record.email as string) || '',
        phone: (record.phone as string) || '',
        nim: (record.nim as string) || '',
        batch: (record.batch as string) || '',
        bio: (record.bio as string) || '',
        period_start: (record.period_start as string) || '',
        period_end: (record.period_end as string) || '',
        social_media_instagram: socialMedia?.instagram ?? '',
        social_media_linkedin: socialMedia?.linkedin ?? '',
        social_media_twitter: socialMedia?.twitter ?? '',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load data';
      toast.error(message);
      router.push('/admin/leadership');
    } finally {
      setFetching(false);
    }
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setLoading(true);

    try {
      const data = formData;
      const socialMedia: Record<string, string> = {};
      if (data.social_media_instagram) {
        socialMedia.instagram = data.social_media_instagram;
      }
      if (data.social_media_linkedin) {
        socialMedia.linkedin = data.social_media_linkedin;
      }
      if (data.social_media_twitter) {
        socialMedia.twitter = data.social_media_twitter;
      }

      // Placeholder SVG data URL untuk foto kosong (karena photo field adalah NOT NULL di database)
      const photoPlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3C/svg%3E';

      // Default period untuk field NOT NULL
      const currentYear = new Date().getFullYear();
      const defaultDate = `${currentYear}-01-01`;

      const dataToSave = {
        name: data.name,
        position: data.position,
        division: data.division || null,
        photo: data.photo && data.photo.trim() !== '' ? data.photo : photoPlaceholder,
        email: data.email || null,
        phone: data.phone || null,
        nim: data.nim || null,
        batch: data.batch || null,
        bio: data.bio || null,
        social_media: Object.keys(socialMedia).length > 0 ? socialMedia : null,
        period_start: data.period_start || defaultDate,
        period_end: data.period_end || defaultDate,
        order: 1, // Default order value (field required by database but not used in UI)
      };

      if (isCreateMode) {
        const { error } = await supabase
          .from('leadership')
          .insert(dataToSave as never);

        if (error) {
          throw error;
        }
        toast.success('Created successfully');
      } else {
        const { error } = await supabase
          .from('leadership')
          .update(dataToSave as never)
          .eq('id', id);

        if (error) {
          throw error;
        }
        toast.success('Updated successfully');
      }

      router.push('/admin/leadership');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const handleNameChange = (value: string): void => {
    setFormData({
      ...formData,
      name: value,
    });
  };

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
          {isCreateMode ? 'Add New Leader' : 'Edit Leader'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isCreateMode ? 'Fill in the leadership details' : 'Update leadership information'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              required
            />

            <FormInput
              label="Email"
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(value) => setFormData({ ...formData, email: value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Position"
              id="position"
              value={formData.position}
              onChange={(value) => {
                // Reset division jika posisi bukan coordinator atau member
                const newDivision = (value === 'coordinator' || value === 'member') ? formData.division : '';
                setFormData({ ...formData, position: value, division: newDivision });
              }}
              options={POSITIONS}
              required
            />

            {(formData.position === 'coordinator' || formData.position === 'member') && (
              <FormSelect
                label="Division"
                id="division"
                value={formData.division}
                onChange={(value) => setFormData({ ...formData, division: value })}
                options={DIVISIONS}
                required
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="NIM"
              id="nim"
              value={formData.nim || ''}
              onChange={(value) => setFormData({ ...formData, nim: value })}
              required
            />

            <FormInput
              label="Batch"
              id="batch"
              value={formData.batch || ''}
              onChange={(value) => setFormData({ ...formData, batch: value })}
              required
              placeholder="2020"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Phone"
              id="phone"
              value={formData.phone || ''}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              placeholder="08123456789"
            />

            <FormInput
              label="Photo URL"
              id="photo"
              type="url"
              value={formData.photo || ''}
              onChange={(value) => setFormData({ ...formData, photo: value })}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Period Start"
              id="period_start"
              type="date"
              value={formData.period_start || ''}
              onChange={(value) => setFormData({ ...formData, period_start: value })}
              required
            />

            <FormInput
              label="Period End"
              id="period_end"
              type="date"
              value={formData.period_end || ''}
              onChange={(value) => setFormData({ ...formData, period_end: value })}
              required
            />
          </div>

          

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <RichTextEditor
              value={formData.bio || ''}
              onChange={(value) => setFormData({ ...formData, bio: value })}
              placeholder="Short biography..."
              height="300px"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Instagram Username"
              id="social_media_instagram"
              value={formData.social_media_instagram || ''}
              onChange={(value) => setFormData({ ...formData, social_media_instagram: value })}
              placeholder="username (without @)"
            />

            <FormInput
              label="LinkedIn URL"
              id="social_media_linkedin"
              type="url"
              value={formData.social_media_linkedin || ''}
              onChange={(value) => setFormData({ ...formData, social_media_linkedin: value })}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <FormInput
            label="Twitter URL"
            id="social_media_twitter"
            type="url"
            value={formData.social_media_twitter || ''}
            onChange={(value) => setFormData({ ...formData, social_media_twitter: value })}
            placeholder="https://twitter.com/username"
          />
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <FormActions backUrl="/admin/leadership" loading={loading} isCreateMode={isCreateMode} />
        </div>
      </form>
    </div>
  );
}
