import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Sparkles, Map, ChevronRight, CheckCircle2, Circle, Loader2, Plus } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

const TECH_TOPICS = [
  'React', 'Node.js', 'Python', 'Java', 'C++', 'TypeScript', 
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'SQL', 'MongoDB', 
  'GraphQL', 'Redux', 'Tailwind CSS', 'Next.js', 'Flutter', 
  'React Native', 'Machine Learning', 'Data Science', 
  'Cybersecurity', 'Blockchain'
];

export default function LearningPath() {
  const { t } = useLanguage();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showTopicSelector, setShowTopicSelector] = useState(false);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/student/roadmaps');
      setRoadmaps(res.data.data || []);
    } catch (err) {
      toast.error(t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTopic) return;
    setGenerating(true);
    try {
      await axiosInstance.post('/student/roadmaps', { topic: selectedTopic });
      toast.success(t('generateRoadmap'));
      setShowTopicSelector(false);
      fetchRoadmaps();
    } catch (err) {
      toast.error(t('somethingWentWrong'));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">
              {t('learningRoadmap')}
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
              {t('learningPathDescription') || "AI-powered personalized learning journeys"}
            </p>
          </div>
          <button
            onClick={() => setShowTopicSelector(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-all font-medium text-sm shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            {t('generateRoadmap')}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
          </div>
        ) : roadmaps.length === 0 ? (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-12 text-center">
            <Sparkles size={48} className="mx-auto mb-4 text-[var(--color-accent)] opacity-50" />
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] font-sora mb-2">{t('noData')}</h2>
            <p className="text-[var(--color-text-muted)] mb-6 max-w-sm mx-auto">
              {t('noRoadmapsYet') || "Generate your first AI learning roadmap to start your journey."}
            </p>
            <button
              onClick={() => setShowTopicSelector(true)}
              className="px-6 py-3 bg-[var(--color-surface-2)] text-[var(--color-primary)] border border-[var(--color-primary)] rounded-xl font-bold hover:bg-[var(--color-primary)] hover:text-white transition-all"
            >
              {t('generateRoadmap')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {roadmaps.map((roadmap) => (
              <div key={roadmap.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface-2)]/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center text-white">
                      <Map size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[var(--color-text-primary)] font-sora">{roadmap.topic_name}</h2>
                      <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">
                        {new Date(roadmap.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-black/10 rounded-full text-xs font-bold text-[var(--color-text-primary)]">
                    {roadmap.status}
                  </span>
                </div>
                <div className="p-6">
                  <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--color-border)]">
                    {roadmap.roadmap_json.map((step, idx) => (
                      <div key={idx} className="relative group">
                        <div className={`absolute -left-[37px] top-0 w-6 h-6 rounded-full border-2 border-[var(--color-surface)] flex items-center justify-center z-10 ${
                          step.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'
                        }`}>
                          {step.status === 'Completed' ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                        </div>
                        <div className="flex items-center justify-between p-4 bg-[var(--color-surface-2)] rounded-xl group-hover:border-[var(--color-primary)] border border-transparent transition-all">
                          <div>
                            <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">Step {step.step}</span>
                            <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">{step.title}</h3>
                          </div>
                          <ChevronRight size={16} className="text-[var(--color-text-muted)]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Topic Selector Modal */}
        {showTopicSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] w-full max-w-2xl rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)] mb-6">{t('selectTopic')}</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {TECH_TOPICS.map(topic => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all text-left border ${
                      selectedTopic === topic 
                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' 
                        : 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)]'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
                <button
                  onClick={() => setShowTopicSelector(false)}
                  className="flex-1 px-4 py-3 bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-xl font-bold hover:bg-opacity-80 transition-all"
                >
                  {t('logout') || "Cancel"} {/* Cancel key placeholder */}
                </button>
                <button
                  disabled={!selectedTopic || generating}
                  onClick={handleGenerate}
                  className="flex-1 px-4 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generating && <Loader2 size={18} className="animate-spin" />}
                  {t('generateRoadmap')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

