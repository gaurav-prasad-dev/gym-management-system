import React from 'react';
import { LayoutDashboard, Dumbbell, LogOut, X, Users } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  userName?: string;
  userRole?: string;
  onNavigate?: (item: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeItem = 'dashboard',
  userName = 'System Owner',
  userRole = 'Owner',
  onNavigate,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#303943]/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-xl border border-white/70 shadow-glass flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:my-3 lg:ml-3 lg:rounded-3xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Gym Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#DCECF7] text-[#346CB0] rounded-2xl shadow-sm">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#303943] tracking-tight leading-none">
                IronPulse Gym
              </h1>
              <span className="text-[11px] text-[#84909D] font-medium">Management System</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#84909D] hover:text-[#303943] hover:bg-slate-100 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clean, Simple Navigation (Only Active Modules) */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#AAB4BE]">
            MENU
          </span>
          <div className="mt-2 space-y-1">
            <button
              onClick={() => onNavigate && onNavigate('dashboard')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 ${
                activeItem === 'dashboard'
                  ? 'bg-[#EBF3FB] text-[#303943] shadow-glass-sm'
                  : 'text-[#84909D] hover:text-[#303943] hover:bg-white/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#346CB0]" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate && onNavigate('members')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 ${
                activeItem === 'members'
                  ? 'bg-[#EBF3FB] text-[#303943] shadow-glass-sm'
                  : 'text-[#84909D] hover:text-[#303943] hover:bg-white/60'
              }`}
            >
              <Users className="w-4 h-4 text-[#346CB0]" />
              <span>Members</span>
            </button>
          </div>
        </nav>

        {/* User profile & Logout at bottom */}
        <div className="p-4 border-t border-slate-100/80 bg-white/40 rounded-b-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#E9E3F7] text-[#644EA6] font-bold text-xs flex items-center justify-center shrink-0">
                {userName.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-[#303943] truncate">{userName}</p>
                <p className="text-[10px] font-medium text-[#84909D]">{userRole}</p>
              </div>
            </div>
            <button
              title="Sign Out"
              className="p-1.5 rounded-xl text-[#84909D] hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
