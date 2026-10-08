import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, authApi } from '../api/client';
import {
  Settings as SettingsIcon,
  Save,
  Key,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  Share2,
  Layout,
  Search,
  Lock,
  Building,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';

export function Settings() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('site');
  const [toast, setToast] = useState(null);

  // Form State for Password Change
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: adminApi.getSettings,
  });

  const [settings, setSettings] = useState(null);

  React.useEffect(() => {
    if (settingsData?.data) {
      const data = settingsData.data;
      // Ensure nested global_seo exists
      if (!data.global_seo) {
        data.global_seo = {
          site_title: '',
          meta_description: '',
          og_image: '',
          default_keywords: '',
          google_verification: ''
        };
      }
      setSettings(data);
    }
  }, [settingsData]);

  // Update Settings Mutation
  const settingsMutation = useMutation({
    mutationFn: (updatedSettings) => adminApi.updateSettings(updatedSettings),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminSettings']);
      queryClient.invalidateQueries(['publicSettings']);
      showToast('Site Settings & Homepage Content updated successfully!');
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  // Password Mutation
  const passwordMutation = useMutation({
    mutationFn: (passData) => authApi.changePassword(passData),
    onSuccess: () => {
      setCurrPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password changed successfully!');
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    settingsMutation.mutate(settings);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    passwordMutation.mutate({ current_password: currPassword, new_password: newPassword });
  };

  if (isLoading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400 mb-2" />
        <p className="text-xs">Loading Settings...</p>
      </div>
    );
  }

  const updateGlobalSeo = (field, val) => {
    setSettings({
      ...settings,
      global_seo: {
        ...(settings.global_seo || {}),
        [field]: val
      }
    });
  };

  const updateWhyChooseUs = (index, field, val) => {
    const list = [...(settings.why_choose_us || [])];
    list[index] = { ...list[index], [field]: val };
    setSettings({ ...settings, why_choose_us: list });
  };

  const updateProcessStep = (index, field, val) => {
    const list = [...(settings.process_steps || [])];
    list[index] = { ...list[index], [field]: val };
    setSettings({ ...settings, process_steps: list });
  };

  const tabs = [
    { id: 'site', label: 'Company Info & Contact', icon: Building },
    { id: 'social', label: 'Social Links', icon: Share2 },
    { id: 'home', label: 'Homepage Content', icon: Layout },
    { id: 'seo', label: 'Global SEO', icon: Search },
    { id: 'footer', label: 'Footer Settings', icon: Sliders },
    { id: 'security', label: 'Admin Security', icon: Lock },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            toast.type === 'error'
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-sky-400" />
          <span>System Settings & Content Management</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Manage global website settings, branding, homepage hero, social links, SEO, and security.</p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 pt-6 mt-4 border-t border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: SITE & COMPANY SETTINGS */}
      {activeTab === 'site' && (
        <form onSubmit={handleSettingsSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Building className="w-4 h-4 text-sky-400" />
            <span>Company Information & Branding</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Company / Site Name</label>
              <input
                type="text"
                value={settings.site_name || settings.company_name || ''}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value, company_name: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Support Email</label>
              <input
                type="email"
                value={settings.support_email || ''}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contact_phone || ''}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Business Hours</label>
              <input
                type="text"
                value={settings.business_hours || ''}
                onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                placeholder="Mon - Fri: 9:00 AM - 6:00 PM EST"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-300 mb-1">Office Physical Address</label>
            <input
              type="text"
              value={settings.office_address || ''}
              onChange={(e) => setSettings({ ...settings, office_address: e.target.value })}
              className="w-full glass-input rounded-xl p-2.5 text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Company Logo URL</label>
              <input
                type="text"
                value={settings.logo || ''}
                onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100 font-mono"
              />
              {settings.logo && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={settings.logo} alt="Logo Preview" className="w-8 h-8 rounded object-cover border border-slate-700" />
                  <span className="text-[10px] text-slate-400">Logo Preview</span>
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Favicon URL</label>
              <input
                type="text"
                value={settings.favicon || ''}
                onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-300 mb-1">Company Description</label>
            <textarea
              rows={3}
              value={settings.company_description || ''}
              onChange={(e) => setSettings({ ...settings, company_description: e.target.value })}
              className="w-full glass-input rounded-xl p-2.5 text-slate-100"
            />
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={settingsMutation.isPending}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-sky-500/20"
            >
              {settingsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Site Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SOCIAL LINKS */}
      {activeTab === 'social' && (
        <form onSubmit={handleSettingsSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-sky-400" />
            <span>Official Social Media Channels</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Facebook URL</label>
              <input
                type="text"
                value={settings.social_facebook || ''}
                onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                placeholder="https://facebook.com/yourcompany"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Instagram URL</label>
              <input
                type="text"
                value={settings.social_instagram || ''}
                onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                placeholder="https://instagram.com/yourcompany"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={settings.social_linkedin || ''}
                onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">YouTube Channel URL</label>
              <input
                type="text"
                value={settings.social_youtube || ''}
                onChange={(e) => setSettings({ ...settings, social_youtube: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                placeholder="https://youtube.com/@yourcompany"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">TikTok Handle / URL</label>
              <input
                type="text"
                value={settings.social_tiktok || ''}
                onChange={(e) => setSettings({ ...settings, social_tiktok: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                placeholder="https://tiktok.com/@yourcompany"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">X (Twitter) URL</label>
              <input
                type="text"
                value={settings.social_x || ''}
                onChange={(e) => setSettings({ ...settings, social_x: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                placeholder="https://x.com/yourcompany"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={settingsMutation.isPending}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-sky-500/20"
            >
              {settingsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Social Links</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: HOMEPAGE CONTENT */}
      {activeTab === 'home' && (
        <form onSubmit={handleSettingsSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Layout className="w-4 h-4 text-sky-400" />
            <span>Public Homepage Content & Sections</span>
          </h2>

          {/* Hero Section */}
          <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider">1. Hero Section</h3>
            
            <div className="text-xs">
              <label className="block font-semibold text-slate-300 mb-1">Hero Pill Badge</label>
              <input
                type="text"
                value={settings.hero_badge || ''}
                onChange={(e) => setSettings({ ...settings, hero_badge: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
              />
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-300 mb-1">Hero Heading</label>
              <input
                type="text"
                value={settings.hero_heading || ''}
                onChange={(e) => setSettings({ ...settings, hero_heading: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100 font-bold"
                required
              />
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-300 mb-1">Hero Description</label>
              <textarea
                rows={3}
                value={settings.hero_description || ''}
                onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                required
              />
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-300 mb-1">Hero Image / Graphic URL</label>
              <input
                type="text"
                value={settings.hero_image || ''}
                onChange={(e) => setSettings({ ...settings, hero_image: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Primary CTA Button Label</label>
                <input
                  type="text"
                  value={settings.hero_cta_primary_label || ''}
                  onChange={(e) => setSettings({ ...settings, hero_cta_primary_label: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Primary CTA URL</label>
                <input
                  type="text"
                  value={settings.hero_cta_primary_url || ''}
                  onChange={(e) => setSettings({ ...settings, hero_cta_primary_url: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Secondary CTA Button Label</label>
                <input
                  type="text"
                  value={settings.hero_cta_secondary_label || ''}
                  onChange={(e) => setSettings({ ...settings, hero_cta_secondary_label: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Secondary CTA URL</label>
                <input
                  type="text"
                  value={settings.hero_cta_secondary_url || ''}
                  onChange={(e) => setSettings({ ...settings, hero_cta_secondary_url: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Statistics Bar */}
          <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider">2. Key Statistics Counters</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Projects Delivered</label>
                <input
                  type="text"
                  value={settings.stats_projects || ''}
                  onChange={(e) => setSettings({ ...settings, stats_projects: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-100 text-center font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Client Satisfaction</label>
                <input
                  type="text"
                  value={settings.stats_clients || ''}
                  onChange={(e) => setSettings({ ...settings, stats_clients: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-100 text-center font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">SLA Uptime</label>
                <input
                  type="text"
                  value={settings.stats_uptime || ''}
                  onChange={(e) => setSettings({ ...settings, stats_uptime: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-100 text-center font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Support Availability</label>
                <input
                  type="text"
                  value={settings.stats_satisfaction || ''}
                  onChange={(e) => setSettings({ ...settings, stats_satisfaction: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-100 text-center font-bold"
                />
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider">3. Why Choose Us Feature Cards</h3>
            {(settings.why_choose_us || []).map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-300">Feature #{idx + 1}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => updateWhyChooseUs(idx, 'title', e.target.value)}
                    placeholder="Feature Title"
                    className="glass-input rounded-lg p-2 text-slate-100 font-semibold"
                  />
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => updateWhyChooseUs(idx, 'description', e.target.value)}
                    placeholder="Short Description"
                    className="glass-input rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Process Section */}
          <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider">4. Our Process Steps</h3>
            {(settings.process_steps || []).map((step, idx) => (
              <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-300">Step {step.step || `0${idx + 1}`}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={step.title || ''}
                    onChange={(e) => updateProcessStep(idx, 'title', e.target.value)}
                    placeholder="Step Title"
                    className="glass-input rounded-lg p-2 text-slate-100 font-semibold"
                  />
                  <input
                    type="text"
                    value={step.description || ''}
                    onChange={(e) => updateProcessStep(idx, 'description', e.target.value)}
                    placeholder="Step Explanation"
                    className="glass-input rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner Section */}
          <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider">5. Bottom CTA Banner</h3>
            <div className="text-xs">
              <label className="block font-semibold text-slate-300 mb-1">Banner Title</label>
              <input
                type="text"
                value={settings.cta_banner_title || ''}
                onChange={(e) => setSettings({ ...settings, cta_banner_title: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100 font-bold"
              />
            </div>
            <div className="text-xs">
              <label className="block font-semibold text-slate-300 mb-1">Banner Subtext</label>
              <input
                type="text"
                value={settings.cta_banner_description || ''}
                onChange={(e) => setSettings({ ...settings, cta_banner_description: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Button Label</label>
                <input
                  type="text"
                  value={settings.cta_banner_button_label || ''}
                  onChange={(e) => setSettings({ ...settings, cta_banner_button_label: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Button Target URL</label>
                <input
                  type="text"
                  value={settings.cta_banner_button_url || ''}
                  onChange={(e) => setSettings({ ...settings, cta_banner_button_url: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={settingsMutation.isPending}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-sky-500/20"
            >
              {settingsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Homepage Content</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: GLOBAL SEO */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSettingsSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-sky-400" />
            <span>Global Search Engine Optimization (SEO)</span>
          </h2>

          <div className="text-xs">
            <label className="block font-semibold text-slate-300 mb-1">Global Default Site Title</label>
            <input
              type="text"
              value={settings.global_seo?.site_title || ''}
              onChange={(e) => updateGlobalSeo('site_title', e.target.value)}
              className="w-full glass-input rounded-xl p-2.5 text-slate-100 font-semibold"
              placeholder="Growth IT Solution | Next-Gen Enterprise IT Engine & AI Solutions"
            />
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-300 mb-1">Global Meta Description</label>
            <textarea
              rows={3}
              value={settings.global_seo?.meta_description || ''}
              onChange={(e) => updateGlobalSeo('meta_description', e.target.value)}
              className="w-full glass-input rounded-xl p-2.5 text-slate-100"
              placeholder="Comprehensive software development, cloud infrastructure, AI solutions..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Default OpenGraph (OG) Image URL</label>
              <input
                type="text"
                value={settings.global_seo?.og_image || ''}
                onChange={(e) => updateGlobalSeo('og_image', e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Google Search Console Verification Tag</label>
              <input
                type="text"
                value={settings.global_seo?.google_verification || ''}
                onChange={(e) => updateGlobalSeo('google_verification', e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100 font-mono"
                placeholder="google-site-verification=xxxx"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-300 mb-1">Default Keywords (Comma separated)</label>
            <input
              type="text"
              value={settings.global_seo?.default_keywords || ''}
              onChange={(e) => updateGlobalSeo('default_keywords', e.target.value)}
              className="w-full glass-input rounded-xl p-2.5 text-slate-100"
              placeholder="cloud devops, enterprise ai, web development"
            />
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={settingsMutation.isPending}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-sky-500/20"
            >
              {settingsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Global SEO Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: FOOTER SETTINGS */}
      {activeTab === 'footer' && (
        <form onSubmit={handleSettingsSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Footer Configuration & Copyright</span>
          </h2>

          <div className="text-xs">
            <label className="block font-semibold text-slate-300 mb-1">Footer Brand Description</label>
            <textarea
              rows={3}
              value={settings.footer_description || ''}
              onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
              className="w-full glass-input rounded-xl p-2.5 text-slate-100"
            />
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-300 mb-1">Footer Copyright Notice</label>
            <input
              type="text"
              value={settings.footer_copyright || ''}
              onChange={(e) => setSettings({ ...settings, footer_copyright: e.target.value })}
              className="w-full glass-input rounded-xl p-2.5 text-slate-100 font-semibold"
              placeholder="© 2026 Growth IT Solution Inc. All rights reserved."
            />
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={settingsMutation.isPending}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-sky-500/20"
            >
              {settingsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Footer Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 6: ADMIN SECURITY */}
      {activeTab === 'security' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h2 className="text-sm font-bold text-slate-100 mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Account Security & Change Password</span>
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs max-w-md">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                value={currPassword}
                onChange={(e) => setCurrPassword(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">New Password (min 8 characters)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
                required
                minLength={8}
              />
            </div>
            <button
              type="submit"
              disabled={passwordMutation.isPending}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {passwordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              <span>Update Account Password</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
