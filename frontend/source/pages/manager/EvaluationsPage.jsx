import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Star, User, Calendar, 
  CheckCircle2, Loader2, Info, ArrowRight,
  Zap, Heart, Target, Lightbulb, TrendingUp,
  LineChart, Sparkles
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

export default function EvaluationsPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const isDarkMode = useSelector((s) => s.ui.theme === 'dark');
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntern, setSelectedIntern] = useState(location.state?.intern || null);
  const [submitting, setSubmitting] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [evaluation, setEvaluation] = useState({
    period_start: '',
    period_end: '',
    scores: {
      technical: 5,
      communication: 5,
      collaboration: 5,
      discipline: 5,
      problem_solving: 5
    },
    comments: ''
  });

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
      toast.error('Failed to load performance roster');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (skill, val) => {
    setEvaluation(prev => ({
      ...prev,
      scores: { ...prev.scores, [skill]: parseInt(val) }
    }));
  };

  const handleAIAudit = async () => {
    if (!selectedIntern) return;
    setAuditing(true);
    try {
        const res = await api.post('/ai/audit-intern', { internId: selectedIntern.id });
        if (res.data.success) {
            const { scores, comments } = res.data.data;
            setEvaluation(prev => ({
                ...prev,
                scores: scores,
                comments: comments
            }));
            toast.success('AI Audit Complete: Scores populated');
        }
    } catch (error) {
        toast.error('AI Audit failed. manual grading required.');
    } finally {
        setAuditing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIntern) return;
    
    setSubmitting(true);
    try {
      await api.post('/manager/evaluations', {
        internId: selectedIntern.id,
        periodStart: evaluation.period_start,
        periodEnd: evaluation.period_end,
        scores: evaluation.scores,
        comments: evaluation.comments
      });
      toast.success(`Evaluation for ${selectedIntern.full_name} finalized`);
      setSelectedIntern(null);
      setEvaluation({
        period_start: '',
        period_end: '',
        scores: { technical: 5, communication: 5, collaboration: 5, discipline: 5, problem_solving: 5 },
        comments: ''
      });
    } catch (err) {
      toast.error('Failed to finalize evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  const skillIcons = {
    technical: Zap,
    communication: Heart,
    collaboration: User,
    discipline: Target,
    problem_solving: Lightbulb
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-500" />
              </div>
              Performance Matrix
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">Strategic assessment and growth reviews for your direct reports</p>
          </div>
          <div className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-5 py-3 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-orange-500 shadow-xl shadow-orange-500/20" />
             <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-primary)]">
                Matrix Review Mode
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Intern Roster */}
          <div className="lg:col-span-4 space-y-4">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] ml-2 mb-6 flex items-center gap-2">
                <LineChart size={14} /> Team Depth Chart
             </h3>
             {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)] opacity-20" /></div>
             ) : team.map(intern => (
                <button
                   key={intern.id}
                   onClick={() => setSelectedIntern(intern)}
                   className={`w-full p-6 rounded-[2.5rem] border text-left transition-all duration-300 relative overflow-hidden group ${
                     selectedIntern?.id === intern.id 
                     ? 'bg-[var(--color-primary)] border-[var(--color-primary)] shadow-2xl shadow-[var(--color-primary)]/20' 
                     : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                   }`}
                >
                   {/* Background Highlight */}
                   <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${selectedIntern?.id === intern.id ? 'bg-white' : 'bg-[var(--color-primary)]'}`} />

                   <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-4">
                         <div className={`w-14 h-14 rounded-2xl overflow-hidden shadow-xl border-2 ${selectedIntern?.id === intern.id ? 'border-white/50' : 'border-transparent'}`}>
                           <img 
                             src={intern.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${intern.email}`} 
                             alt=""
                             className="w-full h-full object-cover"
                           />
                         </div>
                         <div>
                           <h4 className={`text-lg font-bold font-sora ${selectedIntern?.id === intern.id ? 'text-white' : 'text-[var(--color-text-primary)]'}`}>{intern.full_name}</h4>
                           <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${selectedIntern?.id === intern.id ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}>{intern.employee_id || 'ID_UNSET'}</span>
                         </div>
                      </div>
                      {selectedIntern?.id === intern.id && <ArrowRight size={20} className="text-white animate-pulse" />}
                   </div>
                </button>
             ))}
          </div>

          {/* Review Console */}
          <div className="lg:col-span-8 h-full">
            {selectedIntern ? (
              <div className="p-10 rounded-[3.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm relative overflow-hidden flex flex-col h-full animate-in zoom-in-95 duration-500">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 flex-1">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10 border-b border-[var(--color-border)] pb-10">
                     <div>
                        <h3 className="text-2xl font-bold font-sora text-[var(--color-text-primary)] mb-2">Analyzing {selectedIntern.full_name}</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">Finalize departmental performance metrics for the current period.</p>
                     </div>
                     <div className="flex flex-wrap items-center gap-3">
                        <button 
                           type="button"
                           onClick={handleAIAudit}
                           disabled={auditing}
                           className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest transition-all hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                        >
                           {auditing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                           {auditing ? "Synapsing Data..." : "Neural Audit"}
                        </button>
                        <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          Teacher Review
                        </div>
                     </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] ml-1">Period Initiation</label>
                          <input 
                            type="date"
                            value={evaluation.period_start}
                            onChange={(e) => setEvaluation({...evaluation, period_start: e.target.value})}
                            className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-[var(--color-text-primary)]"
                            required
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] ml-1">Period Terminal</label>
                          <input 
                            type="date"
                            value={evaluation.period_end}
                            onChange={(e) => setEvaluation({...evaluation, period_end: e.target.value})}
                            className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-[var(--color-text-primary)]"
                            required
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      {Object.entries(evaluation.scores).map(([skill, score]) => {
                        const Icon = skillIcons[skill] || Star;
                        return (
                          <div key={skill} className="p-6 rounded-3xl bg-[var(--color-surface-2)]/30 border border-[var(--color-border)] flex flex-col gap-4">
                             <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 text-[var(--color-text-primary)]">
                                  <div className="p-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                                     <Icon className="w-4 h-4 text-amber-500" />
                                  </div>
                                  {skill.replace('_', ' ')}
                                </label>
                                <span className="text-lg font-black text-amber-500 font-sora">{score}</span>
                             </div>
                             <input 
                               type="range" min="1" max="10" 
                               value={score}
                               onChange={(e) => handleScoreChange(skill, e.target.value)}
                               className="w-full accent-amber-500 bg-[var(--color-border)] h-1.5 rounded-full appearance-none cursor-pointer"
                             />
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] ml-1">Review Footnotes</label>
                      <textarea 
                        rows="5"
                        value={evaluation.comments}
                        onChange={(e) => setEvaluation({...evaluation, comments: e.target.value})}
                        placeholder="Detail the metrics achieved, technical breakthroughs, or areas requiring focus..."
                        className="w-full px-8 py-6 rounded-[2.5rem] bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-[var(--color-text-primary)] resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={submitting}
                      className="w-full py-5 rounded-[2rem] bg-[var(--color-primary)] text-white font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-[var(--color-primary)]/20 hover:translate-y-[-4px] active:scale-95 flex items-center justify-center gap-3 group"
                    >
                      {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          Finalize Matrix Review
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="h-[600px] flex flex-col items-center justify-center p-12 text-center rounded-[3.5rem] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] opacity-80 shadow-inner">
                 <div className="w-24 h-24 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center mb-8">
                    <ClipboardList className="w-10 h-10 text-[var(--color-text-muted)]" />
                 </div>
                 <h3 className="text-2xl font-bold font-sora text-[var(--color-text-primary)] mb-3">Roster Selection Required</h3>
                 <p className="text-sm text-[var(--color-text-muted)] max-w-sm leading-relaxed uppercase tracking-widest text-[10px] font-bold">
                    Select a member from the depth chart on the left to initiate a performance matrix analysis.
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
