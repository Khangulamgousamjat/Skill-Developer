import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Settings, Save, ShieldCheck, Mail, Globe, 
  AlertTriangle, Loader2, ToggleLeft, ToggleRight,
  Database, BellRing
} from 'lucide-react';

const SettingsPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [settings, setSettings] = useState({
    maintenance_mode: false,
    allow_registration: true,
    require_approval: true,
    company_name: 'Gous org',
    contact_email: 'support@gousorg.com',
    max_file_size_mb: 10,
    session_timeout_mins: 60
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        if (res.data.success) {
          setSettings(prev => ({ ...prev, ...res.data.data }));
        }
      } catch (err) {
        toast.error('Failed to load platform settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/admin/settings', settings);
      toast.success('Platform settings updated');
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Platform Settings</h2>
          <p className={t.textMuted}>Global configuration for the Smart Skill & Live Learning Module ecosystem.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security & Access */}
        <div className={`p-6 rounded-2xl border ${t.card}`}>
          <h3 className={`font-bold mb-6 flex items-center gap-2 ${t.textMain}`}>
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            Security & Access
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-semibold text-sm ${t.textMain}`}>Maintenance Mode</p>
                <p className={`text-xs ${t.textMuted}`}>Restrict access to staff only</p>
              </div>
              <button 
                onClick={() => handleToggle('maintenance_mode')}
                className={`transition-colors ${settings.maintenance_mode ? 'text-amber-500' : 'text-slate-400'}`}
              >
                {settings.maintenance_mode ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className={`font-semibold text-sm ${t.textMain}`}>Allow Registrations</p>
                <p className={`text-xs ${t.textMuted}`}>New interns can sign up</p>
              </div>
              <button 
                onClick={() => handleToggle('allow_registration')}
                className={`transition-colors ${settings.allow_registration ? 'text-amber-500' : 'text-slate-400'}`}
              >
                {settings.allow_registration ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className={`font-semibold text-sm ${t.textMain}`}>Auto-Approval Bypass</p>
                <p className={`text-xs ${t.textMuted}`}>Disable manual approval queue</p>
              </div>
              <button 
                onClick={() => handleToggle('require_approval')}
                className={`transition-colors ${!settings.require_approval ? 'text-amber-500' : 'text-slate-400'}`}
              >
                {!settings.require_approval ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>

        {/* Branding & Contact */}
        <div className={`p-6 rounded-2xl border ${t.card}`}>
          <h3 className={`font-bold mb-6 flex items-center gap-2 ${t.textMain}`}>
            <Globe className="w-5 h-5 text-amber-500" />
            Branding & Support
          </h3>
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${t.textMuted}`}>Organization Name</label>
              <input 
                value={settings.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border outline-none ${t.input}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${t.textMuted}`}>Support Email</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${t.textMuted}`} />
                <input 
                  value={settings.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none ${t.input}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* System & Resources */}
        <div className={`p-6 rounded-2xl border ${t.card}`}>
          <h3 className={`font-bold mb-6 flex items-center gap-2 ${t.textMain}`}>
            <Database className="w-5 h-5 text-amber-500" />
            System Resources
          </h3>
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${t.textMuted}`}>Max Upload (MB)</label>
              <input 
                type="number"
                value={settings.max_file_size_mb}
                onChange={(e) => handleInputChange('max_file_size_mb', parseInt(e.target.value))}
                className={`w-full px-4 py-2.5 rounded-xl border outline-none ${t.input}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${t.textMuted}`}>Session Timeout (Mins)</label>
              <input 
                type="number"
                value={settings.session_timeout_mins}
                onChange={(e) => handleInputChange('session_timeout_mins', parseInt(e.target.value))}
                className={`w-full px-4 py-2.5 rounded-xl border outline-none ${t.input}`}
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className={`p-6 rounded-2xl border ${t.card}`}>
          <h3 className={`font-bold mb-6 flex items-center gap-2 ${t.textMain}`}>
            <BellRing className="w-5 h-5 text-amber-500" />
            Notification Rules
          </h3>
          <div className={`p-10 text-center border-2 border-dashed rounded-xl ${isDarkMode ? 'border-white/5' : 'border-[var(--color-border)]'}`}>
            <AlertTriangle className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-slate-700' : 'text-gray-200'}`} />
            <p className={`text-xs ${t.textMuted}`}>Advanced notification routing rules can be configured in Phase 5.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

