import React, { useState, useEffect } from 'react';
import { 
  BarChart2, TrendingUp, Target, 
  Search, Filter, Loader2, Award,
  CheckCircle2, AlertCircle, LineChart,
  BrainCircuit, LayoutGrid
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function SkillHeatMap() {
  const { t } = useLanguage();
  const isDarkMode = useSelector((s) => s.ui.theme === 'dark');
  const [stats, setStats] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('department'); // 'department' or 'individual'
  const [selectedInternId, setSelectedInternId] = useState('');

  const COLORS = ['#1E3A5F', '#F4A100', '#10B981', '#6366F1', '#EC4899', '#8B5CF6'];

  useEffect(() => {
    fetchData();
  }, [viewMode, selectedInternId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (viewMode === 'department') {
        const res = await api.get('/manager/skill-stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } else {
        // Fetch team list if not already fetched
        if (team.length === 0) {
          const teamRes = await api.get('/manager/team');
          if (teamRes.data.success) setTeam(teamRes.data.data);
        }
        
        if (selectedInternId) {
          const res = await api.get(`/api/student/skills?internId=${selectedInternId}`);
          if (res.data.success) {
            setStats(res.data.data);
          }
        }
      }
    } catch (err) {
      toast.error('Failed to analyze skill matrix');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              Skill Heat Map
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">Strategic visualization of departmental core proficiencies</p>
          </div>
          
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
            <button 
              onClick={() => { setViewMode('department'); setStats([]); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'department' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
            >
              Department Averages
            </button>
            <button 
              onClick={() => { setViewMode('individual'); setStats([]); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'individual' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
            >
              Individual Matrix
            </button>
          </div>
        </div>

        {viewMode === 'individual' && (
           <div className="flex items-center gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-[2.5rem] shadow-sm animate-in slide-in-from-top-4 duration-500">
              <div className="p-3 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                 <Target size={20} />
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-1">Target Intern</p>
                 <select 
                   value={selectedInternId}
                   onChange={(e) => setSelectedInternId(e.target.value)}
                   className="w-full bg-transparent border-none text-sm font-bold text-[var(--color-text-primary)] focus:ring-0 outline-none cursor-pointer"
                 >
                    <option value="" className="bg-[var(--color-surface)]">Select Intern to Analyze</option>
                    {team.map(i => <option key={i.id} value={i.id} className="bg-[var(--color-surface)]">{i.full_name}</option>)}
                 </select>
              </div>
           </div>
        )}

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] tracking-widest">Neural Mapping in Progress...</p>
          </div>
        ) : stats.length === 0 ? (
          <div className="py-24 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem]">
             <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-muted)] opacity-20" />
             <h3 className="text-xl font-bold text-[var(--color-text-primary)]">No data points available</h3>
             <p className="text-[var(--color-text-muted)] mt-1">Skill metrics will appear here once evaluations are processed</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             
             {/* Main Chart Card */}
             <div className="lg:col-span-2 p-10 rounded-[3rem] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm h-[500px] flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 text-[var(--color-primary)]/5">
                   <TrendingUp size={150} />
                </div>
                <div className="flex items-center justify-between mb-10 relative z-10">
                   <h3 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">
                      {viewMode === 'department' ? 'Departmental Skill Baseline' : `Proficiency Overlay: ${team.find(i => i.id == selectedInternId)?.full_name}`}
                   </h3>
                   <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Live Metrics</span>
                   </div>
                </div>
                
                <div className="flex-1 min-h-0 relative z-10">
                   <ResponsiveContainer width="100%" height="100%">
                      {viewMode === 'department' ? (
                        <BarChart data={stats} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                           <XAxis 
                              dataKey="skill_name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontWeight: 'bold' }} 
                           />
                           <YAxis 
                              domain={[0, 100]}
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                           />
                           <Tooltip 
                              cursor={{ fill: 'var(--color-surface-2)' }}
                              contentStyle={{ 
                                 background: 'var(--color-surface)', 
                                 border: '1px solid var(--color-border)',
                                 borderRadius: '24px',
                                 padding: '16px',
                                 fontSize: '12px',
                                 boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                              }}
                           />
                           <Bar 
                              dataKey="avg_level" 
                              radius={[12, 12, 0, 0]} 
                              barSize={40}
                           >
                              {stats.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                           </Bar>
                        </BarChart>
                      ) : (
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats}>
                           <PolarGrid stroke="var(--color-border)" />
                           <PolarAngleAxis dataKey="name" tick={{fill: 'var(--color-text-muted)', fontSize: 10, fontWeight: 'black'}} />
                           <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fontSize: 8}} />
                           <Radar
                              name="Current"
                              dataKey="current"
                              stroke="var(--color-primary)"
                              fill="var(--color-primary)"
                              fillOpacity={0.6}
                           />
                           <Radar
                              name="Required"
                              dataKey="required"
                              stroke="var(--color-accent)"
                              fill="var(--color-accent)"
                              fillOpacity={0.1}
                           />
                           <Tooltip 
                              contentStyle={{ 
                                 background: 'var(--color-surface)', 
                                 border: '1px solid var(--color-border)',
                                 borderRadius: '20px',
                                 fontSize: '12px'
                              }}
                           />
                        </RadarChart>
                      )}
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Strength Cards */}
             <div className="p-8 rounded-[3rem] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                   <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                      <Award size={20} />
                   </div>
                   <h4 className="text-lg font-bold font-sora text-[var(--color-text-primary)]">Core Strengths</h4>
                </div>
                <div className="space-y-4">
                   {[...stats].sort((a,b) => (b.avg_level || b.current) - (a.avg_level || a.current)).slice(0, 3).map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-surface-2)]/50 border border-[var(--color-border)]/50">
                         <span className="text-sm font-bold text-[var(--color-text-primary)]">{s.skill_name || s.name}</span>
                         <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest leading-none">High Proficiency</span>
                      </div>
                   ))}
                </div>
             </div>

             <div className="p-8 rounded-[3rem] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                   <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                      <Target size={20} />
                   </div>
                   <h4 className="text-lg font-bold font-sora text-[var(--color-text-primary)]">Skill Gaps</h4>
                </div>
                <div className="space-y-4">
                   {[...stats].sort((a,b) => (a.avg_level || a.current) - (b.avg_level || b.current)).slice(0, 3).map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-surface-2)]/50 border border-[var(--color-border)]/50">
                         <span className="text-sm font-bold text-[var(--color-text-primary)]">{s.skill_name || s.name}</span>
                         <span className="text-xs font-black text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full uppercase tracking-widest leading-none">Awaiting Focus</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
