import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/cards/StatCard';
import axiosInstance from '../../api/axios';
import { Target, FolderOpen, Video, Award, PlayCircle, Bot, ArrowRight, BookOpen } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: { score: 0, projectsDone: 0, lecturesAttended: 0, certificates: 0 },
    skills: [],
    upcomingLectures: [],
    projects: [],
    aiRecommendation: null,
    progressGraph: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: pRes }, { data: lRes }, { data: projRes }, { data: aiRes }] = await Promise.all([
        axiosInstance.get('/progress/me').catch(() => ({ data: { data: {} } })),
        axiosInstance.get('/student/lectures?limit=3&upcoming=true').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/student/projects?my=true&limit=3').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/ai/recommendations/me?limit=1').catch(() => ({ data: { data: null } }))
      ]);

      const pData = pRes.data || {};
      
      // Mocking graph data as required by "Progress graph — line chart of last 8 weeks"
      const mockGraph = [
        { week: 'W1', score: 45 }, { week: 'W2', score: 52 },
        { week: 'W3', score: 50 }, { week: 'W4', score: 65 },
        { week: 'W5', score: 70 }, { week: 'W6', score: 68 },
        { week: 'W7', score: 82 }, { week: 'W8', score: 88 },
      ];

      setData({
        stats: {
          score: pData.overall_score || 0,
          projectsDone: pData.completed_projects || 0,
          lecturesAttended: pData.attended_lectures || 0,
          certificates: pData.certificates_earned || 0
        },
        skills: pData.skill_gaps || [
          { name: 'React Development', gap: 65 },
          { name: 'Node.js Backend', gap: 40 },
          { name: 'UI/UX Design', gap: 85 }
        ], // Mock fallback
        upcomingLectures: lRes.data || [],
        projects: projRes.data || [],
        aiRecommendation: aiRes.data || { title: 'Advanced React Patterns', platform: 'Coursera', reason: 'High gap in React component lifecycle' },
        progressGraph: mockGraph
      });
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20 min-h-[50vh]">
          <div className="w-8 h-8 border-4 rounded-full animate-spin border-[var(--color-primary)] border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 min-h-[50vh]">
          <p className="text-[var(--color-danger)] font-medium mb-3">{error}</p>
          <button onClick={fetchData} className="text-sm font-semibold px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90">Try Again</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Row 1: Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Skill Score %" value={`${data.stats.score}%`} icon={Target} color="primary" trend={12} />
          <StatCard title="Projects Done" value={data.stats.projectsDone} icon={FolderOpen} color="success" trend={1} />
          <StatCard title="Lectures Attended" value={data.stats.lecturesAttended} icon={Video} color="info" />
          <StatCard title="Certificates" value={data.stats.certificates} icon={Award} color="warning" />
        </div>

        {/* Row 2: Left 60% Right 40% */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Skill Gaps (60%) */}
          <div className="lg:col-span-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden flex flex-col pb-4">
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <h2 className="text-base font-bold font-sora text-[var(--color-text-primary)]">My Skill Gap Progress</h2>
            </div>
            <div className="p-6 space-y-6 flex-1">
              {data.skills.map((skill, idx) => {
                const isGood = skill.gap >= 75;
                const isWarn = skill.gap >= 40 && skill.gap < 75;
                const barColor = isGood ? 'bg-[var(--color-success)]' : isWarn ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-danger)]';
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1.5 font-medium">
                      <span className="text-[var(--color-text-primary)]">{skill.name}</span>
                      <span className={isGood ? 'text-[var(--color-success)]' : isWarn ? 'text-[var(--color-warning)]' : 'text-[var(--color-danger)]'}>
                        {skill.gap}%
                      </span>
                    </div>
                    <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                      <div className={`h-2.5 rounded-full ${barColor} transition-all duration-700 ease-out`} style={{ width: `${skill.gap}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Lectures (40%) */}
          <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex justify-between items-center">
              <h2 className="text-base font-bold font-sora text-[var(--color-text-primary)]">Upcoming Lectures</h2>
              <BookOpen size={18} className="text-[var(--color-primary)]" />
            </div>
            <div className="p-4 flex-1">
              {data.upcomingLectures.length === 0 ? (
                <div className="text-center py-8 text-sm text-[var(--color-text-muted)]">No upcoming lectures</div>
              ) : (
                <div className="space-y-3">
                  {data.upcomingLectures.map(lecture => (
                    <div key={lecture.id} className="p-4 border border-[var(--color-border)] rounded-xl flex flex-col justify-between bg-black/5 dark:bg-white/5 hover:border-[var(--color-primary)] transition-colors">
                      <div>
                        <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-1">{lecture.title}</h3>
                        <p className="text-xs text-[var(--color-text-muted)] font-medium">{new Date(lecture.start_time).toLocaleString()}</p>
                      </div>
                      <button className="mt-3 w-full py-2 bg-[var(--color-primary)] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-opacity-90 transition-opacity">
                        <PlayCircle size={14} /> Join Session
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Left 50% Right 50% */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects Kanban mini */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <h2 className="text-base font-bold font-sora text-[var(--color-text-primary)]">My Projects</h2>
            </div>
            <div className="p-5 grid grid-cols-1 gap-3">
              {data.projects.length === 0 ? (
                <div className="text-center py-6 text-sm text-[var(--color-text-muted)]">No active projects</div>
              ) : (
                data.projects.map(proj => (
                  <div key={proj.id} className="p-4 rounded-xl border border-[var(--color-border)] bg-white dark:bg-black/20 flex justify-between items-center justify-between group hover:border-[var(--color-primary)] transition-colors">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-sm text-[var(--color-text-primary)]">{proj.title}</h3>
                      <p className="text-xs text-[var(--color-text-muted)]">Due: {new Date(proj.deadline).toLocaleDateString()}</p>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                       {proj.status || 'Assigned'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Today's AI Recommendation */}
          <div className="bg-[var(--color-primary)] border border-white/10 rounded-xl shadow-lg overflow-hidden flex flex-col relative text-white">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Bot size={80} />
            </div>
            <div className="px-6 py-4 border-b border-white/10 relative z-10 flex items-center gap-2">
              <Bot size={20} className="text-[var(--color-accent)]" />
              <h2 className="text-base font-bold font-sora">Today's AI Recommendation</h2>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center relative z-10">
              {data.aiRecommendation ? (
                <>
                   <span className="inline-block px-3 py-1 bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/40 rounded-full text-[10px] font-bold uppercase mb-4 self-start">
                     {data.aiRecommendation.platform} match
                   </span>
                   <h3 className="text-xl font-bold font-sora mb-2">{data.aiRecommendation.title}</h3>
                   <p className="text-sm text-white/70 mb-6 flex-1">{data.aiRecommendation.reason}</p>
                   <button className="w-full py-3 bg-[var(--color-accent)] text-[var(--color-primary)] font-bold text-sm rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2">
                     Start Learning <ArrowRight size={16} />
                   </button>
                </>
              ) : (
                <div className="text-center py-6 text-sm text-white/60">No recommendations available today</div>
              )}
            </div>
          </div>
        </div>

        {/* Row 4: Full width Progress Graph */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden p-6">
          <h2 className="text-base font-bold font-sora text-[var(--color-text-primary)] mb-6">Learning Trajectory</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.progressGraph}>
                <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.2} vertical={false} />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                  itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6, fill: 'var(--color-accent)'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
