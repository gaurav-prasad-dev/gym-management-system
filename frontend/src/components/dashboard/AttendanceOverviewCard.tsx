import React from 'react';
import { Calendar, Users } from 'lucide-react';

export const AttendanceOverviewCard: React.FC = () => {
  const days = [
    { day: 'Mon', count: 48, pct: 80 },
    { day: 'Tue', count: 52, pct: 86 },
    { day: 'Wed', count: 45, pct: 75 },
    { day: 'Thu', count: 56, pct: 93 },
    { day: 'Fri', count: 50, pct: 83 },
    { day: 'Sat', count: 60, pct: 100 },
    { day: 'Sun', count: 32, pct: 53 },
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-[#DCECF7] text-[#346CB0] rounded-xl">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#303943]">
              Weekly Attendance Trend
            </h3>
            <p className="text-[11px] text-[#84909D]">Member check-in frequency</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-[#346CB0] bg-[#DCECF7]/70 px-2.5 py-0.5 rounded-full border border-[#A8C9ED]/50">
          This Week
        </span>
      </div>

      <div className="pt-2">
        <div className="flex items-end justify-between h-40 gap-2 sm:gap-3">
          {days.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[10px] font-semibold text-[#84909D]">{d.count}</span>
              <div
                className="w-full max-w-[34px] bg-[#A8C9ED] hover:bg-[#8BB4DF] rounded-t-xl transition-all duration-200 shadow-sm"
                style={{ height: `${d.pct}%` }}
              />
              <span className="text-[11px] font-medium text-[#84909D]">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-[#84909D]">
        <div className="flex items-center space-x-1.5">
          <Users className="w-3.5 h-3.5 text-[#346CB0]" />
          <span>Average: 49 members / day</span>
        </div>
        <span className="text-[#166534] font-bold">+8% vs last week</span>
      </div>
    </div>
  );
};
