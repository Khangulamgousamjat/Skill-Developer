import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import Skeleton from '../../components/ui/Skeleton';

const engagementData = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 65 },
  { name: 'Wed', value: 45 },
  { name: 'Thu', value: 90 },
  { name: 'Fri', value: 55 },
  { name: 'Sat', value: 85 },
  { name: 'Sun', value: 75 },
];

const TeacherDashboardSkeleton = () => {
    return (
        <div className="space-y-8 animate-pulse text-left">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex gap-3">
                   <Skeleton className="h-12 w-40 rounded-xl" />
                   <Skeleton className="h-12 w-40 rounded-xl" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-64 rounded-3xl" />
                    <Skeleton className="h-80 rounded-3xl" />
                </div>
                <Skeleton className="h-full min-h-[400px] rounded-3xl" />
            </div>
        </div>
    );
};

export default function TeacherDashboard() {
  const { t } = useLanguage();
  const { user } = useSelector((s) => s.auth);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalLectures: 0,
    totalVideos: 0,
    pendingQna: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/teacher/dashboard/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch teacher stats');
    } finally {
      setLoading(false);
    }
  };

  // Mock Upcoming Lectures
  const upcomingLectures = [
    { id: 1, title: 'Advanced React Patterns', date: 'Oct 24, 2024', time: '10:00 AM', status: 'Upcoming' },
    { id: 2, title: 'System Design Interview Prep', date: 'Oct 26, 2024', time: '02:00 PM', status: 'Scheduled' },
  ];

  // Mock Recent Activity
  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'watched', content: 'Intro to Node.js', time: '2h ago' },
    { id: 2, user: 'Jane Smith', action: 'asked', content: 'Question on Docker', time: '5h ago' },
    { id: 3, user: 'Mike Johnson', action: 'completed', content: 'Fullstack Capstone', time: '1d ago' },
  ];

  if (loading && !stats.totalStudents && stats.totalStudents !== 0) {
      return (
        <DashboardLayout>
            <TeacherDashboardSkeleton />
        </DashboardLayout>
      );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700 text-left">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">
              {t('welcome')}, {user?.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">
              Global synchronization status: <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Optimal</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl hover:opacity-90 transition-all font-bold text-sm shadow-xl shadow-[var(--color-primary)]/20 active:scale-95">
              <Plus size={18} />
              Schedule Session
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-2xl hover:bg-[var(--color-surface-2)] transition-all font-bold text-sm shadow-sm active:scale-95">
              <Video size={18} className="text-[var(--color-accent)]" />
              Sync Asset
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={Users} 
            label="Active Interns" 
            value={stats.totalStudents} 
            trend="+12%" 
            color="blue" 
            isLoading={loading}
          />
          <StatCard 
            icon={BookOpen} 
            label="Total Sessions" 
            value={stats.totalLectures} 
            trend="100% Sync" 
            color="indigo" 
            isLoading={loading}
          />
          <StatCard 
            icon={Video} 
            label="Cloud Assets" 
            value={stats.totalVideos} 
            trend="Active Modules" 
            color="amber" 
            isLoading={loading}
          />
          <StatCard 
            icon={MessageSquare} 
            label="Pending Queries" 
            value={stats.pendingQna} 
            trend="Critical Filter" 
            color="rose" 
            isLoading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area: Upcoming & History */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Lectures */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-2)]/30 px-8">
                <h2 className="text-lg font-bold font-sora text-[var(--color-text-primary)]">Educational Pipeline</h2>
                <button className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:underline">Full Log</button>
              </div>
              <div className="divide-y divide-[var(--color-border)]">
                {upcomingLectures.map((lecture) => (
                  <div key={lecture.id} className="p-8 flex items-center justify-between hover:bg-[var(--color-surface-2)]/50 transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{lecture.title}</h3>
                        <p className="text-[10px] text-[var(--color-text-muted)] font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                          <Clock size={12} className="text-amber-500" /> {lecture.date} • {lecture.time}
                        </p>
                      </div>
                    </div>
                    <button className="px-6 py-2.5 rounded-xl border border-[var(--color-border)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm">
                      Inspect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div>
                   <h2 className="text-lg font-bold font-sora text-[var(--color-text-primary)]">Student Engagement Pulse</h2>
                   <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1">Institutional Retrieval Analytics</p>
                </div>
                <select className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none cursor-pointer">
                  <option>Rolling 7-Day Sync</option>
                  <option>Archive Metrics</option>
                </select>
              </div>
              <div className="h-64 mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                       <XAxis 
                         dataKey="name" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--color-text-muted)', textTransform: 'uppercase' }} 
                         dy={10}
                       />
                       <YAxis hide />
                       <Tooltip 
                         cursor={{ fill: 'var(--color-surface-2)', opacity: 0.5 }}
                         contentStyle={{ 
                           backgroundColor: 'var(--color-surface)', 
                           border: '1px solid var(--color-border)', 
                           borderRadius: '16px',
                           fontSize: '10px',
                           fontWeight: 'black',
                           textTransform: 'uppercase'
                         }} 
                       />
                       <Bar 
                         dataKey="value" 
                         radius={[8, 8, 8, 8]}
                         barSize={32}
                       >
                         {engagementData.map((entry, index) => (
                           <Cell 
                             key={`cell-${index}`} 
                             fill={index === 3 ? 'var(--color-primary)' : 'var(--color-primary-light)'} 
                             fillOpacity={index === 3 ? 1 : 0.4}
                           />
                         ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sidebar Area: Activity & Quick Settings */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/30 px-8">
                <h2 className="text-lg font-bold font-sora text-[var(--color-text-primary)]">Audit Trail</h2>
              </div>
              <div className="p-8 space-y-8">
                {recentActivity.map((act) => (
                  <div key={act.id} className="flex gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center shrink-0 font-black text-xs text-[var(--color-text-muted)] group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)] transition-all">
                      {act.user.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--color-text-primary)] leading-relaxed">
                        <span className="font-bold underline decoration-[var(--color-primary)]/30 decoration-2 underline-offset-4">{act.user}</span> <span className="opacity-60">{act.action}</span> <span className="font-black uppercase tracking-widest text-[9px] text-[var(--color-primary)]">{act.content}</span>
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1 opacity-40">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-[var(--color-surface-2)]/30 text-center border-t border-[var(--color-border)]">
                <button className="text-[10px] font-black text-[var(--color-text-muted)] hover:text-[var(--color-primary)] uppercase tracking-widest transition-colors">Access Unified Logs</button>
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
               <div className="relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6">
                    <Award size={24} className="text-amber-400" />
                 </div>
                 <h3 className="font-bold font-sora text-xl mb-4 leading-tight">Insight Generator</h3>
                 <p className="text-sm text-white/70 leading-relaxed mb-8">
                   "High student engagement detected in 'System Design' modules. Recommend advanced architectural resources."
                 </p>
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[2px] text-amber-400 hover:text-white transition-colors">
                    Optimize Strategy <ArrowUpRight size={14} />
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, label, value, trend, color, isLoading }) {
  const colorMap = {
    blue:   'bg-blue-500/10 text-blue-500',
    indigo: 'bg-indigo-500/10 text-indigo-500',
    amber:  'bg-amber-500/10 text-amber-500',
    rose:   'bg-rose-500/10 text-rose-500'
  };

  if (isLoading) {
      return <Skeleton className="h-40 rounded-[32px]" />;
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-[40px] shadow-sm hover:translate-y-[-8px] transition-all duration-500 group relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-center justify-between mb-8">
        <div className={`w-14 h-14 rounded-2xl ${colorMap[color]} group-hover:scale-110 transition-transform flex items-center justify-center border border-white/5`}>
          <Icon size={28} />
        </div>
        <div className="flex items-center gap-1 text-[var(--color-success)] text-[9px] font-black uppercase tracking-widest bg-[var(--color-success)]/10 px-3 py-1.5 rounded-lg border border-[var(--color-success)]/10">
          <TrendingUp size={12} />
          {trend}
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">{value}</p>
        <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-[2px] mt-2 opacity-60">{label}</p>
      </div>
    </div>
  );
}
