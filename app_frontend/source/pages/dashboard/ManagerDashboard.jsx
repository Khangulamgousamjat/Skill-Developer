import React, { useState, useEffect } from 'react';
import { Target, Users, LayoutList, Zap, ShieldAlert, Heart, Loader2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';

export const ManagerDashboard = () => {
  const { t, isDarkMode } = useAppContext();
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSentiment();
  }, []);

  const fetchSentiment = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ai/manager-team-sentiment');
      if (res.data.success) {
        setSentiment(res.data.data);
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
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Manager Hub</h2>
          <p className={t.textMuted}>Project assignment, intern evaluations, and squad tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl glare-hover transition-all ${t.card}`}>
           <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Target className="text-amber-500 w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-semibold ${t.textMain}`}>Active Projects</h3>
              <p className={`text-sm ${t.textMuted}`}>8 Tasks in Kanban</p>
            </div>
          </div>
        </div>
        <div className={`p-6 rounded-2xl glare-hover transition-all ${t.card}`}>
           <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Users className="text-blue-500 w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-semibold ${t.textMain}`}>My Squad</h3>
              <p className={`text-sm ${t.textMuted}`}>12 Active Interns</p>
            </div>
          </div>
        </div>
        <div className={`p-6 rounded-2xl glare-hover transition-all ${t.card}`}>
           <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <LayoutList className="text-emerald-500 w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-semibold ${t.textMain}`}>Pending Reviews</h3>
              <p className={`text-sm ${t.textMuted}`}>4 Ready for Feedback</p>
            </div>
          </div>
        </div>
      </div>

      {/* SQUAD VITAL MATRIX SECTION */}
      <div className={`p-8 rounded-3xl border-2 border-emerald-500/30 overflow-hidden relative shadow-2xl flex flex-col items-center justify-between text-center md:text-left md:flex-row gap-8 ${isDarkMode ? 'bg-emerald-900/10' : 'bg-emerald-50'}`}>
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full"></div>
         
         <div className="bg-emerald-600/20 p-6 rounded-3xl border border-emerald-500/30 flex-shrink-0 relative">
             {sentiment && (
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white border-2 border-emerald-900 shadow-lg">
                    {sentiment.confidence}%
                </div>
             )}
            <Heart className="w-12 h-12 text-emerald-500 animate-[pulse_2s_infinite]" />
         </div>

         <div className="flex-1">
            <h3 className={`text-2xl font-black font-sora mb-2 ${t.textMain}`}>Squad Vital Matrix <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white ml-2">EMOTIONAL INTELLIGENCE AI</span></h3>
            <p className={`${t.textMuted} mb-8 max-w-xl`}>Based on student submission notes and code review interactions, here is the current health of your squad.</p>
            
            {!sentiment ? (
                 <button 
                 onClick={fetchSentiment}
                 disabled={loading}
                 className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 mx-auto md:mx-0 group active:scale-95"
               >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Read Squad Sentiment"}
               </button>
            ) : (
                <div className="space-y-6 animate-fade-in w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-2xl border flex flex-col gap-1 transition-transform hover:-translate-y-1 ${isDarkMode ? 'bg-[var(--color-surface)]/5 border-white/5' : 'bg-[var(--color-surface)] border-emerald-100 shadow-sm'}`}>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Main Struggle</span>
                            <span className={`text-xs font-bold leading-tight ${t.textMain}`}>{sentiment.mainStruggle}</span>
                        </div>
                        <div className={`p-4 rounded-2xl border flex flex-col gap-1 transition-transform hover:-translate-y-1 ${isDarkMode ? 'bg-[var(--color-surface)]/5 border-white/5' : 'bg-[var(--color-surface)] border-emerald-100 shadow-sm'}`}>
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Squad Action Item</span>
                            <span className={`text-xs font-bold leading-tight ${t.textMain}`}>{sentiment.actionItem}</span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-xs font-black text-emerald-500/70 py-2 border-t border-emerald-500/10">
                         <ShieldAlert className="w-4 h-4" />
                         TREND: {sentiment.confidence > 70 ? "HIGH SQUAD COHESION DETECTED" : "INTERVENTION RECOMMENDED"}
                    </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

