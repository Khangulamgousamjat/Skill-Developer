import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Users, BookOpen, Video, MessageSquare, 
  Calendar, Award, TrendingUp, ArrowUpRight, 
  Plus, PlayCircle, Clock, CheckCircle2 
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import axiosInstance from '../../api/axios';

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

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">
              {t('welcome')}, {user?.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">
              {t('teacherOverview')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-all font-semibold text-sm shadow-lg shadow-[var(--color-primary)]/20">
              <Plus size={18} />
              Schedule Lecture
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-surface-2)] transition-all font-semibold text-sm shadow-sm">
              <Video size={18} className="text-[var(--color-accent)]" />
              Upload Video
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={Users} 
            label="Total Students" 
            value={stats.totalStudents} 
            trend="+12%" 
            color="blue" 
          />
          <StatCard 
            icon={BookOpen} 
            label="Lectures" 
            value={stats.totalLectures} 
            trend="Total Sessions" 
            color="indigo" 
          />
          <StatCard 
            icon={Video} 
            label="Videos" 
            value={stats.totalVideos} 
            trend="Learning Modules" 
            color="amber" 
          />
          <StatCard 
            icon={MessageSquare} 
            label="Pending Q&A" 
            value={stats.pendingQna} 
            trend="-3 since yesterday" 
            color="rose" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area: Upcoming & History */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Lectures */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
                <h2 className="text-lg font-bold font-sora text-[var(--color-text-primary)]">Upcoming Sessions</h2>
                <button className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider hover:underline">View All</button>
              </div>
              <div className="divide-y divide-[var(--color-border)]">
                {upcomingLectures.map((lecture) => (
                  <div key={lecture.id} className="p-6 flex items-center justify-between hover:bg-[var(--color-surface-2)]/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                        <Calendar size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--color-text-primary)]">{lecture.title}</h3>
                        <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-2 mt-1">
                          <Clock size={12} /> {lecture.date} • {lecture.time}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all">
                      Details
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold font-sora text-[var(--color-text-primary)]">Engagement Growth</h2>
                <select className="bg-transparent border-none text-xs font-bold text-[var(--color-text-muted)] focus:ring-0">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-64 flex items-end justify-between gap-2 px-2">
                {[40, 60, 45, 90, 65, 85, 75].map((h, i) => (
                  <div key={i} className="flex-1 group relative">
                    <div 
                      className="w-full bg-[var(--color-primary)]/20 rounded-t-lg group-hover:bg-[var(--color-primary)]/40 transition-all cursor-pointer relative"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h}%
                      </div>
                    </div>
                    <p className="text-[10px] text-center mt-3 text-[var(--color-text-muted)] font-medium">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area: Activity & Quick Settings */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[var(--color-border)]">
                <h2 className="text-lg font-bold font-sora text-[var(--color-text-primary)]">Recent Activity</h2>
              </div>
              <div className="p-6 space-y-6">
                {recentActivity.map((act) => (
                  <div key={act.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-[var(--color-text-primary)]">{act.user.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--color-text-primary)] leading-relaxed">
                        <span className="font-bold">{act.user}</span> {act.action} <span className="font-semibold text-[var(--color-primary)]">{act.content}</span>
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-[var(--color-surface-2)]/30 text-center">
                <button className="text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">See Timeline</button>
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
               <div className="relative z-10">
                 <h3 className="font-bold font-sora mb-2">Teacher Tip #4</h3>
                 <p className="text-xs text-white/80 leading-relaxed mb-4">
                   Interactive quizzes during live sessions can increase student engagement by up to 40%.
                 </p>
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)] hover:text-white transition-colors">
                   Read more <ArrowUpRight size={14} />
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, label, value, trend, color }) {
  const colorMap = {
    blue:   'bg-blue-500/10 text-blue-500',
    indigo: 'bg-indigo-500/10 text-indigo-500',
    amber:  'bg-amber-500/10 text-amber-500',
    rose:   'bg-rose-500/10 text-rose-500'
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-3xl shadow-sm hover:translate-y-[-4px] transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color]} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-1 text-[var(--color-success)] text-[10px] font-bold bg-[var(--color-success)]/10 px-2 py-1 rounded-full">
          <TrendingUp size={12} />
          {trend}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{value}</p>
        <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  );
}
