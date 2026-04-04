import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line,
  AreaChart, Area
} from 'recharts';
import { 
  BarChart3, Users, Clock, ShieldAlert, 
  Loader2, Zap, Target, TrendingUp, 
  Activity, ArrowUpRight, Award, Building2
} from 'lucide-react';

const COLORS = {
  student:    '#22C55E',
  Teacher:     '#3B82F6',
  manager:    '#F4A100',
  hr_admin:   '#8B5CF6',
  super_admin:'#EF4444',
};

const AnalyticsPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/analytics');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateInsight = async () => {
    setAiLoading(true);
    try {
      const res = await api.get('/ai/analytics-insight');
      if (res.data.success) {
        setAiInsight(res.data.data.insight);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted}`}>Aggregating Platform Intelligence...</p>
      </div>
    );
  }

  const roleData = (data?.roleDistribution || []).map(r => ({
    name: r.role.replace('_', ' '),
    count: parseInt(r.count),
    color: COLORS[r.role] || '#64748B',
  }));

  // Mock Velocity Data (To be replaced by real sprint logs in Phase 7)
  const velocityData = [
    { day: 'Mon', completed: 4, pending: 12 },
    { day: 'Tue', completed: 7, pending: 10 },
    { day: 'Wed', completed: 12, pending: 8 },
    { day: 'Thu', completed: 18, pending: 5 },
    { day: 'Fri', completed: 25, pending: 3 },
    { day: 'Sat', completed: 28, pending: 2 },
    { day: 'Sun', completed: 32, pending: 1 },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold font-sora flex items-center gap-3 ${t.textMain}`}>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            Intelligence Command
          </h2>
          <p className={`text-sm ${t.textMuted} mt-1`}>Real-time visibility into organizational growth, development velocity, and mission status.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className={`px-4 py-2 rounded-2xl bg-[var(--color-surface)]/5 border border-white/5 flex items-center gap-3`}>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className={`text-[10px] font-black uppercase tracking-widest ${t.textMain}`}>Live Sync Active</span>
           </div>
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Workforce', value: roleData.reduce((s, r) => s + r.count, 0), color: '#3B82F6', icon: Users, trend: '+12%' },
          { label: 'Development Velocity', value: '84%', color: '#22C55E', icon: Activity, trend: '+5.4%' },
          { label: 'Active Missions', value: data?.pendingApprovals || 0, color: '#F4A100', icon: Zap, trend: 'High' },
          { label: 'Sprint Health', value: 'Optimal', color: '#8B5CF6', icon: Target, trend: 'Safe' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-[32px] border relative overflow-hidden group hover:scale-[1.02] transition-all ${t.card} ${t.borderSoft}`}>
             <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center`} style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                   <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg bg-[var(--color-surface)]/5 text-slate-500 border border-white/5`}>{stat.trend}</span>
             </div>
             <p className={`text-3xl font-black font-sora ${t.textMain}`}>{stat.value}</p>
             <p className={`text-[10px] font-black uppercase tracking-widest mt-1 opacity-60 ${t.textMuted}`}>{stat.label}</p>
             {/* Background Decoration */}
             <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[var(--color-surface)]/3 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Velocity Analytics (Phase 6 Core) */}
         <div className={`lg:col-span-8 p-8 rounded-[40px] border ${t.card} ${t.borderSoft}`}>
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className={`text-lg font-bold font-sora flex items-center gap-2 ${t.textMain}`}>
                     <Zap className="w-5 h-5 text-amber-500" /> Development Velocity
                  </h3>
                  <p className={`text-xs ${t.textMuted}`}>14-day sprint performance tracking across all departments.</p>
               </div>
               <select className={`bg-[var(--color-surface)]/5 border ${t.borderSoft} rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none transition-all`}>
                  <option>Current Sprint</option>
                  <option>Previous Week</option>
               </select>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
               <AreaChart data={velocityData}>
                  <defs>
                     <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F4A100" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F4A100" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9'} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ background: '#1E3A5F', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#F4A100', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="completed" stroke="#F4A100" strokeWidth={3} fillOpacity={1} fill="url(#colorComp)" />
                  <Line type="monotone" dataKey="pending" stroke="#3B82F6" strokeWidth={2} strokeDasharray="5 5" />
               </AreaChart>
            </ResponsiveContainer>

            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-amber-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Missions Completed</span>
                </div>
                <div className="flex items-center gap-2 text-blue-500">
                   <div className="w-3 h-3 rounded-full border-2 border-blue-500 border-dashed" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scheduled Backlog</span>
                </div>
            </div>
         </div>

         {/* Distribution & Insights */}
         <div className="lg:col-span-4 space-y-6">
            <div className={`p-8 rounded-[40px] border ${t.card} ${t.borderSoft}`}>
               <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 ${t.textMuted} flex items-center gap-2`}>
                  <Users className="w-4 h-4" /> Role Distribution
               </h3>
               <div className="space-y-4">
                  {roleData.map(role => (
                     <div key={role.name} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                           <span className={t.textMain}>{role.name}</span>
                           <span style={{ color: role.color }}>{role.count}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--color-surface)]/5 rounded-full overflow-hidden">
                           <div className="h-full rounded-full transition-all duration-1000" style={{ background: role.color, width: `${(role.count / roleData.reduce((s,r)=>s+r.count,0)) * 100}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="p-8 rounded-[40px] bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden group shadow-xl">
               <div className="relative z-10">
                  <h4 className="text-lg font-black font-sora mb-1">AI Platform Briefing</h4>
                  <p className="text-[10px] opacity-70 mb-6 leading-relaxed">Synthesis of platform health based on user ratios and dev velocity.</p>
                  
                  {aiLoading ? (
                     <div className="flex items-center gap-2 text-xs font-bold animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Ecosystem...
                     </div>
                  ) : aiInsight ? (
                     <p className="text-xs leading-relaxed italic border-l-2 border-amber-400 pl-4 py-1">{aiInsight.slice(0, 150)}...</p>
                  ) : (
                     <button onClick={generateInsight} className="w-full py-3 bg-[var(--color-surface)] text-indigo-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 hover:text-slate-900 transition-all active:scale-95 flex items-center justify-center gap-2">
                        Initialize Synthesizer <ArrowUpRight className="w-4 h-4" />
                     </button>
                  )}
               </div>
               {/* Decoration */}
               <BarChart3 className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 rotate-12 group-hover:rotate-0 transition-all duration-1000" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

