import { useState, useEffect } from 'react';
import { 
  Settings, Globe, Shield, Bell, 
  Mail, Save, RotateCcw, Palette,
  Lock, Eye, HardDrive, Cpu, 
  Server, Database, Loader2
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrgSettings() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState({
    site_name: 'Smart Skill & Live Learning',
    contact_email: 'admin@ssllm.com',
    maintenance_mode: false,
    registration_open: true,
    email_verification: true,
    default_language: 'en',
    theme_accent: '#F4A100'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/settings');
      if (res.data.success) {
        setSettings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await axiosInstance.patch('/admin/settings', settings);
      if (res.data.success) {
        toast.success('Platform settings updated');
      }
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: Cpu }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">Platform Settings</h1>
            <p className="text-[var(--color-text-muted)] mt-1 text-sm tracking-tight">Configure global organizational variables and security policies</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={fetchSettings}
               className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] transition-all"
             >
                <RotateCcw size={18}/>
             </button>
             <button 
               onClick={handleUpdate}
               disabled={saving}
               className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-all font-bold text-sm shadow-xl shadow-[var(--color-primary)]/20 disabled:opacity-50"
             >
                {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />}
                Apply Global Changes
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar Tabs */}
           <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
                    activeTab === tab.id 
                    ? 'bg-[var(--color-primary)] text-white shadow-lg' 
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
              
              <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-600/10 rounded-3xl">
                 <Server size={24} className="text-indigo-500 mb-3" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Instance Info</p>
                 <p className="text-xs text-[var(--color-text-primary)] font-bold mt-2">SSLLM Core v2.4.0</p>
                 <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Status: Operational</p>
              </div>
           </div>

           {/* Main Settings Panel */}
           <div className="lg:col-span-3 space-y-8 text-left">
              <AnimatePresence mode="wait">
                {activeTab === 'general' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-8 md:p-12 shadow-sm space-y-8"
                  >
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] px-1">Brand Identity Name</label>
                           <input 
                             type="text" 
                             value={settings.site_name}
                             onChange={(e) => setSettings({...settings, site_name: e.target.value})}
                             className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm focus:border-[var(--color-primary)] outline-none transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] px-1">System Support Email</label>
                           <input 
                             type="email" 
                             value={settings.contact_email}
                             onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                             className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm focus:border-[var(--color-primary)] outline-none transition-all"
                           />
                        </div>
                     </div>

                     <div className="pt-8 border-t border-[var(--color-border)] grid grid-cols-1 md:grid-cols-2 gap-12">
                        <SettingToggle 
                           title="Maintenance Mode" 
                           subtitle="Lock public access for repairs"
                           icon={HardDrive}
                           checked={settings.maintenance_mode}
                           onChange={(v) => setSettings({...settings, maintenance_mode: v})}
                        />
                        <SettingToggle 
                           title="Open Registration" 
                           subtitle="Allow new students to join"
                           icon={Globe}
                           checked={settings.registration_open}
                           onChange={(v) => setSettings({...settings, registration_open: v})}
                        />
                        <SettingToggle 
                           title="Email Verification" 
                           subtitle="Mandatory OTP for new accounts"
                           icon={Mail}
                           checked={settings.email_verification}
                           onChange={(v) => setSettings({...settings, email_verification: v})}
                        />
                        <div className="flex items-center justify-between p-6 bg-[var(--color-surface-2)]/30 rounded-3xl border border-[var(--color-border)]">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                 <Database size={20} />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-[var(--color-text-primary)]">Default Locale</p>
                                 <p className="text-[10px] text-[var(--color-text-muted)]">System-wide language</p>
                              </div>
                           </div>
                           <select 
                             value={settings.default_language}
                             onChange={(e) => setSettings({...settings, default_language: e.target.value})}
                             className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-[var(--color-primary)] outline-none"
                           >
                              <option value="en">English (US)</option>
                              <option value="hi">Hindi</option>
                              <option value="mr">Marathi</option>
                              <option value="fr">French</option>
                           </select>
                        </div>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-8 md:p-12 shadow-sm">
                     <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <Lock size={60} className="text-[var(--color-primary)] opacity-30" />
                        <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">Security Policies</h2>
                        <p className="text-[var(--color-text-muted)] max-w-sm mx-auto leading-relaxed italic">Manage firewall rules, password complexity requirements, and session timeout durations.</p>
                        <button className="px-6 py-2 border border-[var(--color-border)] text-xs font-bold rounded-xl text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]">Edit Advanced Policies</button>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-8 md:p-12 shadow-sm space-y-8">
                     <div className="space-y-6">
                        <h3 className="text-lg font-bold font-sora text-[var(--color-text-primary)]">Platform Branding</h3>
                        <div className="flex items-center gap-8">
                           <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl flex items-center justify-center bg-[var(--color-primary)] text-white text-3xl font-black">
                              SS
                           </div>
                           <button className="px-6 py-2.5 bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-xl font-bold text-sm hover:bg-white transition-all">
                              Upload Platform Logo
                           </button>
                        </div>
                     </div>
                     <div className="pt-8 border-t border-[var(--color-border)] space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Primary Identity Color</label>
                        <div className="flex items-center gap-4">
                           <input 
                              type="color" 
                              value={settings.theme_accent}
                              onChange={(e) => setSettings({...settings, theme_accent: e.target.value})}
                              className="w-16 h-16 rounded-2xl border-none outline-none cursor-pointer bg-transparent"
                           />
                           <div className="flex flex-col">
                              <p className="text-sm font-bold text-[var(--color-text-primary)] uppercase">{settings.theme_accent}</p>
                              <p className="text-[10px] text-[var(--color-text-muted)]">This will modify buttons, links, and highlights across the entire app.</p>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SettingToggle({ title, subtitle, icon: Icon, checked, onChange }) {
   return (
      <div className="flex items-center justify-between p-6 bg-[var(--color-surface-2)]/30 rounded-3xl border border-[var(--color-border)] hover:bg-[var(--color-surface-2)]/50 transition-all cursor-pointer group" onClick={() => onChange(!checked)}>
         <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${checked ? 'bg-[var(--color-primary)] text-white' : 'bg-slate-500/10 text-slate-500'}`}>
               <Icon size={20} />
            </div>
            <div>
               <p className="text-sm font-bold text-[var(--color-text-primary)]">{title}</p>
               <p className="text-[10px] text-[var(--color-text-muted)]">{subtitle}</p>
            </div>
         </div>
         <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${checked ? 'bg-[var(--color-primary)]' : 'bg-slate-300'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${checked ? 'left-7' : 'left-1'}`} />
         </div>
      </div>
   );
}
