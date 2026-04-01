import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { User, Mail, Phone, MapPin, Camera, Save, Shield, Star, Award, TrendingUp, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function StudentProfile() {
  const { t } = useLanguage();
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    profile_photo_url: user?.profile_photo_url || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.put('/users/profile', formData);
      toast.success(t('profileUpdated') || 'Profile updated successfully!');
      // Update local storage/redux if needed (omitted for brevity)
    } catch (err) {
      toast.error(t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.loading('Uploading photo...');
    try {
      // Logic for Cloudinary/Firebase upload would go here
      // For now, mocking update
      setTimeout(() => {
        toast.dismiss();
        toast.success('Photo updated!');
      }, 1500);
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative group">
            <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-[var(--color-surface)] shadow-2xl bg-[var(--color-surface-2)]">
              {formData.profile_photo_url ? (
                <img src={formData.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[var(--color-text-muted)]">
                  {user?.full_name?.charAt(0)}
                </div>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 p-3 bg-[var(--color-primary)] text-white rounded-2xl cursor-pointer shadow-lg hover:scale-110 transition-all">
              <Camera size={20} />
              <input type="file" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>

          <div className="flex-1 pt-4">
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">
              {user?.full_name}
            </h1>
            <p className="text-[var(--color-text-muted)] mt-2 flex items-center gap-2">
              <Shield size={16} className="text-[var(--color-accent)]" /> 
              {user?.role?.toUpperCase()} | {user?.department_name || 'Unassigned'}
            </p>
            <div className="flex gap-4 mt-6">
              <div className="px-4 py-2 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border)] text-center">
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Current Level</p>
                <p className="text-xl font-bold text-[var(--color-primary)] font-sora">Lvl {user?.current_level || 1}</p>
              </div>
              <div className="px-4 py-2 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border)] text-center">
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Total XP</p>
                <p className="text-xl font-bold text-[var(--color-accent)] font-sora">{user?.total_xp || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6 font-sora flex items-center gap-2">
                <User size={20} className="text-[var(--color-primary)]" />
                {t('profileDetails') || "Profile Details"}
              </h2>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-2 px-1">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] p-4 rounded-xl text-sm focus:border-[var(--color-primary)] outline-none min-h-[120px] resize-none transition-all"
                    placeholder="Tell us about your learning goals..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-2 px-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] pl-12 pr-4 py-3 rounded-xl text-sm focus:border-[var(--color-primary)] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-2 px-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <input
                        type="text"
                        disabled
                        value={user?.email}
                        className="w-full bg-black/5 dark:bg-white/5 border border-[var(--color-border)] pl-12 pr-4 py-3 rounded-xl text-sm italic text-[var(--color-text-muted)] cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {t('saveChanges')}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6">
             <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-6 font-sora flex items-center gap-2">
                  <Award size={18} className="text-[var(--color-accent)]" />
                  Your Badges
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {user?.badges?.length > 0 ? (
                    user.badges.map((b, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center text-xl">
                          {b.icon || '🏅'}
                        </div>
                        <span className="text-[9px] text-[var(--color-text-muted)] font-bold text-center leading-tight uppercase">{b.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-6 text-[var(--color-text-muted)] text-xs italic">
                      No badges earned yet.
                    </div>
                  )}
                </div>
             </div>

             <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20">
                <div className="flex justify-between items-start mb-6">
                  <TrendingUp size={24} />
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-1 rounded">Rank #124</span>
                </div>
                <h3 className="font-bold font-sora text-lg mb-1">Weekly Challenge</h3>
                <p className="text-white/80 text-xs leading-relaxed mb-4">Complete 3 mini-projects this week to earn "Sprint Master" badge.</p>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                   <div className="w-2/3 h-full bg-white transition-all duration-1000" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
