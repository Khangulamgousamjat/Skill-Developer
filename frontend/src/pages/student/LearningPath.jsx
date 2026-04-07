import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Sparkles, Map, ChevronRight, CheckCircle2, Circle, Loader2, Plus, Target, Zap, Clock, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../api/supabase';
import { generateRoadmapData } from '../../api/RoadmapSimulator';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const TECH_TOPICS = [
  'React', 'Node.js', 'Python', 'Java', 'C++', 'TypeScript', 
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'SQL', 'MongoDB', 
  'GraphQL', 'Redux', 'Tailwind CSS', 'Next.js', 'Flutter', 
  'React Native', 'Machine Learning', 'Data Science', 
  'Cybersecurity', 'Blockchain'
];

export default function LearningPath() {
  const { t } = useLanguage();
  const { user } = useSelector(state => state.auth);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showTopicSelector, setShowTopicSelector] = useState(false);

  useEffect(() => {
    if (user) fetchRoadmaps();
  }, [user]);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoadmaps(data || []);
    } catch (err) {
      toast.error('Failed to sync learning paths');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTopic) return;
    setGenerating(true);
    try {
      const roadmapSteps = generateRoadmapData(selectedTopic);
      
      const { error } = await supabase
        .from('roadmaps')
        .insert([{
          student_id: user.id,
          topic_name: selectedTopic,
          status: 'Active',
          roadmap_json: roadmapSteps
        }]);

      if (error) throw error;
      
      toast.success(`${selectedTopic} Tactical Path Synchronized`);
      setShowTopicSelector(false);
      fetchRoadmaps();
    } catch (err) {
      toast.error('Generation failure');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Exterminate this learning path?')) return;
    try {
      const { error } = await supabase
        .from('roadmaps')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Path purged');
      fetchRoadmaps();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-12 animate-in fade-in duration-700">
        
        {/* Header Unit */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-left">
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] tracking-tight">Mission Roadmap: Learning Paths</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1.5 font-medium">Coordinate your technical synthesis via AI-generated tactical roadmaps</p>
          </div>
          <button
            onClick={() => setShowTopicSelector(true)}
            className="flex items-center gap-3 px-6 py-3.5 bg-[var(--color-primary)] text-white rounded-2xl hover:brightness-110 active:scale-95 transition-all font-bold text-sm shadow-xl shadow-[var(--color-primary)]/20"
          >
            <Plus size={20} />
            Initialize New Path
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
             <div className="w-14 h-14 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin shadow-xl" />
             <p className="text-[10px] font-black uppercase tracking-[3px] text-[var(--color-text-muted)]">Synchronizing Neural Paths...</p>
          </div>
        ) : roadmaps.length === 0 ? (
          <div className="bg-[var(--color-surface)] border-2 border-dashed border-[var(--color-border)] rounded-[48px] p-24 text-center shadow-inner group">
            <div className="w-20 h-20 bg-[var(--color-surface-2)] rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-xl">
               <Map size={32} className="text-[var(--color-primary)] opacity-40" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] font-sora mb-3">No Active Missions</h2>
            <p className="text-[var(--color-text-muted)] mb-10 max-w-sm mx-auto font-medium">
               Generate your first tactical learning roadmap to begin your professional synthesis.
            </p>
            <button
              onClick={() => setShowTopicSelector(true)}
              className="px-8 py-4 bg-white text-[var(--color-primary)] border border-[var(--color-primary)] rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-xl shadow-[var(--color-primary)]/10 active:scale-95"
            >
              Initiate Track
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {roadmaps.map((roadmap, idx) => (
              <motion.div 
                key={roadmap.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[48px] overflow-hidden shadow-sm hover:shadow-2xl hover:border-[var(--color-primary)]/20 transition-all flex flex-col group"
              >
                {/* Roadmap Header Unit */}
                <div className="p-8 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/30 flex justify-between items-center text-left">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-700 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform">
                      <Target size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[var(--color-text-primary)] font-sora leading-tight">{roadmap.topic_name}</h2>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-[var(--color-text-muted)] font-black uppercase tracking-widest opacity-60">
                         <div className="flex items-center gap-1.5"><Clock size={12}/> {new Date(roadmap.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[9px] font-black tracking-widest text-emerald-500 uppercase">
                        {roadmap.status}
                     </span>
                     <button onClick={() => handleDelete(roadmap.id)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"><X size={18}/></button>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="p-10 flex-1 bg-gradient-to-b from-transparent to-[var(--color-surface-2)]/20">
                  <div className="relative pl-10 space-y-10 before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[2px] before:bg-indigo-500/10 group-hover:before:bg-indigo-500/30 transition-colors">
                    {roadmap.roadmap_json.map((step, sIdx) => (
                      <div key={sIdx} className="relative group/step text-left">
                        <div className={`absolute -left-[45px] top-0 w-8 h-8 rounded-2xl border-4 border-[var(--color-surface)] flex items-center justify-center z-10 shadow-lg group-hover/step:scale-110 transition-transform ${
                          step.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] group-hover/step:bg-indigo-500/10 group-hover/step:text-indigo-500 border-2'
                        }`}>
                          {step.status === 'Completed' ? <CheckCircle2 size={16} /> : <Zap size={14} />}
                        </div>
                        <div className="flex items-center justify-between p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2rem] group-hover/step:border-[var(--color-primary)]/40 hover:shadow-xl transition-all cursor-pointer">
                          <div>
                            <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-[0.2em] opacity-60">Objective {step.step}</span>
                            <h3 className="font-bold text-sm text-[var(--color-text-primary)] mt-1 tracking-tight">{step.title}</h3>
                          </div>
                          <ChevronRight size={18} className="text-[var(--color-text-muted)] group-hover/step:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-8 border-t border-[var(--color-border)] flex justify-center">
                   <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 hover:text-indigo-600 group/btn transition-colors">
                      Resume Tactical Track <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* TOPIC SELECTOR MODAL - Premium Redesign */}
        <AnimatePresence>
           {showTopicSelector && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[48px] p-12 shadow-3xl text-left"
              >
                <div className="flex items-center justify-between mb-12">
                   <div>
                      <h2 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] tracking-tight">Synchronize Identity</h2>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1.5 px-0.5 opacity-60">Select specialization for AI Synthesis</p>
                   </div>
                   <button onClick={() => setShowTopicSelector(false)} className="p-4 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-[1.5rem] transition-all">
                      <X size={28} />
                   </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                  {TECH_TOPICS.map(topic => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`p-5 rounded-[1.5rem] text-xs font-bold transition-all text-center border-2 ${
                        selectedTopic === topic 
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-2xl shadow-[var(--color-primary)]/20' 
                          : 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border-transparent hover:border-[var(--color-primary)]/40 hover:bg-white'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => setShowTopicSelector(false)}
                    className="flex-1 px-6 py-4.5 bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:brightness-95 transition-all"
                  >
                    Discard Protocol
                  </button>
                  <button
                    disabled={!selectedTopic || generating}
                    onClick={handleGenerate}
                    className="flex-3 px-6 py-4.5 bg-[var(--color-primary)] text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-[var(--color-primary)]/20"
                  >
                    {generating && <Loader2 size={18} className="animate-spin" />}
                    {generating ? 'Synthesizing Path...' : 'Initiate AI Generation'}
                  </button>
                </div>
              </motion.div>
            </div>
           )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

