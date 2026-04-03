import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Trophy, TrendingUp, Users, Award, Shield, Loader2, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Leaderboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/users/leaderboard');
      setData(res.data.data || []);
    } catch (err) {
      toast.error(t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  const getRankStyle = (idx) => {
    if (idx === 0) return 'from-yellow-400 to-amber-600 shadow-yellow-500/20';
    if (idx === 1) return 'from-slate-300 to-slate-500 shadow-slate-400/20';
    if (idx === 2) return 'from-orange-400 to-orange-700 shadow-orange-500/20';
    return 'bg-[var(--color-surface-2)]';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--color-surface)]/5 opacity-40 mix-blend-overlay" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold font-sora flex items-center gap-3">
              <Trophy size={32} className="text-yellow-400" />
              Global Leaderboard
            </h1>
            <p className="text-white/80 mt-2 text-sm italic">
              Compete with your peers and climb the ranks of excellence.
            </p>
          </div>
          <div className="relative z-10 hidden md:flex gap-6">
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-white/60 tracking-widest mb-1">Total Users</p>
              <p className="text-2xl font-bold font-sora">1,240+</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-white/60 tracking-widest mb-1">Monthly XP</p>
              <p className="text-2xl font-bold font-sora">8.2M+</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((user, idx) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/profile/${user.id}`)}
                className={`flex items-center gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:scale-[1.01] transition-all cursor-pointer group shadow-sm`}
              >
                {/* Rank */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg font-sora shadow-lg ${
                  idx < 3 ? `bg-gradient-to-br text-white ${getRankStyle(idx)}` : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'
                }`}>
                  {idx + 1}
                </div>

                {/* Profile */}
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[var(--color-surface-2)] border border-[var(--color-border)] shrink-0">
                  {user.profile_photo_url ? (
                    <img src={user.profile_photo_url} alt={user.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-[var(--color-text-muted)]">
                      {user.full_name?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Identity */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[var(--color-text-primary)] text-sm md:text-base truncate group-hover:text-[var(--color-primary)] transition-colors">
                    {user.full_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                      {user.department_name}
                    </span>
                    <span className="w-1 h-1 bg-[var(--color-border)] rounded-full" />
                    <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase">
                      Lvl {user.current_level}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end text-[var(--color-accent)] font-bold font-sora text-sm md:text-lg">
                    {user.total_xp.toLocaleString()} <span className="text-[10px] text-[var(--color-text-muted)] mt-1">XP</span>
                  </div>
                  <div className="flex items-center gap-1 justify-end text-[var(--color-success)] text-[10px] font-bold mt-1">
                     <TrendingUp size={12} />
                     +{Math.floor(Math.random() * 500)} today
                  </div>
                </div>

                <div className="pl-4 hidden md:block">
                   <ArrowUpRight size={20} className="text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

