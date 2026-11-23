import React from 'react';
import { Badge } from '../common/Badge';
import { Clock, UserPlus, CreditCard, AlertTriangle } from 'lucide-react';

export const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'registration',
      title: 'New Member Registered',
      description: 'Rahul Sharma joined on 6-Month Gold Plan',
      time: '12 mins ago',
      badge: 'Active',
      badgeVariant: 'active' as const,
      icon: UserPlus,
      iconStyle: 'bg-[#DCFCE7] text-[#166534]',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Membership Fee Collected',
      description: 'Received ₹ 5,000 via UPI from Amit Verma',
      time: '45 mins ago',
      badge: 'Paid',
      badgeVariant: 'paid' as const,
      icon: CreditCard,
      iconStyle: 'bg-[#DCECF7] text-[#346CB0]',
    },
    {
      id: 3,
      type: 'expiry',
      title: 'Membership Expiring Soon',
      description: 'Pooja Patel (Quarterly Plan) expires in 3 days',
      time: '2 hours ago',
      badge: 'Expires Soon',
      badgeVariant: 'pending' as const,
      icon: AlertTriangle,
      iconStyle: 'bg-[#FEF3C7] text-[#92400E]',
    },
    {
      id: 4,
      type: 'payment',
      title: 'Partial Payment Recorded',
      description: 'Vikram Singh paid ₹ 2,500 (₹ 1,500 due)',
      time: '4 hours ago',
      badge: 'Partial Due',
      badgeVariant: 'pending' as const,
      icon: CreditCard,
      iconStyle: 'bg-[#FEF3C7] text-[#92400E]',
    },
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-[#E9E3F7] text-[#644EA6] rounded-xl">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#303943]">
              Recent Gym Activity
            </h3>
            <p className="text-[11px] text-[#84909D]">Real-time operational events</p>
          </div>
        </div>
        <span className="text-[11px] text-[#84909D]">Live updates</span>
      </div>

      <div className="divide-y divide-slate-100">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="py-3.5 flex items-start justify-between first:pt-1 last:pb-1">
              <div className="flex items-start space-x-3 min-w-0">
                <div className={`p-2 rounded-xl shrink-0 ${act.iconStyle}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#303943] leading-tight truncate">{act.title}</p>
                  <p className="text-xs text-[#84909D] mt-0.5 truncate">{act.description}</p>
                  <span className="text-[10px] text-[#AAB4BE] mt-1 block">{act.time}</span>
                </div>
              </div>
              <Badge variant={act.badgeVariant} className="shrink-0 ml-2">
                {act.badge}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};
