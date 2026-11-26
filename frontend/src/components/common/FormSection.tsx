import React from 'react';
import { RotateCcw } from 'lucide-react';

interface FormSectionProps {
  icon?: React.ReactNode;
  title: string;
  onReset?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  icon,
  title,
  onReset,
  children,
  className = '',
}) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/70 shadow-glass p-5 sm:p-7 space-y-6 ${className}`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          {icon && <span className="text-[#346CB0]">{icon}</span>}
          <h3 className="text-sm sm:text-base font-bold text-[#303943] tracking-tight">
            {title}
          </h3>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#84909D] hover:text-[#303943] hover:bg-slate-100 transition-colors border border-slate-200/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Section</span>
          </button>
        )}
      </div>

      {/* Form Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {children}
      </div>
    </div>
  );
};
