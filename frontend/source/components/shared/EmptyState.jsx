import React from 'react';
import { motion } from 'framer-motion';


const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  actionLabel, 
  onAction 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[var(--color-primary)]/10 blur-2xl rounded-full scale-150 animate-pulse" />
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] border border-[var(--color-border)] shadow-xl">
          <Icon size={48} className="text-[var(--color-primary)] opacity-80" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold font-sora text-[var(--color-text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--color-text-muted)] max-w-sm mb-8 leading-relaxed">
        {description}
      </p>

      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm tracking-wide shadow-lg shadow-[var(--color-primary)]/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          {action || actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
