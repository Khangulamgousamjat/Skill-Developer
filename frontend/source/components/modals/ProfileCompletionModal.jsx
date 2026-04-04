import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, User, Briefcase, Tag, Globe, MapPin, Loader2, Link, Save } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { updateUser } from '../../store/slices/authSlice';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

export default function ProfileCompletionModal() {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    position: '',
    bio: '',
    location: '',
    phone: user?.phone || '',
    skills: [],
    social_links: {
      github: '',
      linkedin: ''
    }
  });
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.put('/users/profile', formData);
      dispatch(updateUser(res.data.data));
      toast.success(t('profileUpdated') || 'Profile Completed!');
    } catch (err) {
      toast.error(t('somethingWentWrong'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.is_profile_completed) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side - Welcome/Illustration */}
        <div className="hidden md:flex md:w-1/3 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] p-8 flex-col justify-between text-white">
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
              <User size={24} />
            </div>
            <h2 className="text-2xl font-bold font-sora leading-tight">
              {t('completeYourProfile') || 'Complete Your Profile'}
            </h2>
            <p className="text-white/80 text-sm mt-4 leading-relaxed">
              Help your teammates and managers know you better by sharing your skills and professional details.
            </p>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-xs bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Takes only 2 minutes</span>
             </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-[var(--color-bg)]/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Position */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest flex items-center gap-2">
                  <Briefcase size={14} className="text-[var(--color-primary)]" />
                  {t('position') || 'Professional Title'}
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Senior Software Intern"
                  className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all text-sm"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} className="text-[var(--color-primary)]" />
                  {t('location') || 'Location'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, India"
                  className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all text-sm"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest flex items-center gap-2">
                <User size={14} className="text-[var(--color-primary)]" />
                {t('bio') || 'Bio'}
              </label>
              <textarea
                required
                rows={3}
                placeholder={t('bioPlaceholder') || 'Tell us about yourself...'}
                className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all text-sm resize-none"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest flex items-center gap-2">
                <Tag size={14} className="text-[var(--color-primary)]" />
                {t('skills') || 'Skills'}
                <span className="text-[10px] lowercase font-normal opacity-60">(Press Enter to add)</span>
              </label>
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-2 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 focus-within:border-[var(--color-primary)] transition-all">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold rounded-full border border-[var(--color-primary)]/20">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder={t('skillsPlaceholder') || "e.g. React, Node.js, Python"}
                  className="w-full bg-transparent border-none outline-none text-sm px-2 py-1"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest flex items-center gap-2">
                  <Link size={14} className="text-[var(--color-text-primary)]" />
                  GitHub URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/yourusername"
                  className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl focus:ring-2 focus:ring-black/20 focus:border-black outline-none transition-all text-sm"
                  value={formData.social_links.github}
                  onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, github: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest flex items-center gap-2">
                  <Link size={14} className="text-blue-600" />
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/yourusername"
                  className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                  value={formData.social_links.linkedin}
                  onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, linkedin: e.target.value } })}
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white rounded-2xl font-bold font-sora shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Save size={20} />
                  {t('saveAndContinue') || 'Save and Continue'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
