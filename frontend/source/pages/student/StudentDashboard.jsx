import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/cards/StatCard';
import axiosInstance from '../../api/axios';
import { 
  Target, FolderOpen, Video, Award, 
  PlayCircle, Bot, ArrowRight, BookOpen, 
  Flame, TrendingUp, ChevronRight, Zap,
  CheckCircle2, Clock, Calendar, SearchX
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/shared/EmptyState';

export default function StudentDashboard() {
  const { t } = useLanguage();
  const { user } = useSelector((s) => s.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    overview: { 
      xp: 0, level: 1, streak: 0, 
      levelProgress: 0, activeProjectsCount: 0,
      nextLecture: null, recentBadges: [] 
    },
    skills: [],
    upcomingLectures: [],
    projects: [],
    aiRecommendation: null,
    progressGraph: [
      { day: 'Mon', xp: 120 }, { day: 'Tue', xp: 250 },
      { day: 'Wed', xp: 180 }, { day: 'Thu', xp: 400 },
      { day: 'Fri', xp: 320 }, { day: 'Sat', xp: 550 },
      { day: 'Sun', xp: 480 },
    ]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ovRes, skRes, lcRes, pjRes, aiRes] = await Promise.all([
        axiosInstance.get('/student/overview').catch(() => ({ data: { success: false } })),
        axiosInstance.get('/student/skills').catch(() => ({ data: { success: false } })),
        axiosInstance.get('/student/lectures').catch(() => ({ data: { success: false } })),
        axiosInstance.get('/student/projects').catch(() => ({ data: { success: false } })),
        axiosInstance.get('/ai/recommendations/me?limit=1').catch(() => ({ data: { success: false } }))
      ]);

      setData(prev => ({
        ...prev,
        overview: ovRes.data?.success ? ovRes.data.data : prev.overview,
        skills: skRes.data?.success ? skRes.data.data : prev.skills,
        upcomingLectures: lcRes.data?.success ? lcRes.data.data.slice(0, 3) : prev.upcomingLectures,
        projects: pjRes.data?.success ? pjRes.data.data.slice(0, 3) : prev.projects,
        aiRecommendation: aiRes.data?.success ? aiRes.data.data : {
          title: 'Mastering System Design',
          platform: 'Internal Module',
          reason: 'Your role-based roadmap suggests focusing on architectural patterns today.'
        }
      }));
    } catch (err) {
      setError(t('failedLoadDashboard'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* SECTION 1: HERO & GAMIFICATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Welcome Card */}
          <div className="lg:col-span-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between group h-full">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-all duration-1000" />
             
             <div className="relative z-10">
               {loading ? (
                 <div className="space-y-4">
                    <Skeleton className="h-10 w-64 bg-white/10" />
                    <Skeleton className="h-4 w-96 bg-white/10" />
                 </div>
               ) : (
                 <>
                   <h1 className="text-4xl font-bold font-sora">
                     Welcome back, {user?.full_name?.split(' ')[0] || 'Agent'} 🚀
                   </h1>
                   <p className="text-white/70 mt-3 max-w-lg leading-relaxed font-medium">
                     You're on a <span className="text-amber-400 font-bold">{data.overview.streak}-day learning streak!</span> Your momentum is driving significant skill synthesis across the fleet.
                   </p>
                 </>
               )}
             </div>

             <div className="relative z-10 mt-12 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-inner">
               <div className="flex justify-between items-end mb-4">
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Identity Evolution</p>
                   {loading ? <Skeleton className="h-8 w-32 bg-white/10" /> : (
                     <h3 className="text-2xl font-bold font-sora">Lvl {data.overview.level} <span className="text-lg opacity-30 font-normal">/ Fleet Mastery</span></h3>
                   )}
                 </div>
                 {!loading && (
                   <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">{1000 - (data.overview.xp % 1000)} XP to Next Threshold</p>
                 )}
               </div>
               <div className="w-full bg-white/5 rounded-full h-4 p-1 border border-white/5 overflow-hidden">
                 {loading ? <Skeleton className="h-full w-full bg-white/10" /> : (
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${data.overview.levelProgress || 45}%` }}
                     transition={{ duration: 1.5, ease: 'easeOut' }}
                     className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-full shadow-lg shadow-orange-500/30" 
                   />
                 )}
               </div>
             </div>
          </div>

          {/* Activity Mini-Cloud */}
          <div className="lg:col-span-4 grid grid-cols-1 gap-6">
            <StatCard 
              title="Operational Streak" 
              value={`${data.overview.streak} Days`} 
              icon={Flame} 
              color="warning" 
              loading={loading}
              trend={12}
            />
            
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-[var(--color-primary)] transition-all relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                  <Award size={80} />
               </div>
               <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-600 border border-purple-500/20">
                     <Award size={28} />
                  </div>
                  <ChevronRight className="text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
               </div>
               <div className="relative z-10">
                  <p className="text-[10px] font-black font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Recent Achievement</p>
                  {loading ? <Skeleton className="h-6 w-32" /> : (
                    <p className="font-bold text-[var(--color-text-primary)] text-lg">{data.overview.recentBadges[0]?.badge_name || 'Protocol Specialist'}</p>
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: AI MISSION & STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* AI Daily Mission (Left 40%) */}
          <div className="lg:col-span-2 bg-[var(--color-sidebar-bg)] rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl border border-white/5">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-purple-500/10" />
             <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000 text-indigo-500">
                <Bot size={220} />
             </div>
             
             <div className="relative z-10 flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                   <Zap size={22} fill="currentColor" />
                </div>
                <h2 className="text-xl font-bold font-sora">Cognitive Mission</h2>
             </div>

             <div className="relative z-10 space-y-8">
                <div>
                   {loading ? (
                     <div className="space-y-3">
                        <Skeleton className="h-8 w-full bg-white/10" />
                        <Skeleton className="h-4 w-3/4 bg-white/10" />
                     </div>
                   ) : (
                     <>
                       <p className="text-2xl font-bold font-sora leading-tight tracking-tight">{data.aiRecommendation?.title || 'System Architectural Patterns'}</p>
                       <p className="text-sm text-white/40 mt-3 leading-relaxed font-medium">
                         {data.aiRecommendation?.reason || 'Deep dive into microservices orchestration to improve your backend proficiency score.'}
                       </p>
                     </>
                   )}
                </div>

                <div className="space-y-4 py-4">
                   <div className="flex items-start gap-4 text-sm text-white/80 group/task cursor-pointer">
                      <div className="w-6 h-6 rounded-lg border border-white/20 flex items-center justify-center shrink-0 mt-0.5 group-hover/task:border-indigo-500 transition-colors">
                         <div className="w-2.5 h-2.5 rounded shadow-sm bg-indigo-500" />
                      </div>
                      <span className="font-medium">Analyze Master Blueprint (12 min)</span>
                   </div>
                   <div className="flex items-start gap-4 text-sm text-white/30 line-through">
                      <CheckCircle2 size={24} className="text-indigo-500/60 shrink-0" />
                      <span className="mt-0.5">Initialize Development Lab</span>
                   </div>
                </div>

                <button className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all group-hover:translate-y-[-4px] shadow-2xl shadow-indigo-600/30">
                   {loading ? <Loader2 className="animate-spin" /> : (
                     <>Launch Tactical Session <ArrowRight size={18} /></>
                   )}
                </button>
             </div>
          </div>

          {/* Stats & Charts (Right 60%) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-2 gap-6">
               <StatCard title="Cognitive Sync" value="82.4%" icon={Target} color="info" loading={loading} trend={4.2} />
               <StatCard title="Active Modules" value={data.overview.activeProjectsCount} icon={FolderOpen} color="emerald" loading={loading} />
            </div>

            {/* Performance Graph */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-8 shadow-sm overflow-hidden flex flex-col h-[340px]">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">Skill Synthesis Activity</h3>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/40" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Weekly Performance Matrix</span>
                  </div>
               </div>
               <div className="flex-1 w-full">
                  {loading ? <Skeleton className="h-full w-full rounded-2xl" /> : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.progressGraph}>
                         <defs>
                           <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                             <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                           </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                         <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 10, fontWeight: '900', letterSpacing: '0.1em'}} dy={15} />
                         <YAxis hide />
                         <Tooltip 
                           contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '24px', border: '1px solid var(--color-border)', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', borderBottom: '4px solid var(--color-primary)' }}
                           itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px' }}
                           cursor={{ stroke: 'var(--color-primary)', strokeWidth: 2, strokeDasharray: '5 5' }}
                         />
                         <Area 
                           type="monotone" 
                           dataKey="xp" 
                           stroke="var(--color-primary)" 
                           strokeWidth={4}
                           fillOpacity={1} 
                           fill="url(#colorXp)" 
                         />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: UPCOMING & TASKS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Upcoming Lectures */}
           <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col h-full min-h-[400px]">
              <div className="p-8 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-2)]/30">
                 <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/10">
                       <Video size={20} />
                    </div>
                    <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">Upcoming Learning Sessions</h2>
                 </div>
                 <button className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] hover:opacity-70 transition-opacity">Full Schedule</button>
              </div>
              <div className="p-6 space-y-4 flex-1">
                 {loading ? (
                    [...Array(3)].map((_, i) => (
                       <div key={i} className="p-6 rounded-[2rem] border border-[var(--color-border)] animate-pulse flex items-center gap-5">
                          <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                          <div className="space-y-3 flex-1">
                             <Skeleton className="h-5 w-48" />
                             <Skeleton className="h-3 w-32" />
                          </div>
                       </div>
                    ))
                 ) : data.upcomingLectures.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center py-20">
                       <EmptyState 
                          icon={Calendar}
                          title="Null Schedule Detected"
                          description="No tactical briefings or learning sessions have been synchronized for your sector yet."
                          actionLabel="Manual Check-In"
                          onAction={() => fetchData()}
                       />
                    </div>
                 ) : (
                    data.upcomingLectures.map(lecture => (
                       <div key={lecture.id} className="p-6 bg-[var(--color-surface-2)]/40 hover:bg-[var(--color-surface-2)]/80 border border-transparent hover:border-[var(--color-primary)]/20 rounded-[2rem] transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-5">
                             <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col items-center justify-center text-center p-2 group-hover:scale-105 transition-transform shadow-lg shadow-black/5">
                                <span className="text-[10px] font-black text-[var(--color-primary)] uppercase leading-none mb-1">DATE</span>
                                <span className="text-xl font-bold leading-none">{new Date(lecture.scheduled_at || lecture.time).getDate()}</span>
                             </div>
                             <div>
                                <h4 className="font-bold text-[var(--color-text-primary)] text-lg leading-snug group-hover:text-[var(--color-primary)] transition-colors">{lecture.title}</h4>
                                <div className="flex items-center gap-4 mt-2">
                                   <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-2 font-medium">
                                      <Clock size={14} className="text-indigo-500" /> {new Date(lecture.scheduled_at || lecture.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                   </p>
                                   <div className="w-1 h-1 bg-[var(--color-border)] rounded-full" />
                                   <p className="text-xs text-[var(--color-text-primary)] font-bold flex items-center gap-2">
                                      <User className="w-3 h-3 text-[var(--color-primary)]" />
                                      {lecture.Teacher_name || 'Protocol Teacher'}
                                   </p>
                                </div>
                             </div>
                          </div>
                          <button className="p-4 bg-[var(--color-primary)] text-white rounded-2xl shadow-xl shadow-[var(--color-primary)]/20 hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
                             <PlayCircle size={24} />
                          </button>
                       </div>
                    ))
                 )}
              </div>
           </div>

           {/* Tactical Achievement */}
           <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl group border border-white/5">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                 <Target size={140} />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                 <div>
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-8 border border-white/10 shadow-inner">
                       <CheckCircle2 size={24} />
                    </div>
                    <h3 className="text-2xl font-bold font-sora mb-4 tracking-tight">Mission Objective</h3>
                    <p className="text-sm text-white/60 leading-relaxed font-medium">
                       Complete the assigned tactical modules within the next 48 hours to secure a permanent slot in the Advanced AI Fleet.
                    </p>
                 </div>
                 
                 <div className="mt-12 space-y-6">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                       <span>Threshold Progress</span>
                       <span>65% Synthesized</span>
                    </div>
                    <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden border border-white/5 shadow-inner">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '65%' }}
                          transition={{ duration: 2 }}
                          className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]" 
                       />
                    </div>
                    <button className="w-full h-14 bg-white text-emerald-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:translate-y-[-2px] active:scale-95 transition-all shadow-xl shadow-black/20">
                       Verify Completion Status
                    </button>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
