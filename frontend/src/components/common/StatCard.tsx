import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  accent?: 'blue' | 'purple' | 'cyan' | 'yellow' | 'green';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  trend = 'neutral',
  accent = 'blue',
}) => {
  const accentStyles = {
    blue: 'bg-[#DCECF7] text-[#346CB0]',
    purple: 'bg-[#E9E3F7] text-[#644EA6]',
    cyan: 'bg-[#CDE9ED] text-[#1B6F7B]',
    yellow: 'bg-[#FFF9D2] text-[#8C7611]',
    green: 'bg-[#DCFCE7] text-[#166534]',
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white/90 shadow-glass hover:shadow-glass-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#84909D]">
          {title}
        </span>
        <div className={`p-2.5 rounded-2xl ${accentStyles[accent]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl sm:text-[26px] font-bold text-[#303943] tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              trend === 'up'
                ? 'bg-emerald-50 text-emerald-700'
                : trend === 'down'
                ? 'bg-red-50 text-red-700'
                : 'bg-slate-50 text-[#84909D]'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
};
