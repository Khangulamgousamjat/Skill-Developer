import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, BookOpen, Clock, ChevronRight, CheckCircle2, Trophy, Star, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

const LANGUAGE_OPTS = [
  { id: 'en', name: 'English', icon: '🇬🇧' },
  { id: 'hi', name: 'Hindi', icon: '🇮🇳' },
  { id: 'mr', name: 'Marathi', icon: '🇮🇳' },
  { id: 'fr', name: 'French', icon: '🇫🇷' },
  { id: 'ru', name: 'Russian', icon: '🇷🇺' }
];

const ROADMAPS = {
  en: { name: 'English' },
  hi: { name: 'Hindi' },
  mr: { name: 'Marathi' },
  fr: { name: 'French' },
  ru: { name: 'Russian' }
};

export default function LanguageSection() {
  const { t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState('en');
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/student/roadmaps');
      if (res.data.success) {
        setRoadmaps(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (topic) => {
    setGenerating(true);
    try {
      const res = await axiosInstance.post('/student/roadmaps', { topic });
      if (res.data.success) {
        setRoadmaps(prev => [res.data.data, ...prev]);
        toast.success(`Roadmap for ${topic} generated!`);
      }
    } catch (err) {
      toast.error('Failed to generate roadmap');
    } finally {
      setGenerating(false);
    }
  };

  const currentRoadmap = roadmaps.find(r => r.topic_name.toLowerCase() === selectedLang.toLowerCase() || r.topic_name === LANGUAGE_OPTS.find(o => o.id === selectedLang)?.name);
  const roadmapData = currentRoadmap ? JSON.parse(currentRoadmap.roadmap_json) : null;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">{t('languageLearning')}</h1>
            <p className="text-[var(--color-text-muted)] mt-1">Master new languages with AI-powered roadmaps.</p>
          </div>
          <div className="flex items-center gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] p-2 rounded-2xl shadow-sm">
             <Trophy className="text-[var(--color-accent)]" size={24} />
             <div>
                <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-tighter">Your Level</p>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">Polyglot Initiate</p>
             </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
           {LANGUAGE_OPTS.map((lang) => {
             const hasRoadmap = roadmaps.some(r => r.topic_name.toLowerCase() === lang.id || r.topic_name === lang.name);
             return (
               <button 
                 key={lang.id}
                 onClick={() => setSelectedLang(lang.id)}
                 className={`p-4 rounded-3xl border transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${
                   selectedLang === lang.id 
                   ? 'bg-[var(--color-primary)] border-blue-400 text-white shadow-xl scale-[1.02]' 
                   : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                 }`}
               >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${
                    selectedLang === lang.id ? 'bg-white/20' : 'bg-[var(--color-surface-2)] group-hover:scale-110'
                  }`}>
                     {lang.icon}
                  </div>
                  <div className="text-center">
                     <p className="font-bold text-sm tracking-tight">{lang.name}</p>
                     <p className={`text-[9px] uppercase font-bold tracking-widest ${selectedLang === lang.id ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}>
                       {hasRoadmap ? 'Active' : 'Not Started'}
                     </p>
                  </div>
               </button>
             );
           })}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Roadmap */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-2xl">
                       <BookOpen size={24} />
                    </div>
                    <div>
                       <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{ROADMAPS[selectedLang].name} Roadmap</h2>
                       <p className="text-sm text-[var(--color-text-muted)]">Sequential path to professional proficiency</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    {loading ? (
                       <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div>
                    ) : roadmapData ? (
                      roadmapData.map((m, idx) => (
                        <div key={idx} className="flex items-center gap-4 group">
                           <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                m.status === 'Completed' ? 'bg-[var(--color-success)]/10 border-[var(--color-success)] text-[var(--color-success)]' :
                                m.status === 'In Progress' ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)] animate-pulse' :
                                'bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-muted)]'
                              }`}>
                                 {m.status === 'Completed' ? <CheckCircle2 size={18}/> : idx + 1}
                              </div>
                              {idx < roadmapData.length - 1 && (
                                <div className="w-0.5 h-12 bg-[var(--color-border)]" />
                              )}
                           </div>
                           <div className={`flex-1 p-5 rounded-3xl border transition-all ${
                             m.status === 'Locked' ? 'opacity-50 grayscale' : 'hover:border-[var(--color-primary)] hover:shadow-lg'
                           } ${m.status === 'In Progress' ? 'bg-[var(--color-surface-2)] border-[var(--color-primary)]/30' : 'bg-[var(--color-surface)] border-[var(--color-border)]'}`}>
                              <div className="flex justify-between items-center">
                                 <div>
                                    <h4 className="font-bold text-[var(--color-text-primary)]">{m.title}</h4>
                                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase mt-0.5 flex items-center gap-1">
                                       <Clock size={10} /> 4-6 Hours • Professional Focus
                                    </p>
                                 </div>
                                 <ChevronRight size={18} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-all" />
                              </div>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[var(--color-border)] rounded-3xl">
                         <Star size={48} className="text-[var(--color-accent)] opacity-20 mb-4" />
                         <h3 className="font-bold text-[var(--color-text-primary)]">{LANGUAGE_OPTS.find(o => o.id === selectedLang)?.name} Roadmap</h3>
                         <p className="text-sm text-[var(--color-text-muted)] max-w-xs mt-2 mb-6">Master the language for your department. Start your journey now!</p>
                         <button 
                            onClick={() => handleGenerate(LANGUAGE_OPTS.find(o => o.id === selectedLang)?.name)}
                            disabled={generating}
                            className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                         >
                            {generating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                            Generate Roadmap
                         </button>
                      </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Sidebar Info */}
           <div className="space-y-6">
              <div className="bg-gradient-to-br from-[var(--color-primary)] to-blue-700 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700" />
                 <h3 className="text-xl font-bold font-sora mb-2">AI Practice</h3>
                 <p className="text-sm text-white/80 leading-relaxed mb-6">Need someone to speak with? Use our AI Voice Assistant to practice your {ROADMAPS[selectedLang].name} skills.</p>
                 <button className="w-full bg-white text-[var(--color-primary)] font-bold py-4 rounded-2xl hover:shadow-xl active:scale-95 transition-all">
                    Start Voice Chat
                 </button>
              </div>

              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-[2.5rem] shadow-xl">
                 <h4 className="font-bold text-[var(--color-text-primary)] mb-4">Statistics</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-[var(--color-surface-2)] rounded-2xl">
                       <span className="text-xs text-[var(--color-text-muted)]">Active Days</span>
                       <span className="font-bold text-[var(--color-text-primary)]">12</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[var(--color-surface-2)] rounded-2xl">
                       <span className="text-xs text-[var(--color-text-muted)]">Vocabulary</span>
                       <span className="font-bold text-[var(--color-text-primary)]">1,240</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
