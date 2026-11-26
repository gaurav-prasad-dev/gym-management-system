import React from 'react';

export type StatusVariant = 'active' | 'inactive' | 'archived' | 'pending' | 'booked' | 'refunded' | 'converted';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant, className = '' }) => {
  const normalized = (variant || status || '').toLowerCase();

  let dotColor = 'bg-emerald-500';
  let textColor = 'text-emerald-700';
  let bgColor = 'bg-emerald-50/80 border-emerald-200/60';

  if (normalized === 'active' || normalized === 'converted') {
    dotColor = 'bg-emerald-500';
    textColor = 'text-emerald-700';
    bgColor = 'bg-emerald-50/80 border-emerald-200/60';
  } else if (normalized === 'inactive' || normalized === 'pending') {
    dotColor = 'bg-amber-500';
    textColor = 'text-amber-700';
    bgColor = 'bg-amber-50/80 border-amber-200/60';
  } else if (normalized === 'archived' || normalized === 'refunded') {
    dotColor = 'bg-rose-500';
    textColor = 'text-rose-700';
    bgColor = 'bg-rose-50/80 border-rose-200/60';
  } else if (normalized === 'booked') {
    dotColor = 'bg-sky-500';
    textColor = 'text-sky-700';
    bgColor = 'bg-sky-50/80 border-sky-200/60';
  }

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-xs ${bgColor} ${textColor} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
      <span>{status}</span>
    </span>
  );
};
