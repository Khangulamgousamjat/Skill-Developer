export default function StatCard({
  title, value, icon: Icon, color = 'primary', trend
}) {
  const colors = {
    primary : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
    success : 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
    warning : 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
    danger  : 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]',
    info    : 'bg-[var(--color-info)]/10 text-[var(--color-info)]',
  };

  return (
    <div className="bg-[var(--color-surface)]
                    border border-[var(--color-border)]
                    rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--color-text-muted)] font-medium group-hover:text-[var(--color-primary)] transition-colors">{title}</p>
          <p className="text-3xl font-bold font-sora mt-2 text-[var(--color-text-primary)]">
            {value ?? '—'}
          </p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded-full inline-flex
              ${trend >= 0 ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'}`}>
              <span>{trend >= 0 ? '▲' : '▼'}</span>
              <span>{Math.abs(trend)}% this week</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 duration-300 ${colors[color] || colors.primary}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
