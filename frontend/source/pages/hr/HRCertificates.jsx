import React, { useState, useEffect } from 'react';
import { 
  Award, Search, Filter, Download, 
  ExternalLink, User, Calendar, ShieldCheck,
  Loader2, ArrowRight, FileText, CheckCircle2
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function HRCertificates() {
  const { t } = useLanguage();
  const isDarkMode = useSelector((s) => s.ui.theme === 'dark');
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hr/certificates');
      if (res.data.success) {
        setCerts(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load certificates registry');
    } finally {
      setLoading(false);
    }
  };

  const filtered = certs.filter(cert => {
    const intern = cert.intern_name || '';
    const code = cert.verification_code || '';
    const matchesSearch = intern.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || cert.certificate_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const types = ['All', ...new Set(certs.map(c => c.certificate_type).filter(Boolean))];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-500" />
              </div>
              Verified Certificates
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">Registry of all digital credentials and Teacher recognitions issued</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-2">
                <ShieldCheck size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Global Verification Active</span>
             </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input 
              type="text"
              placeholder="Search by intern name or certificate code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm focus:ring-2 focus:ring-[var(--color-primary)]/50 outline-none transition-all text-[var(--color-text-primary)]"
            />
          </div>
          <div className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-3">
            <Filter className="w-4 h-4 text-[var(--color-text-muted)]" />
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-[var(--color-text-primary)] outline-none cursor-pointer"
            >
              {types.map(type => <option key={type} value={type} className="bg-[var(--color-surface)]">{type}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">Verifying certificate registry...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem]">
             <Award className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-muted)] opacity-20" />
             <h3 className="text-xl font-bold text-[var(--color-text-primary)]">No certificates issued</h3>
             <p className="text-[var(--color-text-muted)] mt-1">Start issuing credentials through student evaluations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map((cert) => (
              <div key={cert.id} className="group relative p-8 rounded-[2.5rem] border bg-[var(--color-surface)] border-[var(--color-border)] hover:border-amber-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-amber-500/5 overflow-hidden">
                 {/* Design Accents */}
                 <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
                 
                 <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 flex items-center justify-center border border-amber-500/20 shadow-inner">
                       <Award className="w-7 h-7 text-amber-500" />
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-1">Verify Hash</span>
                       <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          {cert.verification_code}
                       </span>
                    </div>
                 </div>

                 <div className="mb-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-amber-500 mb-2">{cert.certificate_type}</h3>
                    <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)] mb-4">{cert.intern_name}</h2>
                    
                    <div className="space-y-3">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-xs font-bold text-[var(--color-text-secondary)]">{cert.skill_or_project}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <Calendar size={14} className="text-[var(--color-text-muted)]" />
                          <span className="text-xs text-[var(--color-text-muted)]">
                             Issued {new Date(cert.issued_at).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                       </div>
                       <div className="flex items-center gap-3">
                          <User size={14} className="text-[var(--color-text-muted)]" />
                          <span className="text-xs text-[var(--color-text-muted)]">{cert.department_name || 'Organization Wide'}</span>
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-[var(--color-border)] flex items-center gap-4">
                    <a 
                       href={cert.pdf_url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex-1 py-3.5 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all"
                    >
                       <FileText size={14} /> View Document
                    </a>
                    <button 
                       onClick={() => window.open(`/verify-certificate/${cert.verification_code}`, '_blank')}
                       className="p-3.5 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-amber-500 transition-all hover:bg-amber-500/5"
                       title="Verification Link"
                    >
                       <ExternalLink size={18} />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
