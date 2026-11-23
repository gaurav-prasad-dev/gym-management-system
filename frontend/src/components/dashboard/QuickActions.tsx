import React from 'react';
import { Button } from '../common/Button';
import { UserPlus, CalendarCheck, Receipt, Sparkles } from 'lucide-react';

export const QuickActions: React.FC = () => {
  return (
    <div className="glass-panel rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-[#DCECF7] text-[#346CB0] rounded-xl">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-[#303943]">
            Front Desk Quick Actions
          </h3>
        </div>
        <span className="text-[11px] text-[#84909D]">Frequent daily operations</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Button
          variant="primary"
          icon={<UserPlus className="w-4 h-4 text-white" />}
          className="justify-start py-3 px-4 rounded-2xl"
        >
          <div className="text-left">
            <p className="font-bold text-xs leading-none text-white">Register New Member</p>
            <p className="text-[10px] text-white/80 mt-1">Enroll member &amp; assign plan</p>
          </div>
        </Button>

        <Button
          variant="secondary"
          icon={<CalendarCheck className="w-4 h-4 text-[#166534]" />}
          className="justify-start py-3 px-4 rounded-2xl"
        >
          <div className="text-left">
            <p className="font-bold text-xs text-[#303943] leading-none">Mark Attendance</p>
            <p className="text-[10px] text-[#84909D] mt-1">Check-in via QR or mobile</p>
          </div>
        </Button>

        <Button
          variant="secondary"
          icon={<Receipt className="w-4 h-4 text-[#8C7611]" />}
          className="justify-start py-3 px-4 rounded-2xl"
        >
          <div className="text-left">
            <p className="font-bold text-xs text-[#303943] leading-none">Record Payment</p>
            <p className="text-[10px] text-[#84909D] mt-1">Collect dues &amp; issue receipt</p>
          </div>
        </Button>
      </div>
    </div>
  );
};
