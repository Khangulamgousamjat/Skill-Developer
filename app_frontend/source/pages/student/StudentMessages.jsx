import DashboardLayout from '../../components/layout/DashboardLayout';
import UnifiedMessages from '../../components/shared/UnifiedMessages';
import { useLanguage } from '../../contexts/LanguageContext';

export default function StudentMessages() {
  const { t } = useLanguage();
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{t('messages')}</h1>
        <p className="text-[var(--color-text-muted)] text-sm mt-1">Communicate with experts and peers</p>
      </div>
      <UnifiedMessages />
    </DashboardLayout>
  );
}
