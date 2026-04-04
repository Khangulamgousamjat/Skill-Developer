import React, { useState, useEffect } from 'react';
import { 
  Building2, TrendingUp, Users, Award, 
  BarChart2, PieChart as PieChartIcon, 
  Loader2, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function DeptComparison() {
  const { t } = useLanguage();
  const isDarkMode = useSelector((s) => s.ui.theme === 'dark');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#1E3A5F', '#F4A100', '#10B981', '#6366F1', '#EC4899', '#8B5CF6'];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hr/department-stats');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load department analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              Department Comparison
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">Benchmarking performance across different organizational units</p>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">Analyzing organizational data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="py-24 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem]">
             <Building2 className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-muted)] opacity-20" />
             <h3 className="text-xl font-bold text-[var(--color-text-primary)]">No data available</h3>
             <p className="text-[var(--color-text-muted)] mt-1">Statistics will appear here once departments are active</p>
          </div>
        ) : (
          <>
            {/* Top Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="p-8 rounded-[2.5rem] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Users size={24} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Headcount</span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--color-text-secondary)] mb-1">Largest Department</h3>
                  <p className="text-2xl font-black text-[var(--color-text-primary)] font-sora">{data[0]?.name || 'N/A'}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-2 italic">{data[0]?.intern_count} active interns</p>
               </div>

               <div className="p-8 rounded-[2.5rem] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <BarChart2 size={24} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Attendance</span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--color-text-secondary)] mb-1">Highest Participation</h3>
                  <p className="text-2xl font-black text-[var(--color-text-primary)] font-sora">
                    {[...data].sort((a,b) => b.avg_attendance - a.avg_attendance)[0]?.name || 'N/A'}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-2 italic">Avg. {Math.round([...data].sort((a,b) => b.avg_attendance - a.avg_attendance)[0]?.avg_attendance || 0)} mins per session</p>
               </div>

               <div className="p-8 rounded-[2.5rem] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Award size={24} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Output</span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--color-text-secondary)] mb-1">Most Productive</h3>
                  <p className="text-2xl font-black text-[var(--color-text-primary)] font-sora">
                    {[...data].sort((a,b) => b.completed_projects - a.completed_projects)[0]?.name || 'N/A'}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-2 italic">{[...data].sort((a,b) => b.completed_projects - a.completed_projects)[0]?.completed_projects} projects completed</p>
               </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               
               {/* Headcount Breakdown */}
               <div className="p-8 rounded-[2.5rem] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm h-[400px] flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-lg font-bold font-sora text-[var(--color-text-primary)]">Intern Distribution</h3>
                     <PieChartIcon size={20} className="text-[var(--color-text-muted)]" />
                  </div>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="intern_count"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                           contentStyle={{ 
                              background: 'var(--color-surface)', 
                              border: '1px solid var(--color-border)',
                              borderRadius: '16px',
                              fontSize: '12px'
                           }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               {/* Growth & Attendance */}
               <div className="p-8 rounded-[2.5rem] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm h-[400px] flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-lg font-bold font-sora text-[var(--color-text-primary)]">Average Attendance (mins)</h3>
                     <BarChart2 size={20} className="text-[var(--color-text-muted)]" />
                  </div>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                        <XAxis 
                           dataKey="name" 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontWeight: 'bold' }} 
                        />
                        <YAxis 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                        />
                        <Tooltip 
                           cursor={{ fill: 'var(--color-surface-2)' }}
                           contentStyle={{ 
                              background: 'var(--color-surface)', 
                              border: '1px solid var(--color-border)',
                              borderRadius: '16px',
                              fontSize: '12px'
                           }}
                        />
                        <Bar 
                           dataKey="avg_attendance" 
                           fill="var(--color-primary)" 
                           radius={[10, 10, 0, 0]} 
                           barSize={32}
                        >
                           {data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               {/* Project Completion Bar */}
               <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm h-[400px] flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-lg font-bold font-sora text-[var(--color-text-primary)]">Completed Projects by Department</h3>
                     <Award size={20} className="text-[var(--color-text-muted)]" />
                  </div>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                        <YAxis 
                           dataKey="name" 
                           type="category" 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{ fill: 'var(--color-text-primary)', fontSize: 11, fontWeight: 'bold' }} 
                        />
                        <Tooltip 
                           cursor={{ fill: 'var(--color-surface-2)' }}
                           contentStyle={{ 
                              background: 'var(--color-surface)', 
                              border: '1px solid var(--color-border)',
                              borderRadius: '16px',
                              fontSize: '12px'
                           }}
                        />
                        <Bar dataKey="completed_projects" fill="var(--color-accent)" radius={[0, 10, 10, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
