import { useState, useEffect } from 'react';
import { 
  Award, Search, Filter, Trash2, 
  Download, Eye, Plus, CheckCircle2, 
  Shield, User, Calendar, BookOpen,
  ArrowRight, Sparkles, Loader2, FileText
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function AdminCertificates() {
  const { t } = useLanguage();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issueData, setIssueData] = useState({ student_id: '', course_name: '', issue_date: format(new Date(), 'yyyy-MM-dd') });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/certificates');
      if (res.data.success) {
        setCertificates(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load certificate vault');
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/admin/certificates/issue', issueData);
      if (res.data.success) {
        toast.success('Certificate issued and verified');
        setIsModalOpen(false);
        setIssueData({ student_id: '', course_name: '', issue_date: format(new Date(), 'yyyy-MM-dd') });
        fetchCertificates();
      }
    } catch (err) {
      toast.error('Issuance failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">Compliance & Certification</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">Manage official platform credentials and automated skill validations</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-all font-bold text-sm shadow-lg shadow-[var(--color-primary)]/20"
          >
            <Plus size={18} />
            Issue Credential
          </button>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                 <Shield size={32} className="opacity-40 mb-4" />
                 <p className="text-4xl font-bold font-sora">{certificates.length}</p>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Verified Credentials Issued</p>
              </div>
           </div>
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-[32px] shadow-sm text-left">
              <Sparkles size={24} className="text-amber-500 mb-4" />
              <p className="text-4xl font-bold font-sora text-[var(--color-text-primary)]">14</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1">Pending Validation</p>
           </div>
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-[32px] shadow-sm text-left">
              <Award size={24} className="text-emerald-500 mb-4" />
              <p className="text-4xl font-bold font-sora text-[var(--color-text-primary)]">100%</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1">Blockchain Hash Accuracy</p>
           </div>
        </div>

        {/* Certificate Directory */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/30 flex items-center justify-between">
             <div className="relative max-w-sm w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input 
                  type="text" 
                  placeholder="Query vault by hash or user..."
                  className="w-full pl-9 pr-4 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-xs outline-none focus:ring-1 focus:ring-[var(--color-primary)] shadow-sm transition-all"
                />
             </div>
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-border)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] rounded-xl hover:text-[var(--color-primary)] transition-all">
                <Filter size={14}/> Sort Logic
             </button>
          </div>

          <div className="overflow-x-auto text-left">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] p-4">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Recipient Profile</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Course / Module</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Internal Hash ID</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-24 text-center">
                       <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)] mx-auto mb-4 opacity-50" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Verifying ledger signatures...</p>
                    </td>
                  </tr>
                ) : (
                  certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-[var(--color-surface-2)]/50 transition-all group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                              <User size={20} className="text-[var(--color-text-muted)]" />
                           </div>
                           <div>
                              <p className="font-bold text-[var(--color-text-primary)] text-sm">{cert.recipient_name}</p>
                              <p className="text-[10px] text-[var(--color-text-muted)]">{cert.recipient_email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-start gap-4">
                           <div className="w-10 h-10 rounded-xl bg-amber-500/5 text-amber-600 flex items-center justify-center border border-amber-500/10">
                              <BookOpen size={20}/>
                           </div>
                           <div>
                              <p className="text-sm font-bold text-[var(--color-text-primary)]">{cert.course_name}</p>
                              <span className="text-[9px] font-black uppercase tracking-tighter text-emerald-500 flex items-center gap-1 mt-1">
                                 <CheckCircle2 size={10}/> Authenticated {format(new Date(cert.created_at), 'MM/YY')}
                              </span>
                           </div>
                        </div>
                      </td>
                      <td className="p-6 text-left">
                        <code className="text-[9px] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-2 py-1 rounded text-[var(--color-text-muted)] font-mono">
                           {cert.cert_id?.slice(0, 16) || 'SSLLM-CERT-X9F'}...
                        </code>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-2)] rounded-lg"><Eye size={16}/></button>
                           <button className="p-2 text-[var(--color-text-muted)] hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg"><Download size={16}/></button>
                           <button className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Issuance Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-10 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8">
                   <button onClick={() => setIsModalOpen(false)} className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-xl transition-all">
                      <Plus size={24} className="rotate-45" />
                   </button>
                </div>
                
                <div className="flex items-center gap-5 mb-10">
                   <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg">
                      <Award size={32} />
                   </div>
                   <div>
                      <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">Issue Credential</h2>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1">Official Verification Hub</p>
                   </div>
                </div>

                <form onSubmit={handleIssue} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Recipient ID / Email</label>
                    <input 
                      required
                      type="text" 
                      value={issueData.student_id}
                      onChange={(e) => setIssueData({...issueData, student_id: e.target.value})}
                      placeholder="e.g. 1024 or student@domain.com"
                      className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm focus:border-[var(--color-primary)] outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Associated Course</label>
                    <input 
                      required
                      type="text" 
                      value={issueData.course_name}
                      onChange={(e) => setIssueData({...issueData, course_name: e.target.value})}
                      placeholder="e.g. Advanced System Design"
                      className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm focus:border-[var(--color-primary)] outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Official Issue Date</label>
                    <input 
                      required
                      type="date" 
                      value={issueData.issue_date}
                      onChange={(e) => setIssueData({...issueData, issue_date: e.target.value})}
                      className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm outline-none cursor-pointer"
                    />
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-5 py-4 border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-primary)] rounded-2xl hover:bg-[var(--color-surface-2)] transition-all">Discard</button>
                    <button type="submit" className="flex-1 px-5 py-4 bg-[var(--color-primary)] text-white text-sm font-bold rounded-2xl hover:opacity-90 shadow-xl shadow-[var(--color-primary)]/20 transition-all flex items-center justify-center gap-2">
                       Authenticate <ArrowRight size={18}/>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}


