import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2 gap-2',
    lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#4F75E2] text-white hover:bg-[#4367D4] active:scale-[0.99] focus:ring-[#4F75E2]/40 shadow-sm shadow-[#4F75E2]/20',
    secondary:
      'bg-white text-[#303943] hover:bg-[#F7F9FC] border border-slate-200/80 active:scale-[0.99] focus:ring-slate-300 shadow-glass-sm',
    outline:
      'border border-slate-200/80 text-[#303943] hover:bg-[#EBF3FB]/50 focus:ring-[#A8C9ED]/50',
    danger:
      'bg-red-50 text-red-600 border border-red-200/80 hover:bg-red-100/80 active:scale-[0.99] focus:ring-red-300 shadow-sm',
    ghost:
      'text-[#84909D] hover:text-[#303943] hover:bg-[#EBF3FB]/60 focus:ring-slate-300',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
