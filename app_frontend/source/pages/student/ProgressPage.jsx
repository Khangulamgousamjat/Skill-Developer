import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { skillGaps, activeProjects } from '../../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, Award, Loader2, Copy, Check } from 'lucide-react';

const weeklyData = [
  { week: 'W1', skill: 38, project: 55, attendance: 80 },
  { week: 'W2', skill: 45, project: 60, attendance: 75 },
  { week: 'W3', skill: 52, project: 72, attendance: 90 },
  { week: 'W4', skill: 65, project: 85, attendance: 92 },
];

const StatCard = ({ label, value, color, t }) => (
  <div className={`p-5 rounded-2xl ${t.card}`}>
    <div className="text-3xl font-black mb-1" style={{ color }}>{value}</div>
    <div className={`text-sm ${t.textMuted}`}>{label}</div>
  </div>
);

const ProgressPage = () => {
  const { t, isDarkMode, progressSummary, handleProgressSummary } = useAppContext();

  const avgSkill = Math.round(skillGaps.reduce((a, s) => a + s.current, 0) / skillGaps.length);
  const projectScore = Math.round(activeProjects.reduce((a, p) => a + (p.progress || 0), 0) / activeProjects.length);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Progress Tracking</h2>
          <p className={t.textMuted}>Your weekly performance across skills, projects, and attendance.</p>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Avg Skill Level"     value={`${avgSkill}%`}  color="#F4A100" t={t} />
        <StatCard label="Project Performance" value={`${projectScore}%`} color="#3B82F6" t={t} />
        <StatCard label="Lecture Attendance"  value="85%"             color="#22C55E" t={t} />
        <StatCard label="Overall Score"       value="78%"             color="#8B5CF6" t={t} />
      </div>

      {/* Weekly Chart */}
      <div className={`p-6 rounded-2xl ${t.card}`}>
        <h3 className={`font-semibold mb-5 flex items-center gap-2 ${t.textMain}`}>
          <TrendingUp className="w-5 h-5" style={{ color: '#F4A100' }} />
          Weekly Performance Trend
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.06)' : '#f0f0f0'} />
            <XAxis dataKey="week" tick={{ fill: isDarkMode ? '#94a3b8' : '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: isDarkMode ? '#94a3b8' : '#6b7280', fontSize: 12 }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: isDarkMode ? '#1e293b' : '#fff',
                border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                borderRadius: '12px',
                color: isDarkMode ? '#f1f5f9' : '#0f172a',
              }}
              formatter={(v, name) => [`${v}%`, name.charAt(0).toUpperCase() + name.slice(1)]}
            />
            <Bar dataKey="skill"      fill="#F4A100" radius={[6, 6, 0, 0]} maxBarSize={24} name="Skill" />
            <Bar dataKey="project"    fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={24} name="Project" />
            <Bar dataKey="attendance" fill="#22C55E" radius={[6, 6, 0, 0]} maxBarSize={24} name="Attendance" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-2">
          {[ ['#F4A100', 'Skill'], ['#3B82F6', 'Project'], ['#22C55E', 'Attendance'] ].map(([color, label]) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* AI Progress Summary */}
      <div className={`p-6 rounded-2xl ${t.card}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold flex items-center gap-2 ${t.textMain}`}>
            <Award className="w-5 h-5 text-purple-400" />
            AI Progress Summary
          </h3>
          <button
            onClick={handleProgressSummary}
            disabled={progressSummary.loading}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-50"
            style={{ background: '#F4A100', color: '#0F172A' }}
          >
            {progressSummary.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : '✨'}
            {progressSummary.text ? 'Regenerate' : 'Generate Summary'}
          </button>
        </div>

        {progressSummary.loading ? (
          <div className={`flex items-center gap-3 p-4 rounded-xl text-sm ${isDarkMode ? 'bg-[var(--color-surface)]/5 text-slate-400' : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'}`}>
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            Generating your AI progress review…
          </div>
        ) : progressSummary.text ? (
          <div className={`p-4 rounded-xl text-sm leading-relaxed ${
            isDarkMode ? 'bg-purple-500/5 text-purple-100 border border-purple-500/10' : 'bg-purple-50 text-purple-800 border border-purple-100'
          }`}>
            {progressSummary.text}
          </div>
        ) : (
          <p className={`text-sm ${t.textMuted}`}>
            Click "Generate Summary" to get an AI-written performance review based on your current data.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;

