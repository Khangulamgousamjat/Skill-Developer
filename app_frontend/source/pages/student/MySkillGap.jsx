import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Target, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

export default function MySkillGap() {
  const { t } = useLanguage();
  const [skillData, setSkillData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/student/skills');
      setSkillData(res.data.data || []);
    } catch (err) {
      toast.error(t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (current, required) => {
    if (current >= required) return 'text-green-500';
    if (required - current <= 20) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">
            {t('mySkillGap')}
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            {t('skillGapDescription') || "Identify and bridge your skill gaps with AI recommendations"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Card */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6 font-sora flex items-center gap-2">
              <TrendingUp size={20} className="text-[var(--color-primary)]" />
              {t('visualization') || "Skill Visualization"}
            </h2>
            
            <div className="h-[350px] w-full">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin" />
                </div>
              ) : skillData.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                   <Target size={40} className="mb-2 opacity-20" />
                   <p>{t('noData')}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis 
                      dataKey="name" 
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--color-surface)', 
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                        borderRadius: '12px'
                      }}
                    />
                    <Radar
                      name={t('currentLevel') || "Current Level"}
                      dataKey="current"
                      stroke="var(--color-primary)"
                      fill="var(--color-primary)"
                      fillOpacity={0.5}
                    />
                    <Radar
                      name={t('requiredLevel') || "Required Level"}
                      dataKey="required"
                      stroke="var(--color-accent)"
                      fill="var(--color-accent)"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <div className="flex justify-center gap-6 mt-4 text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[var(--color-primary)] opacity-50 rounded" />
                <span className="text-[var(--color-text-secondary)]">{t('currentLevel') || "Current"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[var(--color-accent)] opacity-30 rounded" />
                <span className="text-[var(--color-text-secondary)]">{t('requiredLevel') || "Required"}</span>
              </div>
            </div>
          </div>

          {/* Analysis Card */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6 font-sora flex items-center gap-2">
              <AlertCircle size={20} className="text-[var(--color-danger)]" />
              {t('gapAnalysis') || "Gap Analysis"}
            </h2>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-16 bg-[var(--color-surface-2)] animate-pulse rounded-xl" />)
              ) : skillData.length === 0 ? (
                <p className="text-[var(--color-text-muted)] text-center py-10">{t('noData')}</p>
              ) : (
                skillData.map((skill, idx) => {
                  const gap = skill.required - skill.current;
                  return (
                    <div key={idx} className="p-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl group hover:border-[var(--color-primary)] transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">{skill.name}</h3>
                          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">{skill.levelRaw}</p>
                        </div>
                        {gap <= 0 ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(skill.current, skill.required)} bg-black/10`}>
                            -{gap}% Gap
                          </span>
                        )}
                      </div>
                      <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[var(--color-primary)] transition-all duration-1000" 
                          style={{ width: `${skill.current}%` }}
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
    </DashboardLayout>
  );
}

