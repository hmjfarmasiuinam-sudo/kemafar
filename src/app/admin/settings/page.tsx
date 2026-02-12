'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import { Settings, Home, Info, Save, Phone, Plus, Trash2 } from 'lucide-react';
import { RichTextEditor } from '@/shared/components/RichTextEditorDynamic';

type TabType = 'home' | 'about' | 'contact';

interface HomeSettings {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    primaryCTA: { text: string; link: string };
    secondaryCTA: { text: string; link: string };
    stats: Array<{ value: string; label: string }>;
  };
  features: {
    title: string;
    description: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
      color: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    primaryCTA: { text: string; link: string };
    secondaryCTA: { text: string; phone: string };
  };
}

interface AboutSettings {
  mission: string;
  vision: string;
  story: string;
  values: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  programs: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  timeline: Array<{
    year: string;
    title: string;
    description: string;
  }>;
}

interface ContactSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter?: string;
    linkedin?: string;
  };
  footerDescription: string;
}

export default function SettingsPage() {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Home settings state
  const [homeSettings, setHomeSettings] = useState<HomeSettings | null>(null);

  // About settings state
  const [aboutSettings, setAboutSettings] = useState<AboutSettings | null>(null);

  // Contact settings state
  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      youtube: '',
      twitter: '',
      linkedin: '',
    },
    footerDescription: '',
  });

  useEffect(() => {
    if (!hasPermission(['super_admin', 'admin'])) {
      toast.error('You do not have permission to access this page');
      return;
    }
    fetchSettings();
  }, [hasPermission]);

  async function fetchSettings() {
    setFetching(true);
    try {
      // Direct query to Supabase - no API route needed
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key', { ascending: true });

      if (error) throw error;

      // Type the data
      const settings = data as Array<{
        key: string;
        content: HomeSettings | AboutSettings | ContactSettings;
      }>;

      // Find home, about, and contact settings from database
      const homeData = settings?.find(s => s.key === 'home');
      const aboutData = settings?.find(s => s.key === 'about');
      const contactData = settings?.find(s => s.key === 'contact');

      // Set state with new data
      if (homeData) setHomeSettings(homeData.content as HomeSettings);
      if (aboutData) {
        const aboutContent = aboutData.content as AboutSettings;
        // Ensure values and programs arrays exist
        setAboutSettings({
          ...aboutContent,
          values: aboutContent.values || [],
          programs: aboutContent.programs || [],
        });
      }
      if (contactData) setContactSettings(contactData.content as ContactSettings);

      // Force component re-mount by changing key
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setFetching(false);
    }
  }

  async function handleSaveHome() {
    if (!homeSettings) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Not authenticated');
        return;
      }

      // Direct upsert to Supabase
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'home',
          content: homeSettings as unknown as Record<string, unknown>,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        } as never, {
          onConflict: 'key'
        });

      if (error) throw error;

      toast.success('Home settings saved successfully');

      // Refetch to sync UI with database
      await fetchSettings();
    } catch (error) {
      console.error('Error saving home settings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveAbout() {
    if (!aboutSettings) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Not authenticated');
        return;
      }

      // Direct upsert to Supabase
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'about',
          content: aboutSettings as unknown as Record<string, unknown>,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        } as never, {
          onConflict: 'key'
        });

      if (error) throw error;

      toast.success('About settings saved successfully');

      // Refetch to sync UI with database
      await fetchSettings();
    } catch (error) {
      console.error('Error saving about settings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveContact() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Not authenticated');
        return;
      }

      // Direct upsert to Supabase
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'contact',
          content: contactSettings as unknown as Record<string, unknown>,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        } as never, {
          onConflict: 'key'
        });

      if (error) throw error;

      toast.success('Contact settings saved successfully');

      // Refetch to sync UI with database
      await fetchSettings();
    } catch (error) {
      console.error('Error saving contact settings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Site Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage homepage and about page content
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <nav className="flex gap-2 justify-center flex-wrap">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'home'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'about'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
          >
            <Info className="w-4 h-4" />
            About
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'contact'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
          >
            <Phone className="w-4 h-4" />
            Contact
          </button>
        </nav>
      </div>

      {/* Home Tab Content */}
      {activeTab === 'home' && homeSettings && (
        <div key={`home-${refreshKey}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Home Page Content</h2>

            {/* Hero Section */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800">Hero Section</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge
                </label>
                <input
                  type="text"
                  value={homeSettings.hero.badge}
                  onChange={(e) =>
                    setHomeSettings({
                      ...homeSettings,
                      hero: { ...homeSettings.hero, badge: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={homeSettings.hero.title}
                  onChange={(e) =>
                    setHomeSettings({
                      ...homeSettings,
                      hero: { ...homeSettings.hero, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title Highlight
                </label>
                <input
                  type="text"
                  value={homeSettings.hero.titleHighlight}
                  onChange={(e) =>
                    setHomeSettings({
                      ...homeSettings,
                      hero: { ...homeSettings.hero, titleHighlight: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={homeSettings.hero.description}
                  onChange={(e) =>
                    setHomeSettings({
                      ...homeSettings,
                      hero: { ...homeSettings.hero, description: e.target.value },
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Call-to-Action Section</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Title
                </label>
                <input
                  type="text"
                  value={homeSettings.cta.title}
                  onChange={(e) =>
                    setHomeSettings({
                      ...homeSettings,
                      cta: { ...homeSettings.cta, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Description
                </label>
                <textarea
                  value={homeSettings.cta.description}
                  onChange={(e) =>
                    setHomeSettings({
                      ...homeSettings,
                      cta: { ...homeSettings.cta, description: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Programs Section (displayed on home page) */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Programs</h3>
              </div>

              {/* Programs Group Container */}
              <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-6">
                {/* Section Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={homeSettings?.features.title || ''}
                      onChange={(e) => {
                        if (homeSettings) {
                          setHomeSettings({
                            ...homeSettings,
                            features: {
                              ...homeSettings.features,
                              title: e.target.value
                            }
                          });
                        }
                      }}
                      placeholder="e.g., Program Kami"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Description
                    </label>
                    <textarea
                      value={homeSettings?.features.description || ''}
                      onChange={(e) => {
                        if (homeSettings) {
                          setHomeSettings({
                            ...homeSettings,
                            features: {
                              ...homeSettings.features,
                              description: e.target.value
                            }
                          });
                        }
                      }}
                      rows={2}
                      placeholder="e.g., Berbagai program pengembangan untuk mahasiswa Farmasi yang profesional dan berintegritas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300"></div>

                {/* Program Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-700">Program Items</h4>
                    <button
                      type="button"
                      onClick={() => {
                        if (aboutSettings) {
                          setAboutSettings({
                            ...aboutSettings,
                            programs: [...(aboutSettings.programs || []), { title: '', description: '', icon: '' }]
                          });
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Program
                    </button>
                  </div>

                  <div className="space-y-4">
                {aboutSettings?.programs?.map((program, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Program #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (aboutSettings) {
                            setAboutSettings({
                              ...aboutSettings,
                              programs: (aboutSettings.programs || []).filter((_, i) => i !== index)
                            });
                          }
                        }}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Icon Name
                        </label>
                        <input
                          type="text"
                          value={program.icon}
                          onChange={(e) => {
                            if (aboutSettings) {
                              const newPrograms = [...(aboutSettings.programs || [])];
                              newPrograms[index].icon = e.target.value;
                              setAboutSettings({ ...aboutSettings, programs: newPrograms });
                            }
                          }}
                          placeholder="GraduationCap, Heart, etc."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={program.title}
                          onChange={(e) => {
                            if (aboutSettings) {
                              const newPrograms = [...(aboutSettings.programs || [])];
                              newPrograms[index].title = e.target.value;
                              setAboutSettings({ ...aboutSettings, programs: newPrograms });
                            }
                          }}
                          placeholder="e.g., Keilmuan"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={program.description}
                        onChange={(e) => {
                          if (aboutSettings) {
                            const newPrograms = [...(aboutSettings.programs || [])];
                            newPrograms[index].description = e.target.value;
                            setAboutSettings({ ...aboutSettings, programs: newPrograms });
                          }
                        }}
                        rows={2}
                        placeholder="Brief description of this program..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  // Save both home and about settings
                  handleSaveHome();
                  handleSaveAbout();
                }}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Home Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Tab Content */}
      {activeTab === 'about' && aboutSettings && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">About Page Content</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission
              </label>
              <RichTextEditor
                value={aboutSettings.mission}
                onChange={(markdown) =>
                  setAboutSettings({ ...aboutSettings, mission: markdown })
                }
                placeholder="Enter mission statement..."
                height="200px"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vision
              </label>
              <RichTextEditor
                value={aboutSettings.vision}
                onChange={(markdown) =>
                  setAboutSettings({ ...aboutSettings, vision: markdown })
                }
                placeholder="Enter vision statement..."
                height="200px"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story
              </label>
              <RichTextEditor
                value={aboutSettings.story}
                onChange={(markdown) =>
                  setAboutSettings({ ...aboutSettings, story: markdown })
                }
                placeholder="Tell your organization's story..."
                height="300px"
              />
            </div>

            {/* Values Section (displayed on about page) */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Organizational Values</h3>
                <button
                  type="button"
                  onClick={() => {
                    if (aboutSettings) {
                      setAboutSettings({
                        ...aboutSettings,
                        values: [...(aboutSettings.values || []), { title: '', description: '', icon: '' }]
                      });
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Value
                </button>
              </div>

              <div className="space-y-4">
                {aboutSettings.values?.map((value, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Value #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (aboutSettings) {
                            setAboutSettings({
                              ...aboutSettings,
                              values: (aboutSettings.values || []).filter((_, i) => i !== index)
                            });
                          }
                        }}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Icon Name
                        </label>
                        <input
                          type="text"
                          value={value.icon}
                          onChange={(e) => {
                            if (aboutSettings) {
                              const newValues = [...(aboutSettings.values || [])];
                              newValues[index].icon = e.target.value;
                              setAboutSettings({ ...aboutSettings, values: newValues });
                            }
                          }}
                          placeholder="BookOpen, Users, etc."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={value.title}
                          onChange={(e) => {
                            if (aboutSettings) {
                              const newValues = [...(aboutSettings.values || [])];
                              newValues[index].title = e.target.value;
                              setAboutSettings({ ...aboutSettings, values: newValues });
                            }
                          }}
                          placeholder="e.g., Integrity"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={value.description}
                        onChange={(e) => {
                          if (aboutSettings) {
                            const newValues = [...(aboutSettings.values || [])];
                            newValues[index].description = e.target.value;
                            setAboutSettings({ ...aboutSettings, values: newValues });
                          }
                        }}
                        rows={2}
                        placeholder="Brief description of this value..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t">
              <button
                type="button"
                onClick={handleSaveAbout}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save About Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Tab Content */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>

            {/* Contact Details */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800">Contact Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={contactSettings.phone}
                    onChange={(e) =>
                      setContactSettings({ ...contactSettings, phone: e.target.value })
                    }
                    placeholder="628123456789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={contactSettings.whatsapp}
                    onChange={(e) =>
                      setContactSettings({ ...contactSettings, whatsapp: e.target.value })
                    }
                    placeholder="628123456789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={contactSettings.email}
                  onChange={(e) =>
                    setContactSettings({ ...contactSettings, email: e.target.value })
                  }
                  placeholder="contact@kemafar.org"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={contactSettings.address}
                  onChange={(e) =>
                    setContactSettings({ ...contactSettings, address: e.target.value })
                  }
                  rows={3}
                  placeholder="Jl. H.M. Yasin Limpo No. 36, Romangpolong, Gowa, Sulawesi Selatan"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800">Social Media Links</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={contactSettings.socialMedia.facebook}
                    onChange={(e) =>
                      setContactSettings({
                        ...contactSettings,
                        socialMedia: { ...contactSettings.socialMedia, facebook: e.target.value },
                      })
                    }
                    placeholder="https://facebook.com/kemafar"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={contactSettings.socialMedia.instagram}
                    onChange={(e) =>
                      setContactSettings({
                        ...contactSettings,
                        socialMedia: { ...contactSettings.socialMedia, instagram: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/kemafar"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={contactSettings.socialMedia.youtube}
                    onChange={(e) =>
                      setContactSettings({
                        ...contactSettings,
                        socialMedia: { ...contactSettings.socialMedia, youtube: e.target.value },
                      })
                    }
                    placeholder="https://youtube.com/@kemafar"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={contactSettings.socialMedia.twitter || ''}
                    onChange={(e) =>
                      setContactSettings({
                        ...contactSettings,
                        socialMedia: { ...contactSettings.socialMedia, twitter: e.target.value },
                      })
                    }
                    placeholder="https://twitter.com/kemafar"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={contactSettings.socialMedia.linkedin || ''}
                    onChange={(e) =>
                      setContactSettings({
                        ...contactSettings,
                        socialMedia: { ...contactSettings.socialMedia, linkedin: e.target.value },
                      })
                    }
                    placeholder="https://linkedin.com/company/kemafar"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Footer Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Footer Content</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Footer Description
                </label>
                <textarea
                  value={contactSettings.footerDescription}
                  onChange={(e) =>
                    setContactSettings({ ...contactSettings, footerDescription: e.target.value })
                  }
                  rows={4}
                  placeholder="Brief description about your organization for the footer..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t">
              <button
                type="button"
                onClick={handleSaveContact}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Contact Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
