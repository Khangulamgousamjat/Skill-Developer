import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Star, Mail, 
  Award, CalendarDays, CheckCircle2, 
  MoreVertical, Loader2, StarHalf
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function TeamPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isDarkMode = useSelector((s) => s.ui.theme === 'dark');
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await api.get('/manager/team');
      if (res.data.success) {
        setTeam(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load team roster');
    } finally {
      setLoading(false);
    }
  };

  const filtered = team.filter(i => 
    i.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              Team Oversight
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">Monitoring performance and engagement across the department</p>
          </div>
          <div className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-5 py-3 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-xs font-black uppercase tracking-widest text-[var(--color-text-primary)]">
                {team.length} Active Members
             </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" />
           <input 
             type="text"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             placeholder="Search by name, email, or ID..."
             className="w-full pl-14 pr-6 py-4 rounded-[2rem] bg-[var(--color-surface)] border border-[var(--color-border)] text-sm focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all text-[var(--color-text-primary)] group-hover:border-[var(--color-primary)]/50 shadow-sm"
           />
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">Synchronizing team data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem]">
             <Users className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-muted)] opacity-20" />
             <h3 className="text-xl font-bold text-[var(--color-text-primary)]">No members found</h3>
             <p className="text-[var(--color-text-muted)] mt-1">Try adjusting your search criteria or verify department assignments</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(member => (
              <div key={member.id} className="group p-8 rounded-[3rem] border bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-[var(--color-primary)]/5 flex flex-col h-full overflow-hidden relative">
                 {/* Premium Glow Effect */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                 <div className="flex justify-between items-start mb-8">
                    <div className="relative">
                       <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden bg-[var(--color-surface-2)] shadow-xl relative z-10">
                          <img 
                            src={member.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`} 
                            alt={member.full_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                       </div>
                       <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-amber-500 shadow-lg z-20">
                          <Star size={14} className="fill-current" />
                       </div>
                    </div>
                    <button className="p-3 rounded-2xl hover:bg-[var(--color-surface-2)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                       <MoreVertical size={20} />
                    </button>
                 </div>

                 <div className="flex-1">
                    <h3 className="text-xl font-bold font-sora text-[var(--color-text-primary)] mb-1 group-hover:text-[var(--color-primary)] transition-colors line-gap-1">
                       {member.full_name}
                    </h3>
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-[0.15em] mb-6">Level {member.current_level || 1} Developer</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-8">
                       <div className="p-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]/50 flex flex-col items-center gap-1.5 hover:translate-y-[-2px] transition-transform">
                          <Award size={16} className="text-emerald-500" />
                          <span className="text-[10px] font-black tracking-widest text-[var(--color-text-primary)] uppercase">{member.total_xp || 0} XP</span>
                       </div>
                       <div className="p-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]/50 flex flex-col items-center gap-1.5 hover:translate-y-[-2px] transition-transform">
                          <CheckCircle2 size={16} className="text-[var(--color-primary)]" />
                          <span className="text-[10px] font-black tracking-widest text-[var(--color-text-primary)] uppercase">{member.projects_completed || 0} Done</span>
                       </div>
                       <div className="p-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]/50 flex flex-col items-center gap-1.5 hover:translate-y-[-2px] transition-transform">
                          <CalendarDays size={16} className="text-blue-500" />
                          <span className="text-[10px] font-black tracking-widest text-[var(--color-text-primary)] uppercase">94%</span>
                       </div>
                    </div>
                 </div>

                 <div className="mt-auto pt-6 border-t border-[var(--color-border)]/50 flex items-center gap-2">
                    <button 
                       onClick={() => navigate(`/manager/evaluation`, { state: { intern: member } })}
                       className="flex-1 py-4 rounded-2xl bg-[var(--color-primary)] text-white text-xs font-black uppercase tracking-widest hover:translate-y-[-2px] transition-all shadow-lg shadow-[var(--color-primary)]/20 active:scale-95"
                    >
                       Evaluate Intern
                    </button>
                    <button className="p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all">
                       <Mail size={18} />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
