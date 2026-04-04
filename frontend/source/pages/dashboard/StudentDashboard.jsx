import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import Skeleton from '../../components/ui/Skeleton';

const velocityData = [
  { name: 'Week 1', score: 45 },
  { name: 'Week 2', score: 52 },
  { name: 'Week 3', score: 48 },
  { name: 'Week 4', score: 61 },
  { name: 'Week 5', score: 55 },
  { name: 'Week 6', score: 67 },
  { name: 'Week 7', score: 75 },
];

const StudentDashboardSkeleton = () => {
    const { t } = useAppContext();
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex justify-between items-center mb-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>
            <Skeleton className="h-40 w-full rounded-[40px]" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[32px]" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-64 rounded-[40px]" />
                <Skeleton className="h-64 rounded-[40px]" />
            </div>
        </div>
    );
};

export const StudentDashboard = () => {
  const { t, isDarkMode, studentOverview, studentSkills, isDataLoading, setActiveTab } = useAppContext();

  const avgSkill = studentSkills.length > 0 
    ? Math.round(studentSkills.reduce((a, s) => a + s.current, 0) / studentSkills.length) 
    : 0;

  if (isDataLoading && !studentOverview.xp) {
    return <StudentDashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Welcome Back!</h2>
          <p className={t.textMuted}>Here is a quick look at your progress in Gous org.</p>
        </div>
      </div>

      {/* Level & XP Progress Section */}
      <div className={`p-8 rounded-[40px] border relative overflow-hidden group ${t.card}`}>
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
            <Zap className="w-48 h-48 text-amber-500" />
         </div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-24 h-24 shrink-0">
               <svg className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" 
                     className="text-amber-500" strokeDasharray={276} strokeDashoffset={276 - (276 * (studentOverview.levelProgress || 0)) / 100} strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${t.textMuted}`}>Level</span>
                  <span className={`text-3xl font-black ${t.textMain}`}>{studentOverview.level || 1}</span>
               </div>
            </div>

            <div className="flex-1 space-y-3 w-full">
               <div className="flex justify-between items-end">
                  <div>
                    <h3 className={`text-2xl font-bold font-sora ${t.textMain}`}>Your Career Journey</h3>
                    <p className={`text-sm ${t.textMuted}`}>{studentOverview.xp} Total XP earned across modules</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Next Level: {studentOverview.xp % 1000}/1000 XP</span>
                  </div>
               </div>
               <div className="h-4 w-full bg-[var(--color-surface)]/5 border border-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500 transition-all duration-1000 ease-out relative"
                    style={{ width: `${studentOverview.levelProgress || 0}%` }}
                  >
                     <div className="absolute inset-0 bg-[var(--color-surface)]/20 animate-pulse" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Progress', value: `${avgSkill}%`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Total Experience', value: studentOverview.xp, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Learning Streak', value: `${studentOverview.streak} Days`, icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Active Projects', value: studentOverview.activeProjectsCount, icon: FolderOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`p-6 rounded-[32px] glare-hover ${t.card} border ${t.borderSoft} transition-all duration-300 hover:translate-y-[-4px]`}>
            <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-4`}>
              <Icon className={`${color} w-6 h-6`} />
            </div>
            <div className={`text-3xl font-black ${t.textMain} tracking-tight`}>{value}</div>
            <div className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} mt-1.5 opacity-60`}>{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Lecture Card */}
        <div className={`p-8 rounded-[40px] relative overflow-hidden group ${t.card} border ${t.borderSoft}`}>
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                <Calendar className="w-32 h-32" />
            </div>
            <h3 className={`text-lg font-bold mb-6 flex items-center gap-3 ${t.textMain}`}>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                Next Live Session
            </h3>
            
            {studentOverview.nextLecture ? (
                <div className="space-y-6">
                    <div>
                        <p className={`text-2xl font-bold font-sora ${t.textMain} leading-tight`}>{studentOverview.nextLecture.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                           <div className="w-6 h-6 rounded-full bg-[var(--color-surface)]/10 flex items-center justify-center text-[10px] font-bold">
                              {studentOverview.nextLecture.Teacher?.charAt(0)}
                           </div>
                           <p className={`text-sm font-medium ${t.textMuted}`}>Managed by <strong>{studentOverview.nextLecture.Teacher}</strong></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg ${isDarkMode ? 'bg-amber-500 text-slate-900' : 'bg-slate-900 text-white'}`}>
                            {new Date(studentOverview.nextLecture.time).toLocaleString([], { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <button 
                            onClick={() => setActiveTab('lectures')}
                            className="text-xs font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1.5"
                        >
                            Preparations <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="py-16 text-center bg-[var(--color-surface-2)]/30 rounded-[32px] border border-dashed border-[var(--color-border)] flex flex-col items-center group">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-surface)]/5 border border-[var(--color-border)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                        <Calendar className="w-8 h-8 text-[var(--color-text-muted)] opacity-20" />
                    </div>
                    <p className={`text-xs font-black uppercase tracking-[2px] ${t.textMuted} mb-1`}>No Sessions Active</p>
                    <p className={`text-[10px] font-bold opacity-40 italic ${t.textMuted}`}>Next synchronization scheduled for tomorrow at 09:00 AM</p>
                </div>
            )}
        </div>

        {/* Quick Actions & Badges */}
        <div className={`p-8 rounded-[40px] ${t.card} border ${t.borderSoft} relative overflow-hidden`}>
            <div className="flex justify-between items-center mb-6">
               <h3 className={`text-lg font-bold ${t.textMain}`}>Recent Achievements</h3>
               <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-1 rounded-lg">Unlocked Badges</span>
            </div>

            <div className="flex gap-4 mb-8">
               {studentOverview.recentBadges?.length > 0 ? studentOverview.recentBadges.map((badge, idx) => (
                 <div key={idx} className="group relative flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg transform transition-all group-hover:scale-110 group-hover:rotate-6">
                       <span className="text-2xl">🏆</span>
                    </div>
                    <p className={`text-[10px] font-bold mt-2 truncate max-w-[64px] ${t.textMain}`}>{badge.badge_name}</p>
                 </div>
               )) : (
                 <div className="flex gap-4">
                    {[1,2,3].map(i => (
                       <div key={i} className="w-16 h-16 rounded-2xl bg-[var(--color-surface)]/5 border border-dashed border-white/10 flex items-center justify-center opacity-50">
                         <span className="text-xl">🔒</span>
                       </div>
                    ))}
                 </div>
               )}
            </div>

            <h3 className={`text-xs font-black uppercase tracking-widest mb-4 opacity-50 ${t.textMuted}`}>Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-3">
                 <button 
                    onClick={() => setActiveTab('skills')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${t.hover} ${t.borderSoft} group`}
                 >
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <Award className="w-5 h-5 text-amber-500 group-hover:text-white" />
                    </div>
                    <p className="text-xs font-bold text-center">Skill Radar</p>
                 </button>

                 <button 
                    onClick={() => setActiveTab('projects')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${t.hover} ${t.borderSoft} group`}
                 >
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <FolderOpen className="w-5 h-5 text-blue-500 group-hover:text-white" />
                    </div>
                    <p className="text-xs font-bold text-center">Projects</p>
                 </button>
            </div>
        </div>
      </div>

      {/* Row 2: Skill Gap Radar + Progress Bars (60/40) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`lg:col-span-7 p-8 rounded-[40px] ${t.card} border ${t.borderSoft}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-bold font-sora ${t.textMain}`}>Skill DNA Radar</h3>
            <span className={`text-[10px] font-black ${t.textMuted} tracking-widest uppercase`}>Competency Analysis</span>
          </div>
          <div className="h-[320px] relative">
            <SkillRadarChart data={studentSkills} isDarkMode={isDarkMode} />
          </div>
        </div>

        <div className={`lg:col-span-5 p-8 rounded-[40px] ${t.card} border ${t.borderSoft} flex flex-col`}>
          <h3 className={`text-lg font-bold font-sora mb-6 ${t.textMain}`}>Critical Skill Gaps</h3>
          <div className="space-y-5 flex-1 overflow-auto max-h-[320px] pr-2 custom-scrollbar">
            {studentSkills.map((skill, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className={`text-xs font-bold ${t.textMain}`}>{skill.skill}</p>
                  <p className={`text-[10px] font-black ${skill.current >= skill.required ? 'text-emerald-500' : 'text-amber-500'} tracking-tighter`}>
                    {skill.current}% / {skill.required}% Required
                  </p>
                </div>
                <div className="h-2 w-full bg-[var(--color-surface)]/5 rounded-full overflow-hidden border border-white/5">
                   <div 
                      className={`h-full transition-all duration-1000 ${
                        skill.current >= skill.required ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 
                        skill.current > 50 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]' : 'bg-red-500'
                      }`}
                      style={{ width: `${skill.current}%` }}
                   />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 - Placeholder for Row 4 Progress Graph and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
         <div className={`lg:col-span-8 p-8 rounded-[40px] ${t.card} border ${t.borderSoft}`}>
            <h3 className={`text-lg font-bold font-sora mb-1 ${t.textMain}`}>Development Velocity</h3>
            <p className={`text-xs font-medium mb-6 ${t.textMuted}`}>Week-by-week performance improvements</p>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-text-muted)' }} 
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-surface)', 
                      border: '1px solid var(--color-border)', 
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }} 
                    itemStyle={{ color: 'var(--color-primary)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="var(--color-primary)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>
         <div className={`lg:col-span-4 p-8 rounded-[40px] shadow-sm bg-gradient-to-br from-indigo-500/10 to-blue-500/5 border border-indigo-500/20`}>
            <h3 className={`text-lg font-bold font-sora mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Coach Recommendation</h3>
            <p className="text-[10px] font-black uppercase tracking-tighter text-blue-500 mb-6">AI Career Insight</p>
            
            <div className="space-y-4">
               <div className="bg-[var(--color-surface)]/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <p className="text-xs italic leading-relaxed text-slate-300">"Your React competency is growing rapidly. Focus on State Management this week to unlock intermediate certifications."</p>
                  <div className="mt-3 flex items-center gap-2">
                     <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-black text-slate-900">AI</div>
                     <span className="text-[10px] font-bold text-slate-400">Personal Mentor</span>
                  </div>
               </div>
               <button className="w-full py-2.5 rounded-xl bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors">Generate New Path</button>
            </div>
         </div>
      </div>

    </div>
  );
};

// Internal mini component for use in this file only
const ChevronRight = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

