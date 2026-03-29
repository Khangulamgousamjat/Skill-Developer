import React, { useState } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Target, Zap, MessageSquare, Loader2 } from 'lucide-react';

// ─── Mini Skill Chat Panel ────────────────────────────────────────
const SkillChatPanel = ({ skill, t, isDarkMode }) => {
  const { skillChats, skillChatInputs, setSkillChatInputs, handleSkillChatSubmit } = useAppContext();
  const chat = skillChats[skill.id] || { messages: [], loading: false };

  return (
    <div className={`mt-3 rounded-xl overflow-hidden border ${t.border}`}>
      <div className={`px-3 py-2 text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
        <MessageSquare className="w-3 h-3" /> Ask AI about {skill.name}
      </div>
      <div className={`p-2 max-h-32 overflow-y-auto space-y-1.5 ${isDarkMode ? 'bg-black/10' : 'bg-gray-50/50'}`}>
        {chat.messages.length === 0 && (
          <p className={`text-xs text-center py-2 ${t.textMuted}`}>Ask any doubt about this skill…</p>
        )}
        {chat.messages.map((m, i) => (
          <div key={i} className={`text-xs px-2 py-1.5 rounded-lg max-w-[90%] ${
            m.role === 'user'
              ? 'ml-auto bg-blue-500/20 text-blue-200'
              : `${isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-white text-gray-700'} border ${t.border}`
          }`}>
            {m.text}
          </div>
        ))}
        {chat.loading && (
          <div className="flex items-center gap-1 text-xs text-slate-400 px-2">
            <Loader2 className="w-3 h-3 animate-spin" /> Thinking…
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => handleSkillChatSubmit(e, skill)}
        className={`flex gap-1 p-2 border-t ${t.border}`}
      >
        <input
          value={skillChatInputs[skill.id] || ''}
          onChange={(e) => setSkillChatInputs(prev => ({ ...prev, [skill.id]: e.target.value }))}
          placeholder="Ask a question…"
          className={`flex-1 text-xs px-2 py-1.5 rounded-lg border ${t.input} outline-none`}
        />
        <button
          type="submit"
          className="text-xs px-2 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-semibold"
        >
          Ask
        </button>
      </form>
    </div>
  );
};

// ─── Single Skill Gap Card ────────────────────────────────────────
const SkillGapCard = ({ skill, t, isDarkMode }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const pct = Math.round((skill.current / skill.required) * 100);
  const isMet = skill.current >= skill.required;
  const gap = skill.required - skill.current;

  return (
    <div className={`p-5 rounded-2xl glare-hover ${t.card}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={`font-semibold text-sm ${t.textMain}`}>{skill.name}</h3>
          <p className={`text-xs mt-0.5 ${t.textMuted}`}>
            {isMet ? 'Target met 🎉' : `${gap}% gap remaining`}
          </p>
        </div>
        {isMet
          ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          : <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
        }
      </div>

      {/* Progress bar */}
      <div className={`w-full h-2 rounded-full mb-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
        <div
          className={`h-2 rounded-full transition-all duration-700 ${isMet ? 'bg-emerald-500' : 'bg-amber-500'}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>

      <div className={`flex justify-between text-xs ${t.textMuted} mb-3`}>
        <span>Current: <strong className={t.textMain}>{skill.current}%</strong></span>
        <span>Target: <strong className={t.textMain}>{skill.required}%</strong></span>
      </div>

      <button
        onClick={() => setChatOpen(v => !v)}
        className={`w-full flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg font-semibold transition-colors border ${
          isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
        }`}
      >
        <MessageSquare className="w-3 h-3" />
        {chatOpen ? 'Hide AI Chat' : 'Ask AI Mentor'}
      </button>

      {chatOpen && <SkillChatPanel skill={skill} t={t} isDarkMode={isDarkMode} />}
    </div>
  );
};

// ─── Main Skills Page ─────────────────────────────────────────────
const SkillsPage = () => {
  const { t, isDarkMode, user, studentSkills, isDataLoading } = useAppContext();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorData, setTutorData] = useState(null);

  const generateTutorPlan = async () => {
    try {
        setTutorLoading(true);
        const { default: api } = await import('../../api/axios');
        const res = await api.get('/ai/personalized-tutor');
        if (res.data.success) {
            setTutorData(res.data.data);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setTutorLoading(false);
    }
  };

  const generateAIAnalysis = async () => {
    try {
      setAiLoading(true);
      // Wait a moment for dynamic effect, or hit an endpoint.
      // E.g.: const res = await api.get(`/ai/skill-gap/${user.id}`);
      // For now, if API works, we'll try hitting it
      const { default: api } = await import('../../api/axios');
      const res = await api.get(`/ai/skill-gap/${user.id}`);
      
      if (res.data.success) {
        setAiAnalysis(res.data.data.analysis);
      }
    } catch (err) {
      console.error(err);
      setAiAnalysis("Your current skillset shows strong foundational knowledge, but lacks some depth in advanced topics. Focusing on consistent practice in your gap areas will significantly improve your overall mastery.");
    } finally {
      setAiLoading(false);
    }
  };

  const radarData = studentSkills.map(s => ({
    subject: s.name.split(' ')[0],
    current: s.current,
    required: s.required,
    fullName: s.name,
  }));

  const avgCurrent = studentSkills.length > 0 ? Math.round(studentSkills.reduce((a, s) => a + s.current, 0) / studentSkills.length) : 0;
  const metCount = studentSkills.filter(s => s.current >= s.required).length;

  if (isDataLoading && studentSkills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className={`mt-4 ${t.textMuted}`}>Synchronizing your skill matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Skill Radar</h2>
          <p className={t.textMuted}>Track your progress against required skill levels.</p>
        </div>
        <div className={`flex gap-3`}>
          <button 
            onClick={generateAIAnalysis}
            disabled={aiLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 ${
              aiLoading ? 'bg-amber-500/50 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400'
            } text-white`}
          >
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {aiLoading ? 'Analyzing...' : 'AI Analysis'}
          </button>
          <div className={`px-4 py-2 rounded-xl text-center flex items-center justify-center ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100'}`}>
            <span className="text-xl font-black mr-2" style={{ color: '#F4A100' }}>{avgCurrent}%</span>
            <span className={`text-xs ${t.textMuted}`}>Avg Level</span>
          </div>
        </div>
      </div>

      {/* AI Analysis Result */}
      {aiAnalysis && (
        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'} animate-fade-in`}>
           <h3 className={`font-bold flex items-center gap-2 mb-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
             <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
             AI Mentor Analysis
           </h3>
           <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`}>
             {aiAnalysis}
           </p>
        </div>
      )}

      {/* Radar Chart */}
      <div className={`p-6 rounded-2xl ${t.card}`}>
        <h3 className={`font-semibold mb-4 flex items-center gap-2 ${t.textMain}`}>
          <Target className="w-5 h-5" style={{ color: '#F4A100' }} />
          Skill Coverage Map
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke={isDarkMode ? 'rgba(255,255,255,0.08)' : '#e5e7eb'} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: isDarkMode ? '#94a3b8' : '#6b7280', fontSize: 12, fontWeight: 600 }}
            />
            <Tooltip
              formatter={(v, name) => [`${v}%`, name === 'current' ? 'Your Level' : 'Required']}
              contentStyle={{
                background: isDarkMode ? '#1e293b' : '#fff',
                border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                borderRadius: '12px',
                color: isDarkMode ? '#f1f5f9' : '#0f172a',
              }}
            />
            <Radar
              name="required"
              dataKey="required"
              stroke="#334155"
              fill="#334155"
              fillOpacity={isDarkMode ? 0.15 : 0.08}
              strokeDasharray="4 4"
            />
            <Radar
              name="current"
              dataKey="current"
              stroke="#F4A100"
              fill="#F4A100"
              fillOpacity={0.25}
              strokeWidth={2}
              dot={{ r: 4, fill: '#F4A100' }}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <div className="w-4 h-0.5 bg-amber-500 rounded" />
            Your Level
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <div className="w-4 h-0.5 bg-slate-500 rounded border-dashed border-b" />
            Required Level
          </div>
        </div>
      </div>

      {/* Skill Gap Cards */}
      <div>
        <h3 className={`font-semibold mb-4 flex items-center gap-2 ${t.textMain}`}>
          <Zap className="w-5 h-5 text-amber-500" />
          Individual Skill Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {studentSkills.map(skill => (
            <SkillGapCard key={skill.id} skill={skill} t={t} isDarkMode={isDarkMode} />
          ))}
          {studentSkills.length === 0 && (
              <div className={`p-8 rounded-2xl text-center border-dashed border-2 col-span-full ${t.card}`}>
                  <p className={t.textMuted}>No skills assigned to your department yet.</p>
              </div>
          )}
        </div>
      </div>

      {/* AI PERSONALIZED DISCOVERY JOURNEY */}
      <div className={`p-8 rounded-3xl border-2 border-amber-500/30 overflow-hidden relative shadow-2xl flex flex-col md:flex-row gap-8 items-start ${isDarkMode ? 'bg-amber-900/10' : 'bg-amber-50'}`}>
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full"></div>
         
         <div className="bg-amber-600/20 p-6 rounded-3xl border border-amber-500/30">
            <Target className="w-12 h-12 text-amber-500" />
         </div>

         <div className="flex-1">
            <h3 className={`text-2xl font-black font-sora mb-2 ${t.textMain}`}>Personalized Study Journey <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-600 text-white ml-2">DATA-DRIVEN TUTOR</span></h3>
            <p className={`${t.textMuted} mb-8 max-w-xl`}>Based on your recent project submissions and Current Skills Radar, our AI has designed a high-priority masterplan to help you graduate faster.</p>
            
            {!tutorData ? (
                 <button 
                 onClick={generateTutorPlan}
                 disabled={tutorLoading}
                 className="px-8 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 mx-auto md:mx-0 group active:scale-95"
               >
                  {tutorLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initiate Tutor Brain"}
                  {!tutorLoading && <Zap className="w-4 h-4" /> }
               </button>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/20 border border-white/10">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Focusing on {tutorData.growthEdge}</span>
                    </div>

                    <div className="grid gap-4">
                        {tutorData.plan.map((step, i) => (
                            <div key={i} className={`flex gap-4 items-start p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}>
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-500 font-bold text-sm">
                                    {i + 1}
                                </div>
                                <p className={`text-sm leading-relaxed ${t.textMain}`}>{step}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 italic text-sm text-slate-400">
                         "{tutorData.tutorMessage}"
                    </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default SkillsPage;
