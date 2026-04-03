import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Award, Download, ExternalLink, Loader2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

export default function MyCertificates() {
  const { t } = useLanguage();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/student/certificates');
      setCertificates(res.data.data || []);
    } catch (err) {
      toast.error(t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">
            {t('myCertificates')}
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            {t('certificatesDescription') || "Your earned credentials and verified skills"}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
          </div>
        ) : certificates.length === 0 ? (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-[var(--color-surface-2)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Award size={40} className="text-[var(--color-text-muted)] opacity-20" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] font-sora mb-2">
              {t('noCertificatesYet') || "No certificates earned yet"}
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-sm mx-auto mb-8">
              {t('earnCertificatesMsg') || "Complete courses and projects to earn verified certificates."}
            </p>
            <a 
              href="/student/projects" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
            >
              {t('exploreCourses') || "Explore Projects"}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm hover:border-[var(--color-primary)] transition-all">
                {/* Certificate Preview Card */}
                <div className="aspect-[1.4/1] bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] flex items-center justify-center p-8 relative">
                   <div className="absolute inset-4 border-2 border-[var(--color-primary)]/10 rounded-lg pointer-events-none" />
                   <ShieldCheck className="text-[var(--color-primary)] opacity-10 absolute inset-0 m-auto w-32 h-32" />
                   <div className="text-center relative z-10">
                      <Award size={48} className="text-[var(--color-accent)] mx-auto mb-4" />
                      <h3 className="font-bold text-[var(--color-text-primary)] font-sora leading-tight">{cert.title || 'SSLLM Certificate'}</h3>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-2 uppercase tracking-[0.2em]">{cert.certificate_type}</p>
                   </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Issued Date</p>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{new Date(cert.issued_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Code</p>
                      <p className="text-[10px] font-mono text-[var(--color-text-primary)]">{cert.verification_code}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <a 
                      href={cert.pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-lg text-xs font-bold hover:bg-black/10 transition-all border border-[var(--color-border)]"
                    >
                      <Download size={14} />
                      Download
                    </a>
                    <a 
                      href={`/verify/${cert.verification_code}`} 
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-[var(--color-primary)] text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all"
                    >
                      <ExternalLink size={14} />
                      Verify
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

