import React, { useState, useEffect } from 'react';
import { BookOpen, MessageSquare, UploadCloud, Zap, Target, Loader2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';

export const TeacherDashboard = () => {
  const { t, isDarkMode } = useAppContext();
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdvice();
  }, []);

  const fetchAdvice = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ai/Teacher-lecture-advice');
      if (res.data.success) {
        setAdvice(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Teacher Studio</h2>
          <p className={t.textMuted}>Manage your lectures, resources, and intern Q&A sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Row 1 cards... */}
        <div className={`p-6 rounded-2xl glare-hover transition-all ${t.card}`}>
           <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                 <BookOpen className="text-blue-500 w-6 h-6" />
              </div>
              <div>
                 <h3 className={`font-semibold ${t.textMain}`}>My Lectures</h3>
                 <p className={`text-sm ${t.textMuted}`}>12 Sessions Scheduled</p>
              </div>
           </div>
        </div>
        <div className={`p-6 rounded-2xl glare-hover transition-all ${t.card}`}>
           <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                 <UploadCloud className="text-emerald-500 w-6 h-6" />
              </div>
              <div>
                 <h3 className={`font-semibold ${t.textMain}`}>Resource Library</h3>
                 <p className={`text-sm ${t.textMuted}`}>45 Uploaded Files</p>
              </div>
           </div>
        </div>
        <div className={`p-6 rounded-2xl glare-hover transition-all ${t.card}`}>
           <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                 <MessageSquare className="text-amber-500 w-6 h-6" />
              </div>
              <div>
                 <h3 className={`font-semibold ${t.textMain}`}>Q&A Vault</h3>
                 <p className={`text-sm ${t.textMuted}`}>3 Pending Doubts</p>
              </div>
           </div>
        </div>
      </div>

      {/* AI CURRICULUM ARCHITECT SECTION */}
      <div className={`p-8 rounded-3xl border-2 border-blue-500/30 overflow-hidden relative shadow-2xl flex flex-col items-center justify-between text-center md:text-left md:flex-row gap-8 ${isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50'}`}>
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full"></div>
         
         <div className="bg-blue-600/20 p-6 rounded-3xl border border-blue-500/30 flex-shrink-0">
            <Zap className="w-12 h-12 text-blue-500 animate-pulse" />
         </div>

         <div className="flex-1">
            <h3 className={`text-2xl font-black font-sora mb-2 ${t.textMain}`}>AI Curriculum Architect <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white ml-2">DATA-DRIVEN SUGGESTIONS</span></h3>
            <p className={`${t.textMuted} mb-8 max-w-xl`}>Our AI has analyzed the real-time skill gaps across your department. These topics are currently the most needed by your students.</p>
            
            {!advice ? (
                 <button 
                 onClick={fetchAdvice}
                 disabled={loading}
                 className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 mx-auto md:mx-0 group active:scale-95"
               >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Extract Insight Metrics"}
               </button>
            ) : (
                <div className="space-y-4 animate-fade-in w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {advice.suggestions.map((topic, i) => (
                            <div key={i} className={`p-4 rounded-2xl border flex items-center gap-3 transition-transform hover:-translate-y-1 ${isDarkMode ? 'bg-[var(--color-surface)]/5 border-white/5' : 'bg-[var(--color-surface)] border-blue-100 shadow-sm'}`}>
                                <Target className="w-5 h-5 text-blue-500" />
                                <span className={`text-xs font-bold leading-tight ${t.textMain}`}>{topic}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 rounded-2xl bg-blue-300/10 border border-blue-500/20 flex items-center gap-3">
                         <Zap className="w-5 h-5 text-blue-400 shrink-0" />
                         <p className="text-sm font-semibold text-blue-400 leading-relaxed italic">
                             "{advice.tutorTip}"
                         </p>
                    </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

