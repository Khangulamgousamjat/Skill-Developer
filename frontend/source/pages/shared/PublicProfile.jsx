import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Award, Shield, Target, ExternalLink, Mail, Loader2, User as UserIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

export default function PublicProfile() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/users/public/${id}`);
      setProfile(res.data.data);
    } catch (err) {
      toast.error(t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-[var(--color-text-muted)]">User not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Profile Card */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-xl">
          <div className="h-32 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] opacity-80" />
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6 flex flex-col md:flex-row md:items-end gap-6">
              <div className="w-32 h-32 rounded-3xl bg-[var(--color-surface-2)] border-4 border-[var(--color-surface)] overflow-hidden shadow-lg">
                {profile.profile_photo_url ? (
                  <img src={profile.profile_photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[var(--color-text-muted)]">
                    {profile.full_name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">
                  {profile.full_name}
                </h1>
                <p className="text-[var(--color-text-muted)] text-sm flex items-center gap-2 mt-1">
                  <Shield size={14} className="text-[var(--color-primary)]" />
                  {profile.role?.toUpperCase()} | {profile.department_name}
                </p>
              </div>
              <div className="flex gap-2">
                 <button className="px-4 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl text-xs font-bold hover:bg-black/5 transition-all flex items-center gap-2">
                    <Mail size={14} /> Message
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-[var(--color-border)]">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3">About</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed bg-[var(--color-surface-2)] p-4 rounded-2xl border border-[var(--color-border)]">
                    {profile.bio || "No bio provided yet."}
                  </p>
                </div>

                <div>
                   <h3 className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4">Badges & Achievements</h3>
                   <div className="flex flex-wrap gap-4">
                      {profile.badges?.length > 0 ? profile.badges.map((b, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 p-3 bg-[var(--color-surface-2)] rounded-2xl border border-transparent hover:border-[var(--color-accent)] transition-all">
                          <div className="text-2xl">{b.icon || '🏅'}</div>
                          <span className="text-[8px] font-bold uppercase tracking-tighter">{b.name}</span>
                        </div>
                      )) : (
                        <p className="text-xs text-[var(--color-text-muted)] italic">No badges earned yet.</p>
                      )}
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-[var(--color-surface-2)] rounded-3xl p-6 border border-[var(--color-border)]">
                    <h3 className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Target size={14} className="text-[var(--color-primary)]" />
                      Learning Stats
                    </h3>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-xs text-[var(--color-text-secondary)]">Current Level</span>
                          <span className="font-bold text-[var(--color-primary)]">Lvl {profile.current_level || 1}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-xs text-[var(--color-text-secondary)]">Total XP</span>
                          <span className="font-bold text-[var(--color-accent)]">{profile.total_xp || 0} XP</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

