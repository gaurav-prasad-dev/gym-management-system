import React from 'react';

export type BadgeVariant = 'active' | 'inactive' | 'expired' | 'pending' | 'frozen' | 'paid' | 'info';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'active',
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    active: 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]',
    inactive: 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]',
    expired: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
    pending: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    frozen: 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]',
    paid: 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]',
    info: 'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
