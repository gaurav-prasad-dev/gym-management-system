import React from 'react';
import { StatCard } from '../common/StatCard';
import {
  Users,
  UserCheck,
  UserX,
  CalendarCheck,
  IndianRupee,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export const MetricGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <StatCard
        title="Total Members"
        value="128"
        icon={<Users className="w-5 h-5" />}
        change="+12 this month"
        trend="up"
        accent="blue"
      />
      <StatCard
        title="Active Members"
        value="114"
        icon={<UserCheck className="w-5 h-5" />}
        change="89% active rate"
        trend="up"
        accent="green"
      />
      <StatCard
        title="Expired Members"
        value="14"
        icon={<UserX className="w-5 h-5" />}
        change="Needs renewal"
        trend="down"
        accent="yellow"
      />
      <StatCard
        title="Today's Attendance"
        value="42"
        icon={<CalendarCheck className="w-5 h-5" />}
        change="Peak hours now"
        trend="neutral"
        accent="cyan"
      />
      <StatCard
        title="Today's Collection"
        value="₹ 8,500"
        icon={<IndianRupee className="w-5 h-5" />}
        change="4 transactions"
        trend="up"
        accent="green"
      />
      <StatCard
        title="Pending Payments"
        value="₹ 14,200"
        icon={<AlertCircle className="w-5 h-5" />}
        change="6 overdue members"
        trend="down"
        accent="yellow"
      />
      <StatCard
        title="Monthly Revenue"
        value="₹ 1,84,500"
        icon={<TrendingUp className="w-5 h-5" />}
        change="+15.8% vs last month"
        trend="up"
        accent="purple"
      />
    </div>
  );
};
