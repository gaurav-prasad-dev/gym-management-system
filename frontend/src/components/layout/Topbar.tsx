import React from 'react';
import { Menu, Search, Bell, Database } from 'lucide-react';

interface TopbarProps {
  onToggleSidebar: () => void;
  dbStatus?: string;
  userName?: string;
  userRole?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  dbStatus = 'connected',
  userName = 'System Owner',
  userRole = 'Owner',
}) => {
  return (
    <header className="h-16 glass-nav rounded-2xl sticky top-3 z-30 flex items-center justify-between px-4 sm:px-6 mb-6">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-[#84909D] hover:text-[#303943] hover:bg-white/60 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Minimal Search Field */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#AAB4BE] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search members, receipts, plans..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/70 border border-slate-200/60 rounded-xl text-[#303943] placeholder-[#AAB4BE] focus:outline-none focus:ring-2 focus:ring-[#A8C9ED]/50 focus:bg-white transition-all shadow-glass-sm"
          />
        </div>
      </div>

      {/* Right: Live Neon DB Badge, Notifications, User Badge */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Neon Database Status Pill */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/70 border border-slate-200/50 text-[11px] shadow-glass-sm">
          <Database className="w-3.5 h-3.5 text-[#346CB0]" />
          <span className="text-[#84909D] font-medium">Postgres:</span>
          <span className="inline-flex items-center space-x-1 text-[#166534] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span className="capitalize">{dbStatus}</span>
          </span>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-[#84909D] hover:text-[#303943] hover:bg-white/60 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4F75E2]" />
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center space-x-2.5 pl-2 sm:pl-3 border-l border-slate-200/60">
          <div className="w-8 h-8 rounded-full bg-[#E9E3F7] text-[#644EA6] flex items-center justify-center font-bold text-xs shadow-sm">
            {userName.charAt(0)}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-[#303943] leading-tight">{userName}</p>
            <p className="text-[10px] text-[#84909D] font-medium">{userRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
