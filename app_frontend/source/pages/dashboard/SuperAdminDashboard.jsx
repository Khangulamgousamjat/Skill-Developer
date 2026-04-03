import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Settings, Zap, Globe, Activity, Loader2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';

export const SuperAdminDashboard = () => {
  const { t, isDarkMode } = useAppContext();
  const [analytics, setAnalytics] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        setLoading(true);
        const [analyticRes, healthRes] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/ai/platform-health')
        ]);
        
        if (analyticRes.data.success) setAnalytics(analyticRes.data.data);
        if (healthRes.data.success)   setHealth(healthRes.data.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };
  
  const totalUsers = analytics?.roleDistribution?.reduce((acc, curr) => acc + parseInt(curr.count), 0) || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Super Admin Center</h2>
          <p className={t.textMuted}>Platform oversight, role approvals, and global settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl glare-hover transition-all ${t.card}`}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <ShieldAlert className="text-red-500 w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-semibold ${t.textMain}`}>Pending Requests</h3>
              <p className={`text-sm ${t.textMuted}`}>Staff Role Approval</p>
            </div>
          </div>
          <div className="text-3xl font-black text-red-500">{analytics?.pendingApprovals || 0}</div>
        </div>
        
        <div className={`p-6 rounded-2xl glare-hover transition-all ${t.card}`}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Users className="text-blue-500 w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-semibold ${t.textMain}`}>Enterprise Users</h3>
              <p className={`text-sm ${t.textMuted}`}>Across All Departments</p>
            </div>
          </div>
          <div className="text-3xl font-black text-blue-500">{totalUsers}</div>
        </div>

        <div className={`p-6 rounded-2xl glare-hover transition-all ${t.card}`}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-slate-500/10 rounded-xl flex items-center justify-center">
              <Settings className="text-slate-500 w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-semibold ${t.textMain}`}>System Health</h3>
              <p className={`text-sm ${t.textMuted}`}>Core API Performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-500 font-bold">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              99.9% Uptime
          </div>
        </div>
      </div>
      
      {/* GLOBAL AI OVERSIGHT SECTION */}
      <div className={`p-8 rounded-3xl border-2 border-slate-500/30 overflow-hidden relative shadow-2xl flex flex-col items-center justify-between text-center md:text-left md:flex-row gap-8 ${isDarkMode ? 'bg-slate-900/40' : 'bg-slate-50'}`}>
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500/10 blur-[100px] pointer-events-none rounded-full"></div>
         
         <div className="bg-slate-600/20 p-6 rounded-3xl border border-slate-500/30 flex-shrink-0">
            <Globe className="w-12 h-12 text-slate-400" />
         </div>

         <div className="flex-1">
            <h3 className={`text-2xl font-black font-sora mb-2 ${t.textMain}`}>Global AI Oversight <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-600 text-white ml-2">SYSTEM ANALYTICS</span></h3>
            <p className={`${t.textMuted} mb-8 max-w-xl`}>Platform-wide operational intelligence. Our AI monitors user growth, database pressure, and administrative efficiency metrics.</p>
            
            {!health ? (
                 <button 
                 onClick={fetchHealth}
                 disabled={loading}
                 className="px-8 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center gap-2 mx-auto md:mx-0 group"
               >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initiate Global Scan"}
                  {!loading && <Activity className="w-4 h-4" /> }
               </button>
            ) : (
                <div className="space-y-6 animate-fade-in w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-2xl border flex flex-col gap-1 ${isDarkMode ? 'bg-[var(--color-surface)]/5 border-white/5' : 'bg-[var(--color-surface)] border-[var(--color-border)]'}`}>
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Platform Load</span>
                            <span className={`text-sm font-bold ${t.textMain}`}>{health.load.toUpperCase()}</span>
                        </div>
                        <div className={`p-4 rounded-2xl border flex flex-col gap-1 ${isDarkMode ? 'bg-[var(--color-surface)]/5 border-white/5' : 'bg-[var(--color-surface)] border-[var(--color-border)]'}`}>
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Primary Bottleneck</span>
                            <span className={`text-sm font-bold ${t.textMain}`}>{health.bottleneck}</span>
                        </div>
                    </div>

                    <div className="mt-6 p-4 rounded-2xl bg-slate-800/10 border border-slate-500/20 flex items-center gap-3">
                         <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                         <p className="text-sm font-bold text-slate-400 leading-relaxed italic">
                             "STRATEGY: {health.strategy}"
                         </p>
                    </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

