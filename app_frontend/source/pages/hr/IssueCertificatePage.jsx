import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Award, Search, Users, ShieldCheck, Mail, Loader2, 
  Settings, Filter, Plus, ChevronRight, FileCheck 
} from 'lucide-react';

const IssueCertificatePage = () => {
  const { t, isDarkMode } = useAppContext();
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [issuing, setIssuing] = useState(false);
  
  const [form, setForm] = useState({
    internId: '',
    certificateType: 'Skill Mastery',
    skillId: '',
    projectId: '',
    skillsCovered: []
  });

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const response = await axios.get('/hr/interns');
      if (response.data.success) {
        setInterns(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load interns.');
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!form.internId) return toast.error('Please select an intern.');
    
    try {
      setIssuing(true);
      toast.loading('Generating Secure Credential...', { id: 'issue' });
      const response = await axios.post('/certificates/issue', form);
      if (response.data.success) {
        toast.success(`Success! Certificate issued to ${interns.find(i => i.id === form.internId)?.full_name}.`, { id: 'issue' });
        setForm({ ...form, internId: '' });
      }
    } catch (err) {
      toast.error('Error minting certificate.', { id: 'issue' });
    } finally {
      setIssuing(false);
    }
  };

  const filtered = interns.filter(i => 
    i.full_name.toLowerCase().includes(search.toLowerCase()) || 
    i.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Issue Credentials</h2>
          <p className={t.textMuted}>Mint and verify official certificates for NRC INNOVATE-X interns.</p>
        </div>
        <div className="flex gap-2">
           <button className={`p-2 rounded-xl border ${t.borderSoft} ${t.textMuted} hover:bg-[var(--color-surface)]/5`}>
             <Settings className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Search & Select */}
        <div className={`lg:col-span-1 rounded-3xl p-6 border ${t.card} ${t.borderSoft}`}>
          <div className="relative mb-6">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
             <input
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search by name or email..."
               className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:ring-amber-500/50 outline-none transition-all ${isDarkMode ? 'bg-[var(--color-surface)]/5 border-white/10 text-white' : 'bg-[var(--color-surface)] border-[var(--color-border)] text-slate-800'}`}
             />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {filtered.map(intern => (
              <button
                key={intern.id}
                onClick={() => setForm({ ...form, internId: intern.id })}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border text-left ${form.internId === intern.id ? (isDarkMode ? 'bg-amber-500/10 border-amber-500/50' : 'bg-amber-50 border-amber-200') : (isDarkMode ? 'bg-transparent border-transparent hover:bg-[var(--color-surface)]/5' : 'bg-transparent border-transparent hover:bg-[var(--color-surface-2)]')}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${form.internId === intern.id ? 'bg-amber-500 text-white' : (isDarkMode ? 'bg-[var(--color-surface)]/10 text-slate-400' : 'bg-[var(--color-surface-2)] text-slate-500')}`}>
                  {intern.full_name.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                   <p className={`text-sm font-bold truncate ${t.textMain}`}>{intern.full_name}</p>
                   <p className={`text-xs truncate ${t.textMuted}`}>{intern.department_name || 'Intern'}</p>
                </div>
                {form.internId === intern.id && <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />}
              </button>
            ))}
            {loading && <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500" /></div>}
            {filtered.length === 0 && !loading && <div className="text-center py-10 px-4"><p className="text-xs text-slate-500">No matching interns found.</p></div>}
          </div>
        </div>

        {/* Right: Issue Form */}
        <div className={`lg:col-span-2 rounded-3xl p-8 border ${t.card} ${t.borderSoft} flex flex-col items-center justify-center text-center relative overflow-hidden`}>
           <div className={`absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-[60px]`} />
           
           {!form.internId ? (
             <div className="space-y-4 max-w-sm">
                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                   <Award className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className={`text-xl font-bold ${t.textMain}`}>Ready to Mint?</h3>
                <p className={t.textMuted}>Select an intern from the left list to begin the secure credential issuance process.</p>
             </div>
           ) : (
             <form onSubmit={handleIssue} className="w-full max-w-lg space-y-6 text-left">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg">
                    {interns.find(i => i.id === form.internId)?.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold font-sora ${t.textMain}`}>
                      {interns.find(i => i.id === form.internId)?.full_name}
                    </h3>
                    <div className="flex items-center gap-2">
                       <Mail className="w-3.5 h-3.5 text-slate-500" />
                       <span className={`text-sm ${t.textMuted}`}>{interns.find(i => i.id === form.internId)?.email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className={`text-xs font-black uppercase tracking-widest ${t.textMuted}`}>Certificate Type</label>
                    <select
                      value={form.certificateType}
                      onChange={(e) => setForm({ ...form, certificateType: e.target.value })}
                      className={`w-full p-4 rounded-2xl text-sm border focus:ring-2 focus:ring-amber-500/50 outline-none transition-all ${isDarkMode ? 'bg-[var(--color-surface)]/5 border-white/10 text-white' : 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-slate-800'}`}
                    >
                      <option value="Skill Mastery">Skill Mastery Certificate</option>
                      <option value="Project Excellence">Project Excellence Certificate</option>
                      <option value="Module Completion">Module Completion Certificate</option>
                      <option value="Milestone Achievement">Milestone Achievement</option>
                      <option value="Full Internship Graduate">Program Graduation</option>
                    </select>
                  </div>

                  <div className={`p-6 rounded-2xl border bg-amber-500/5 border-amber-500/10`}>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center grow-0 shrink-0">
                         <FileCheck className="w-5 h-5 text-amber-500" />
                      </div>
                      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        Issuing this certificate will trigger an automated secure PDF generation with a unique <strong>QR Code</strong> for global verification. The intern will be notified instantly.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={issuing}
                  className="w-full py-4 bg-amber-500 text-slate-900 font-extrabold rounded-2xl shadow-xl hover:bg-amber-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg"
                >
                  {issuing ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Plus className="w-6 h-6" /> ISSUE CERTIFICATE</>}
                </button>
             </form>
           )}
        </div>
      </div>
    </div>
  );
};

export default IssueCertificatePage;

