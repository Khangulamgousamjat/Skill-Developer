import DashboardLayout from '../../components/layout/DashboardLayout';
import UnifiedMessages from '../../components/shared/UnifiedMessages';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ManagerMessages() {
  const { t } = useLanguage();
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">Manager Messages</h1>
        <p className="text-[var(--color-text-muted)] text-sm mt-1">Communicate with your team and Teachers</p>
      </div>
      <UnifiedMessages />
    </DashboardLayout>
  );
}

