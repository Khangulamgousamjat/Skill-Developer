import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-28 rounded-xl bg-[var(--color-surface-2)]"/>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-48 rounded-xl bg-[var(--color-surface-2)]"/>
        <div className="h-48 rounded-xl bg-[var(--color-surface-2)]"/>
      </div>
    </div>
  );
}
