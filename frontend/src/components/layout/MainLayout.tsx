import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export interface MainLayoutProps {
  children: React.ReactNode;
  dbStatus?: string;
  activeItem?: string;
  onNavigate?: (item: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  dbStatus,
  activeItem,
  onNavigate,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CDE9ED]/35 via-[#DCECF7]/30 to-[#E9E3F7]/35 text-[#303943] flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem={activeItem}
        onNavigate={(item) => {
          setSidebarOpen(false);
          if (onNavigate) onNavigate(item);
        }}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0 pr-0 lg:pr-4 py-3">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <Topbar
            onToggleSidebar={() => setSidebarOpen(true)}
            dbStatus={dbStatus}
          />
          <main className="space-y-6 pb-12">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
