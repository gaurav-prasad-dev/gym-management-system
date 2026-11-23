import { useState, useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { MetricGrid } from './components/dashboard/MetricGrid';
import { QuickActions } from './components/dashboard/QuickActions';
import { AttendanceOverviewCard } from './components/dashboard/AttendanceOverviewCard';
import { RecentActivity } from './components/dashboard/RecentActivity';
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

export default function App() {
  const [dbStatus, setDbStatus] = useState<string>('connecting');

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

  return (
    <MainLayout dbStatus={dbStatus}>
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
      <QuickActions />

      {/* 2. Core 7 Statistics Cards */}
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
    </MainLayout>
  );
}
