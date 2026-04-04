import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, Mail, Building2, Shield, Briefcase, MapPin, 
  Phone, Globe, Edit, Save, X, Loader2, Link, 
  Award, CheckCircle2, CloudUpload
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { updateUser } from '../../store/slices/authSlice';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

export default function ProfilePageTemplate({ children }) {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ ...user, 
        skills: Array.isArray(user.skills) ? user.skills : [],
        social_links: user.social_links || { github: '', linkedin: '' }
      });
    }
  }, [user]);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      const currentSkills = Array.isArray(formData.skills) ? formData.skills : [];
      if (!currentSkills.includes(skillInput.trim())) {
        setFormData({ ...formData, skills: [...currentSkills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.put('/users/profile', formData);
      dispatch(updateUser(res.data.data));
      setIsEditing(false);
      toast.success(t('profileUpdated') || 'Profile Updated!');
    } catch (err) {
      toast.error(t('somethingWentWrong'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Profile Section */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-xl">
        <div className="h-40 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] opacity-90 relative">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 mb-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-[var(--color-surface)] border-4 border-[var(--color-surface)] overflow-hidden shadow-2xl relative">
                {user.profile_photo_url ? (
                  <img src={user.profile_photo_url} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-[var(--color-surface-2)] text-[var(--color-primary)]">
                    {user.full_name?.charAt(0)}
                  </div>
                )}
                {isEditing && (
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <CloudUpload size={24} />
                    <span className="text-[10px] font-bold mt-1">UPDATE</span>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                )}
              </div>
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">
                  {user.full_name}
                </h1>
                {user.is_email_verified && (
                  <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span className="text-[10px] font-bold">VERIFIED</span>
                  </div>
                )}
              </div>
              <p className="text-[var(--color-text-muted)] font-medium flex items-center gap-2 mt-1">
                <Shield size={14} className="text-[var(--color-primary)]" />
                <span className="capitalize">{user.role?.replace('_', ' ')}</span>
                {user.department_name && (
                  <>
                    <span className="opacity-30">•</span>
                    <Building2 size={14} />
                    <span>{user.department_name}</span>
                  </>
                )}
              </p>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all flex items-center gap-2"
                  >
                    <X size={16} /> {t('cancel')}
                  </button>
                  <button 
                    disabled={loading}
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white rounded-xl text-sm font-bold shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {t('save')}
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <Edit size={16} /> {t('editProfile')}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-[var(--color-border)]">
            {/* Left Column - Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Bio & Position */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em]">{t('aboutMe')}</h3>
                </div>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-[var(--color-text-muted)]">{t('position')}</label>
                       <input 
                         type="text" 
                         value={formData.position || ''} 
                         onChange={(e) => setFormData({...formData, position: e.target.value})}
                         className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm outline-none focus:border-[var(--color-primary)] transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-[var(--color-text-muted)]">{t('bio')}</label>
                       <textarea 
                         rows={4}
                         value={formData.bio || ''} 
                         onChange={(e) => setFormData({...formData, bio: e.target.value})}
                         className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm outline-none focus:border-[var(--color-primary)] transition-all resize-none"
                       />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.position && (
                       <p className="text-xl font-bold font-sora text-[var(--color-primary)] flex items-center gap-2">
                         <Briefcase size={20} /> {user.position}
                       </p>
                    )}
                    <p className="text-sm text-[var(--color-text-secondary)] leading-loose p-6 bg-[var(--color-surface-2)] rounded-2xl border border-[var(--color-border)] italic">
                      " {user.bio || "No bio added yet. Tell us about yourself!"} "
                    </p>
                  </div>
                )}
              </section>

              {/* Skills Section */}
              <section className="space-y-4">
                <h3 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em]">{t('skills')}</h3>
                {isEditing ? (
                  <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl p-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(formData.skills || []).map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full flex items-center gap-2 shadow-sm">
                          {skill} <button onClick={() => removeSkill(skill)}><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      placeholder={t('skillsPlaceholder')}
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      className="w-full bg-transparent border-none outline-none text-sm placeholder:text-[var(--color-text-muted)]"
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {user.skills && user.skills.length > 0 ? (
                      user.skills.map((skill, i) => (
                        <div key={i} className="px-5 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl flex items-center gap-2 hover:border-[var(--color-primary)] transition-all group">
                          <Award size={14} className="text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-[var(--color-text-primary)]">{skill}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[var(--color-text-muted)] italic">No skills listed yet.</p>
                    )}
                  </div>
                )}
              </section>
            </div>

            {/* Right Column - Info Cards */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-[var(--color-surface-2)] rounded-3xl p-6 border border-[var(--color-border)] transition-all hover:shadow-md">
                <h3 className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Globe size={14} className="text-[var(--color-primary)]" />
                  {t('contactInfo')}
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-black/20 rounded-xl flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-border)]">
                      <Mail size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-0.5">Email</p>
                      <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-black/20 rounded-xl flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-border)]">
                      <Phone size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-0.5">{t('phone')}</p>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={formData.phone || ''} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-transparent border-b border-[var(--color-border)] outline-none text-xs font-semibold text-[var(--color-primary)]"
                        />
                      ) : (
                        <p className="text-xs font-semibold text-[var(--color-text-primary)]">{user.phone || 'N/A'}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-black/20 rounded-xl flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-border)]">
                      <MapPin size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-0.5">{t('location')}</p>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={formData.location || ''} 
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="w-full bg-transparent border-b border-[var(--color-border)] outline-none text-xs font-semibold text-[var(--color-primary)]"
                        />
                      ) : (
                        <p className="text-xs font-semibold text-[var(--color-text-primary)]">{user.location || 'Remote'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links Card */}
              <div className="bg-[var(--color-surface-2)] rounded-3xl p-6 border border-[var(--color-border)] transition-all hover:shadow-md">
                <h3 className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-6 flex items-center gap-2">
                   <Edit size={14} className="text-[var(--color-primary)]" />
                   Social Connect
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Link size={18} className="text-black dark:text-white" />
                      <span className="text-xs font-bold uppercase tracking-tight">GitHub</span>
                    </div>
                    {isEditing ? (
                      <input 
                        type="text" 
                        placeholder="Username"
                        value={formData.social_links?.github || ''} 
                        onChange={(e) => setFormData({...formData, social_links: {...(formData.social_links||{}), github: e.target.value}})}
                        className="bg-transparent border-b border-[var(--color-border)] outline-none text-xs font-semibold text-[var(--color-primary)] text-right"
                      />
                    ) : (
                      <a href={user.social_links?.github ? `https://github.com/${user.social_links.github}` : '#'} target="_blank" className="text-[var(--color-primary)] hover:underline text-[10px] font-bold uppercase italic">{user.social_links?.github || 'Connect'}</a>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Link size={18} className="text-[#0A66C2]" />
                      <span className="text-xs font-bold uppercase tracking-tight">LinkedIn</span>
                    </div>
                    {isEditing ? (
                      <input 
                        type="text" 
                        placeholder="Username"
                        value={formData.social_links?.linkedin || ''} 
                        onChange={(e) => setFormData({...formData, social_links: {...(formData.social_links||{}), linkedin: e.target.value}})}
                        className="bg-transparent border-b border-[var(--color-border)] outline-none text-xs font-semibold text-[var(--color-primary)] text-right"
                      />
                    ) : (
                      <a href={user.social_links?.linkedin ? `https://linkedin.com/in/${user.social_links.linkedin}` : '#'} target="_blank" className="text-[var(--color-primary)] hover:underline text-[10px] font-bold uppercase italic">{user.social_links?.linkedin || 'Connect'}</a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
