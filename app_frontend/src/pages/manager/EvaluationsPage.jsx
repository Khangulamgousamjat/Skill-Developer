import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  ClipboardList, Star, User, Calendar, 
  CheckCircle2, Loader2, Info, ArrowRight,
  Zap, Heart, Target, Lightbulb
} from 'lucide-react';

const EvaluationsPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntern, setSelectedIntern] = useState(null);
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
            toast.success('AI Audit Complete: Scores & comments populated!');
        }
    } catch (error) {
        toast.error('AI Audit failed. Please grade manually.');
    } finally {
        setAuditing(false);
    }
  };

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/manager/team');
        if (res.data.success) {
          setTeam(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load team data');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const handleScoreChange = (skill, val) => {
    setEvaluation(prev => ({
      ...prev,
      scores: { ...prev.scores, [skill]: parseInt(val) }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIntern) return;
    
    setSubmitting(true);
    try {
      await api.post('/manager/evaluations', {
        intern_id: selectedIntern.id,
        ...evaluation
      });
      toast.success(`Evaluation for ${selectedIntern.full_name} submitted`);
      setSelectedIntern(null);
      setEvaluation({
        period_start: '',
        period_end: '',
        scores: { technical: 5, communication: 5, collaboration: 5, discipline: 5, problem_solving: 5 },
        comments: ''
      });
    } catch (err) {
      toast.error('Failed to submit evaluation');
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
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Performance Evaluations</h2>
        <p className={t.textMuted}>Assess and provide feedback on your team's weekly performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Intern List */}
        <div className="lg:col-span-1 space-y-4">
           {loading ? (
             <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-amber-500" /></div>
           ) : team.map(intern => (
             <button
               key={intern.id}
               onClick={() => setSelectedIntern(intern)}
               className={`w-full p-4 rounded-3xl border text-left transition-all ${
                 selectedIntern?.id === intern.id 
                 ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/20' 
                 : `${t.card} hover:scale-[1.02]`
               }`}
             >
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800">
                    <img 
                      src={intern.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${intern.email}`} 
                      alt=""
                    />
                  </div>
                  <div>
                    <h4 className={`font-bold ${t.textMain}`}>{intern.full_name}</h4>
                    <span className={`text-[10px] font-bold uppercase ${t.textMuted}`}>{intern.employee_id || 'ID UNSET'}</span>
                  </div>
               </div>
             </button>
           ))}
        </div>

        {/* Evaluation Form */}
        <div className="lg:col-span-2">
          {selectedIntern ? (
            <div className={`p-8 rounded-[40px] border shadow-2xl relative overflow-hidden group ${t.card}`}>
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                   <div>
                      <h3 className={`text-xl font-bold mb-1 ${t.textMain}`}>Evaluating {selectedIntern.full_name}</h3>
                      <p className={`text-sm ${t.textMuted}`}>Fill out the scores based on recent performance.</p>
                   </div>
                   <div className="flex items-center gap-3">
                      {selectedIntern && (
                        <button 
                          type="button"
                          onClick={handleAIAudit}
                          disabled={auditing}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-[10px] font-bold uppercase transition-all hover:bg-indigo-400 active:scale-95 disabled:opacity-50"
                        >
                           {auditing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                           {auditing ? "Auditing History..." : "Smart AI Audit"}
                        </button>
                      )}
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold uppercase">
                        <Star className="w-3 h-3 fill-white" />
                        Rating Mode
                      </div>
                   </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${t.textMuted}`}>Period Start</label>
                        <input 
                          type="date"
                          value={evaluation.period_start}
                          onChange={(e) => setEvaluation({...evaluation, period_start: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border outline-none ${t.input}`}
                          required
                        />
                     </div>
                     <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${t.textMuted}`}>Period End</label>
                        <input 
                          type="date"
                          value={evaluation.period_end}
                          onChange={(e) => setEvaluation({...evaluation, period_end: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border outline-none ${t.input}`}
                          required
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(evaluation.scores).map(([skill, score]) => {
                      const Icon = skillIcons[skill] || Star;
                      return (
                        <div key={skill} className="space-y-2">
                           <div className="flex justify-between items-center">
                              <label className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${t.textMain}`}>
                                <Icon className="w-3.5 h-3.5 text-amber-500" />
                                {skill.replace('_', ' ')}
                              </label>
                              <span className="text-xs font-black text-amber-500">{score}/10</span>
                           </div>
                           <input 
                             type="range" min="1" max="10" 
                             value={score}
                             onChange={(e) => handleScoreChange(skill, e.target.value)}
                             className="w-full accent-amber-500 bg-white/5 h-1.5 rounded-full appearance-none "
                           />
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${t.textMuted}`}>Comments</label>
                    <textarea 
                      rows="4"
                      value={evaluation.comments}
                      onChange={(e) => setEvaluation({...evaluation, comments: e.target.value})}
                      placeholder="Specific areas of improvement or praise..."
                      className={`w-full px-4 py-3 rounded-xl border outline-none text-sm resize-none ${t.input}`}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-400 text-white font-bold transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 group"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Complete Evaluation
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className={`h-[400px] flex flex-col items-center justify-center p-10 text-center rounded-[40px] border-2 border-dashed ${isDarkMode ? 'border-white/5' : 'border-gray-100'} ${t.card}`}>
               <Info className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-slate-700' : 'text-gray-200'}`} />
               <h3 className={`text-lg font-bold mb-2 ${t.textMain}`}>No Intern Selected</h3>
               <p className={`text-sm max-w-xs ${t.textMuted}`}>Please select an intern from your team on the left to start a performance review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationsPage;
