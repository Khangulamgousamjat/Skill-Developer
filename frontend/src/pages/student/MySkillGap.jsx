import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, RadarChart as RChart } from 'recharts';
import { Target, TrendingUp, AlertCircle, CheckCircle2, Sparkles, Bot, ArrowRight, Zap, Target as TargetIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../api/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function MySkillGap() {
  const { t } = useLanguage();
  const { user } = useSelector(state => state.auth);
  const [skillData, setSkillData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxGapSkill, setMaxGapSkill] = useState(null);

  useEffect(() => {
    if (user) fetchSkills();
  }, [user]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      // 1. Fetch from 'student_skills' (assuming it joins or contains name)
      // For this implementation, we join with 'skills' table
      const { data, error } = await supabase
        .from('student_skills')
        .select(`
          current_level,
          required_level,
          skills ( name, id, category )
        `)
        .eq('student_id', user.id);

      if (error) throw error;

      const formatted = (data || []).map(s => ({
        name: s.skills.name,
        current: s.current_level,
        required: s.required_level,
        gap: Math.max(0, s.required_level - s.current_level),
        category: s.skills.category
      })).sort((a, b) => b.gap - a.gap);

      setSkillData(formatted);
      if (formatted.length > 0 && formatted[0].gap > 0) {
        setMaxGapSkill(formatted[0]);
      }
    } catch (err) {
      toast.error('Tactical radar sync failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (current, required) => {
    if (current >= required) return 'text-emerald-500';
    if (required - current <= 20) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-12 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-left">
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] tracking-tight">Tactical Skill Gap Radar</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1.5 font-medium">Synchronize your proficiency matrix against fleet-required standards</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="p-3 px-5 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] shadow-sm">
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Radar Health</p>
                <p className="text-lg font-bold text-emerald-500">OPTIMIZED</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Chart Card (Left 60%) */}
          <div className="lg:col-span-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[48px] p-10 shadow-sm relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
               <Target size={180} />
            </div>
            
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-10 font-sora flex items-center gap-3">
              <TrendingUp size={22} className="text-[var(--color-primary)]" />
              Unified Proficiency Matrix
            </h2>
            
            <div className="h-[450px] w-full">
              {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                   <div className="w-14 h-14 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin shadow-xl" />
                   <p className="text-[10px] font-black uppercase tracking-[3px] text-[var(--color-text-muted)]">Scanning Skillsets...</p>
                </div>
              ) : skillData.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                   <TargetIcon size={64} className="mb-6 opacity-10" />
                   <p className="font-bold italic">No proficiency data found in your profile.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                    <PolarGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                    <PolarAngleAxis 
                      dataKey="name" 
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontWeight: '900', letterSpacing: '0.1em' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--color-surface)', 
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                        borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                        borderBottom: '4px solid var(--color-primary)'
                      }}
                    />
                    <Radar
                      name="Current Level"
                      dataKey="current"
                      stroke="var(--color-primary)"
                      strokeWidth={3}
                      fill="var(--color-primary)"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Required Level"
                      dataKey="required"
                      stroke="var(--color-accent)"
                      strokeWidth={2}
                      fill="var(--color-accent)"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <div className="flex justify-center gap-8 mt-10 text-[10px] font-black uppercase tracking-[0.2em]">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-[var(--color-primary)] rounded-md shadow-lg shadow-[var(--color-primary)]/20" />
                <span className="text-[var(--color-text-muted)]">Actual Proficiency</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-[var(--color-accent)]/40 rounded-md border border-[var(--color-accent)]" />
                <span className="text-[var(--color-text-muted)]">Fleet Standard</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            {/* AI ADVISOR CARD */}
            <AnimatePresence>
               {maxGapSkill && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl group border border-white/5 text-left"
                  >
                     <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-1000 text-white">
                        <Bot size={160} />
                     </div>
                     <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                           <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                              <Sparkles size={20} fill="currentColor" />
                           </div>
                           <h3 className="text-lg font-bold font-sora">A.I. Tactical Advisor</h3>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed font-medium mb-6">
                           Identity synthesized. Your largest proficiency gap is in <span className="text-amber-400 font-bold">{maxGapSkill.name}</span>.
                        </p>
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
                           <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-3">Tactical Recommendation</p>
                           <p className="text-xs italic leading-relaxed text-white/90">
                             "Prioritize Module 4: Advanced {maxGapSkill.name} Patterns within the Curriculum Vault. Completing this will bridge {maxGapSkill.gap}% of the current synthesis deficit."
                           </p>
                        </div>
                        <button className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 shadow-xl">
                           Launch Training Session <ArrowRight size={18} />
                        </button>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Analysis List Card */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-10 shadow-sm overflow-hidden flex flex-col text-left">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-10 font-sora flex items-center gap-3">
                <AlertCircle size={22} className="text-rose-500" />
                Gap Analysis Engine
              </h2>

              <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  [1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-[var(--color-surface-2)]/50 animate-pulse rounded-2xl" />)
                ) : skillData.length === 0 ? (
                  <p className="text-[var(--color-text-muted)] text-center py-10 font-medium italic">No metrics available.</p>
                ) : (
                  skillData.map((skill, idx) => {
                    const gap = skill.required - skill.current;
                    return (
                      <div key={idx} className="p-5 bg-[var(--color-surface-2)]/30 border border-transparent hover:border-[var(--color-primary)]/20 rounded-[2rem] group transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="text-left">
                            <h3 className="font-bold text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{skill.name}</h3>
                            <p className="text-[8px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mt-1 opacity-60 flex items-center gap-2">
                               <Zap size={10} className="text-amber-500" /> {skill.category || 'Competency'}
                            </p>
                          </div>
                          {gap <= 0 ? (
                            <div className="p-1 px-3 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center gap-1.5 ring-1 ring-emerald-500/10">
                               <CheckCircle2 size={12} />
                               <span className="text-[9px] font-black uppercase tracking-widest">Mastered</span>
                            </div>
                          ) : (
                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${getStatusColor(skill.current, skill.required)} bg-white border border-[var(--color-border)] shadow-sm`}>
                              {gap}% Synthesized Deficit
                            </span>
                          )}
                        </div>
                        <div className="w-full h-2 bg-[var(--color-surface)] rounded-full overflow-hidden border border-[var(--color-border)] shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.current}%` }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className={`h-full ${gap <= 0 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-[var(--color-primary)]'} transition-all`} 
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

