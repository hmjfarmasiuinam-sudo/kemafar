'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { RichTextEditor } from '@/shared/components/RichTextEditor';
import { MemberFormData } from '@/types/forms';
import { Member, MemberUpdateData } from '@/types';

export default function MemberFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isCreateMode = id === 'new';

  const { hasPermission } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isCreateMode);
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    nim: '',
    email: '',
    phone: '',
    photo: '',
    batch: '',
    status: 'active',
    division: '',
    position: '',
    joined_at: '',
    graduated_at: '',
    bio: '',
    interests: '',
    achievements: '',
    social_media_instagram: '',
    social_media_linkedin: '',
    social_media_twitter: '',
  });

  useEffect(() => {
    if (!hasPermission(['super_admin', 'admin'])) {
      router.push('/admin/dashboard');
      return;
    }

    if (!isCreateMode) {
      fetchMember();
    }
  }, [id]);

  async function fetchMember(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        toast.error('Member not found');
        router.push('/admin/members');
        return;
      }

      const member = data as Member;

      setFormData({
        name: member.name || '',
        nim: member.nim || '',
        email: member.email || '',
        phone: member.phone || '',
        photo: member.photo || '',
        batch: member.batch || '',
        status: member.status || 'active',
        division: member.division || '',
        position: member.position || '',
        joined_at: member.joined_at ? member.joined_at.split('T')[0] : '',
        graduated_at: member.graduated_at ? member.graduated_at.split('T')[0] : '',
        bio: member.bio || '',
        interests: Array.isArray(member.interests) ? member.interests.join(', ') : '',
        achievements: Array.isArray(member.achievements) ? member.achievements.join(', ') : '',
        social_media_instagram: member.social_media?.instagram || '',
        social_media_linkedin: member.social_media?.linkedin || '',
        social_media_twitter: member.social_media?.twitter || '',
      });
    } catch (error) {
      console.error('Error fetching member:', error);
      toast.error('Failed to load member data');
    } finally {
      setFetching(false);
    }
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setLoading(true);

    try {
      // Build social_media object from flattened fields
      const socialMedia: Record<string, string> = {};
      if (formData.social_media_instagram) {
        socialMedia.instagram = formData.social_media_instagram;
      }
      if (formData.social_media_linkedin) {
        socialMedia.linkedin = formData.social_media_linkedin;
      }
      if (formData.social_media_twitter) {
        socialMedia.twitter = formData.social_media_twitter;
      }

      const memberData: MemberUpdateData = {
        name: formData.name,
        nim: formData.nim,
        email: formData.email,
        phone: formData.phone || null,
        photo: formData.photo || null,
        batch: formData.batch,
        status: formData.status,
        division: formData.division || null,
        position: formData.position || null,
        joined_at: formData.joined_at || null,
        graduated_at: formData.graduated_at || null,
        bio: formData.bio || null,
        interests: formData.interests
          ? formData.interests.split(',').map((i) => i.trim())
          : null,
        achievements: formData.achievements
          ? formData.achievements.split(',').map((a) => a.trim())
          : null,
        social_media: Object.keys(socialMedia).length > 0 ? socialMedia : null,
      };

      if (isCreateMode) {
        // Create new member
        const { error } = await supabase
          .from('members')
          // Supabase generated types don't match our MemberUpdateData structure
          // Double assertion needed to bypass Supabase's strict typing
          .insert(memberData as unknown as never);

        if (error) throw error;
        toast.success('Member added successfully');
      } else {
        // Update existing member
        const { error } = await supabase
          .from('members')
          // Supabase generated types don't match our MemberUpdateData structure
          // Double assertion needed to bypass Supabase's strict typing
          .update(memberData as unknown as never)
          .eq('id', id);

        if (error) throw error;
        toast.success('Member updated successfully');
      }

      router.push('/admin/members');
    } catch (error) {
      console.error(`Error ${isCreateMode ? 'creating' : 'updating'} member:`, error);
      const message = error instanceof Error ? error.message : `Failed to ${isCreateMode ? 'add' : 'update'} member`;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isCreateMode ? 'Add New Member' : 'Edit Member'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isCreateMode ? 'Fill in the details to create a new member' : 'Update member information'}
          </p>
        </div>
        <Link
          href="/admin/members"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="nim" className="block text-sm font-medium text-gray-700 mb-2">
              NIM <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nim"
              name="nim"
              required
              value={formData.nim}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="08123456789"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-2">
              Batch <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="batch"
              name="batch"
              required
              value={formData.batch}
              onChange={handleChange}
              placeholder="2020"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>

          <div>
            <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-2">
              Division
            </label>
            <input
              type="text"
              id="division"
              name="division"
              value={formData.division}
              onChange={handleChange}
              placeholder="e.g., Internal Affairs"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g., Coordinator"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
              Photo URL
            </label>
            <input
              type="url"
              id="photo"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Temporary: Enter image URL. File upload will be added later.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <RichTextEditor
              value={formData.bio}
              onChange={(markdown) => setFormData((prev) => ({ ...prev, bio: markdown }))}
              placeholder="Short biography..."
              height="300px"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
              Interests
            </label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="Programming, Design, Writing (comma-separated)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="achievements" className="block text-sm font-medium text-gray-700 mb-2">
              Achievements
            </label>
            <input
              type="text"
              id="achievements"
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              placeholder="Award 1, Award 2, Award 3 (comma-separated)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="social_media_instagram" className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Username
            </label>
            <input
              type="text"
              id="social_media_instagram"
              name="social_media_instagram"
              value={formData.social_media_instagram}
              onChange={handleChange}
              placeholder="username (without @)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="social_media_linkedin" className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              id="social_media_linkedin"
              name="social_media_linkedin"
              value={formData.social_media_linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="social_media_twitter" className="block text-sm font-medium text-gray-700 mb-2">
              Twitter URL
            </label>
            <input
              type="url"
              id="social_media_twitter"
              name="social_media_twitter"
              value={formData.social_media_twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <Link
            href="/admin/members"
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isCreateMode ? 'Creating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isCreateMode ? 'Create Member' : 'Save Changes'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
