import React from 'react';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-[var(--color-border)]/50 ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
