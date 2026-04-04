import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Skeleton from '../ui/Skeleton';
import { motion } from 'framer-motion';

export default function StatCard({
  title, value, icon: Icon, color = 'primary', trend, loading = false
}) {
  const { t } = useLanguage();
  
  const colors = {
    primary : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    success : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    warning : 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    danger  : 'bg-red-500/10 text-red-500 border-red-500/20',
    info    : 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    emerald : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-4 w-24 rounded-lg" />
            <Skeleton className="h-10 w-16 rounded-xl" />
          </div>
          <Skeleton className="w-14 h-14 rounded-2xl" />
        </div>
        <div className="mt-6">
          <Skeleton className="h-3 w-32 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
        {Icon && <Icon size={120} />}
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
            {title}
          </p>
          <p className="text-4xl font-bold font-sora text-[var(--color-text-primary)] tracking-tight">
            {value ?? '—'}
          </p>
          
          {trend !== undefined && (
            <div className={`mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg inline-flex border
              ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
              <span>{trend >= 0 ? '▲' : '▼'}</span>
              <span>{Math.abs(trend)}% {t('thisWeek')}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110 shadow-sm ${colors[color] || colors.primary}`}>
            <Icon size={28} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
