import { useState, useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { MetricGrid } from './components/dashboard/MetricGrid';
import { QuickActions } from './components/dashboard/QuickActions';
import { AttendanceOverviewCard } from './components/dashboard/AttendanceOverviewCard';
import { RecentActivity } from './components/dashboard/RecentActivity';
import { MembersListPage } from './pages/members/MembersListPage';
import { AddMemberPage } from './pages/members/AddMemberPage';
import { MemberDetailPage } from './pages/members/MemberDetailPage';
import { EditMemberPage } from './pages/members/EditMemberPage';
import { Calendar } from 'lucide-react';

interface HealthData {
  status: string;
  database: string;
  environment: string;
  timestamp: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

type ViewState = 'dashboard' | 'members_list' | 'members_add' | 'members_detail' | 'members_edit';

export default function App() {
  const [dbStatus, setDbStatus] = useState<string>('connecting');
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  useEffect(() => {
    const checkDb = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          const json: ApiResponse<HealthData> = await response.json();
          if (json.success && json.data) {
            setDbStatus(json.data.database);
          }
        }
      } catch {
        setDbStatus('error');
      }
    };
    checkDb();
  }, []);

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  const activeNav = currentView.startsWith('members') ? 'members' : 'dashboard';

  return (
    <MainLayout
      dbStatus={dbStatus}
      activeItem={activeNav}
      onNavigate={(item) => {
        if (item === 'members') setCurrentView('members_list');
        else setCurrentView('dashboard');
      }}
    >
      {/* View 1: Dashboard View */}
      {currentView === 'dashboard' && (
        <div className="space-y-6">
          {/* Dashboard Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
            <div>
              <h1 className="text-2xl sm:text-[26px] font-bold text-[#303943] tracking-tight">
                Gym Management Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-[#84909D] mt-0.5">
                Operational Overview &bull; IronPulse Fitness Club
              </p>
            </div>

            {/* Date Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-slate-200/50 text-xs text-[#303943] font-semibold shadow-glass-sm self-start sm:self-auto">
              <Calendar className="w-3.5 h-3.5 text-[#346CB0]" />
              <span>{todayFormatted}</span>
            </div>
          </div>

          {/* 1. Quick Operational Shortcuts */}
          <QuickActions onRegisterMember={() => setCurrentView('members_add')} />

          {/* 2. Core Operational Metrics Cards */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#84909D] mb-3">
              Key Operational Metrics
            </h2>
            <MetricGrid />
          </div>

          {/* 3. Weekly Attendance Trends & Recent Activity Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            <AttendanceOverviewCard />
            <RecentActivity />
          </div>
        </div>
      )}

      {/* View 2: Members Directory Listing (Matching image.png) */}
      {currentView === 'members_list' && (
        <MembersListPage
          onNavigateAdd={() => setCurrentView('members_add')}
          onNavigateDetail={(id) => {
            setSelectedMemberId(id);
            setCurrentView('members_detail');
          }}
          onNavigateEdit={(id) => {
            setSelectedMemberId(id);
            setCurrentView('members_edit');
          }}
        />
      )}

      {/* View 3: Add Member Registration (Matching image-1.png) */}
      {currentView === 'members_add' && (
        <AddMemberPage
          onCancel={() => setCurrentView('members_list')}
          onSuccess={(newId) => {
            setSelectedMemberId(newId);
            setCurrentView('members_detail');
          }}
        />
      )}

      {/* View 4: Member Profile Details */}
      {currentView === 'members_detail' && selectedMemberId && (
        <MemberDetailPage
          memberId={selectedMemberId}
          onBack={() => setCurrentView('members_list')}
          onEdit={(id) => {
            setSelectedMemberId(id);
            setCurrentView('members_edit');
          }}
        />
      )}

      {/* View 5: Edit Member Profile */}
      {currentView === 'members_edit' && selectedMemberId && (
        <EditMemberPage
          memberId={selectedMemberId}
          onCancel={() => setCurrentView('members_detail')}
          onSuccess={() => setCurrentView('members_detail')}
        />
      )}
    </MainLayout>
  );
}
