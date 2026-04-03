import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, ShieldAlert, ArrowRight, 
  Loader2, ClipboardList, Target, UserCheck,
  AlertTriangle, Filter, Building2, ExternalLink
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

export const OnboardingPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [onboardingData, setOnboardingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchOnboardingStatus();
  }, []);

  const fetchOnboardingStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hr/onboarding-status');
      if (res.data.success) {
        setOnboardingData(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load onboarding tracking data');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = onboardingData.filter(item => {
    if (filter === 'Completed') return item.checklist_completed;
    if (filter === 'Pending') return !item.checklist_completed;
    return true;
  });

  const getProgress = (item) => {
    let count = 0;
    if (item.profile_completed) count++;
    if (item.id_verified) count++;
    if (item.bank_details_added) count++;
    if (item.it_setup_requested) count++;
    return (count / 4) * 100;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold font-sora flex items-center gap-3 ${t.textMain}`}>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-amber-500" />
            </div>
            Onboarding Command Center
          </h2>
          <p className={`text-sm ${t.textMuted} mt-1`}>Monitor real-time onboarding progression and IT equipment fulfillment across the organization.</p>
        </div>
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-[var(--color-surface)]/5 border border-white/5 shadow-inner">
          {['All', 'Pending', 'Completed'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-amber-500 text-slate-900 shadow-md' : 'text-slate-500 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
          <p className={`text-xs font-black uppercase tracking-widest ${t.textMuted}`}>Syncing checklist data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredData.length === 0 ? (
            <div className="py-20 text-center opacity-30">
               <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
               <p className="font-bold">No matching onboarding records found.</p>
            </div>
          ) : filteredData.map(item => (
            <div key={item.id} className={`p-8 rounded-[40px] border glare-hover transition-all ${t.card} ${t.borderSoft}`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                 {/* Intern Identity */}
                 <div className="flex items-center gap-6 min-w-[250px]">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface)]/5 flex items-center justify-center font-black text-amber-500 text-xl border border-white/10">
                       {item.full_name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold font-sora ${t.textMain}`}>{item.full_name}</h4>
                      <p className={`text-[11px] font-bold uppercase tracking-wider text-amber-500`}>{item.email}</p>
                    </div>
                 </div>

                 {/* Progress Metrics */}
                 <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                       <span>Checkpoint Completion</span>
                       <span className={item.checklist_completed ? 'text-emerald-500' : 'text-amber-500'}>{Math.round(getProgress(item))}%</span>
                    </div>
                    <div className="h-2 w-full bg-[var(--color-surface)]/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                       <div 
                          className={`h-full transition-all duration-1000 ${item.checklist_completed ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'}`} 
                          style={{ width: `${getProgress(item)}%` }}
                       />
                    </div>
                 </div>

                 {/* Checkpoints Grid */}
                 <div className="flex gap-4 items-center pl-6 lg:border-l border-white/5">
                    {[
                      { icon: UserCheck, status: item.profile_completed, label: 'Profile' },
                      { icon: ShieldAlert, status: item.id_verified, label: 'ID Verification' },
                      { icon: Target, status: item.bank_details_added, label: 'Bank Info' },
                      { icon: Building2, status: item.it_setup_requested, label: 'IT Setup' }
                    ].map((step, i) => (
                      <div key={i} className={`flex flex-col items-center gap-1.5 transition-all group cursor-help`} title={step.label}>
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${step.status ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-[var(--color-surface)]/5 border-white/10 text-slate-600 grayscale'}`}>
                            <step.icon className="w-5 h-5" />
                         </div>
                         <div className={`w-1 h-1 rounded-full ${step.status ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                      </div>
                    ))}
                 </div>

                 {/* Actions */}
                 <div className="flex items-center gap-2">
                    <button className="px-5 py-2.5 rounded-2xl bg-[var(--color-surface)]/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-lg active:scale-95">
                      Notify Manager
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Mini-Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Total Onboarding', value: onboardingData.length, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
           { label: 'Completion Rate', value: `${onboardingData.length ? Math.round((onboardingData.filter(i => i.checklist_completed).length / onboardingData.length) * 100) : 0}%`, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
           { label: 'Pending IT Assets', value: onboardingData.filter(i => !i.it_setup_requested).length, color: 'text-amber-500', bg: 'bg-amber-500/10' }
         ].map((stat, i) => (
           <div key={i} className={`p-6 rounded-[32px] border ${t.card} ${t.borderSoft} flex items-center justify-between`}>
              <div>
                 <p className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} mb-1 opacity-60`}>{stat.label}</p>
                 <p className={`text-2xl font-black ${t.textMain}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                 <Target className={`w-6 h-6 ${stat.color}`} />
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default OnboardingPage;

