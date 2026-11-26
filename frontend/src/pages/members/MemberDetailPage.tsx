import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import {
  ChevronLeft,
  Edit2,
  PowerOff,
  CheckCircle2,
  Archive,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  UserCheck,
  FileText,
  Clock,
  Shield,
  Dumbbell,
  Receipt,
} from 'lucide-react';

interface MemberDetail {
  id: string;
  memberCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  alternatePhone?: string | null;
  email?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  occupation?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  emergencyContactName?: string | null;
  emergencyContactRelation?: string | null;
  emergencyContactPhone?: string | null;
  source?: string | null;
  notes?: string | null;
  status: string;
  createdAt: string;
  createdBy?: { id: string; fullName: string } | null;
}

interface MemberDetailPageProps {
  memberId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export const MemberDetailPage: React.FC<MemberDetailPageProps> = ({
  memberId,
  onBack,
  onEdit,
}) => {
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'membership' | 'payments' | 'attendance' | 'notes' | 'activity'
  >('overview');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'activate' | 'deactivate' | 'archive'>('deactivate');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchMember = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/members/${memberId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setMember(json.data);
        }
      }
    } catch (e) {
      console.error('Error fetching member details:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [memberId]);

  const handleActionConfirm = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/v1/members/${memberId}/${modalAction}`, {
        method: 'PATCH',
      });
      if (res.ok) {
        setIsModalOpen(false);
        await fetchMember();
      }
    } catch (err) {
      console.error('Error executing status change:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-6 h-6 border-2 border-[#346CB0] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#84909D] font-medium">Loading member profile...</span>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="bg-white/80 rounded-3xl p-12 text-center space-y-4">
        <p className="text-sm font-semibold text-[#84909D]">Member profile not found</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#303943] text-white text-xs font-bold rounded-xl"
        >
          Return to Member Directory
        </button>
      </div>
    );
  }

  const initials = `${member.firstName?.[0] || ''}${member.lastName?.[0] || ''}`.toUpperCase();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'membership', label: 'Membership', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <Receipt className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <Clock className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity', icon: <CreditCard className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="space-y-6">
      {/* 1. Top Navigation & Action Banner */}
      <div className="flex items-center justify-between pb-2">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#84909D] hover:text-[#303943] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Member Directory</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(member.id)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-xs font-bold text-[#303943] shadow-xs transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#346CB0]" />
            <span>Edit Profile</span>
          </button>

          {member.status === 'active' ? (
            <button
              onClick={() => {
                setModalAction('deactivate');
                setIsModalOpen(true);
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100/80 text-xs font-bold text-amber-700 shadow-xs transition-colors"
            >
              <PowerOff className="w-3.5 h-3.5" />
              <span>Deactivate</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setModalAction('activate');
                setIsModalOpen(true);
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80 text-xs font-bold text-emerald-700 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Activate</span>
            </button>
          )}

          <button
            onClick={() => {
              setModalAction('archive');
              setIsModalOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100/80 text-xs font-bold text-rose-700 shadow-xs transition-colors"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archive</span>
          </button>
        </div>
      </div>

      {/* 2. Member Profile Header Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/70 shadow-glass p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-3xl bg-[#303943] text-white flex items-center justify-center font-bold text-xl shadow-glass">
            {initials}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl font-bold text-[#303943] tracking-tight">
                {member.fullName}
              </h2>
              <span className="px-2 py-0.5 rounded-lg bg-[#EBF3FB] text-[#346CB0] font-mono text-xs font-bold border border-blue-200/60">
                {member.memberCode}
              </span>
              <StatusBadge status={member.status} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#84909D]">
              <span className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-[#346CB0]" />
                <span className="font-semibold text-[#303943]">{member.phone}</span>
              </span>
              {member.email && (
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-[#346CB0]" />
                  <span>{member.email}</span>
                </span>
              )}
              {member.city && (
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{member.city}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right text-xs text-[#84909D] space-y-0.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="flex items-center sm:justify-end space-x-1">
            <Calendar className="w-3.5 h-3.5 text-[#346CB0]" />
            <span>
              Registered on {new Date(member.createdAt).toLocaleDateString('en-GB')}
            </span>
          </div>
          {member.createdBy && (
            <p className="text-[11px] text-slate-400">
              Added by <strong className="text-slate-600">{member.createdBy.fullName}</strong>
            </p>
          )}
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200/60 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-white text-[#303943] shadow-glass-sm border border-slate-200/60'
                  : 'text-[#84909D] hover:text-[#303943] hover:bg-white/50'
              }`}
            >
              <span className={isActive ? 'text-[#346CB0]' : 'text-[#84909D]'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card: Personal Details */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/70 shadow-glass p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#84909D] pb-2 border-b border-slate-100">
              Personal Information
            </h4>
            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div>
                <span className="text-[#84909D] block text-[11px]">First Name</span>
                <span className="font-bold text-[#303943]">{member.firstName}</span>
              </div>
              <div>
                <span className="text-[#84909D] block text-[11px]">Last Name</span>
                <span className="font-bold text-[#303943]">{member.lastName}</span>
              </div>
              <div>
                <span className="text-[#84909D] block text-[11px]">Gender</span>
                <span className="font-semibold text-[#303943] capitalize">
                  {member.gender || 'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-[#84909D] block text-[11px]">Date of Birth</span>
                <span className="font-semibold text-[#303943]">
                  {member.dateOfBirth
                    ? new Date(member.dateOfBirth).toLocaleDateString('en-GB')
                    : 'Not specified'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#84909D] block text-[11px]">Occupation</span>
                <span className="font-semibold text-[#303943]">
                  {member.occupation || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Contact Information */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/70 shadow-glass p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#84909D] pb-2 border-b border-slate-100">
              Contact & Address
            </h4>
            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div>
                <span className="text-[#84909D] block text-[11px]">Primary Mobile</span>
                <span className="font-bold text-[#303943]">{member.phone}</span>
              </div>
              <div>
                <span className="text-[#84909D] block text-[11px]">Alternate / WhatsApp</span>
                <span className="font-semibold text-[#303943]">
                  {member.alternatePhone || '—'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#84909D] block text-[11px]">Email Address</span>
                <span className="font-semibold text-[#303943]">{member.email || '—'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#84909D] block text-[11px]">Address</span>
                <span className="font-semibold text-[#303943]">
                  {[member.address, member.city, member.state, member.pincode]
                    .filter(Boolean)
                    .join(', ') || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Emergency Contact */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/70 shadow-glass p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#84909D] pb-2 border-b border-slate-100 flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-[#346CB0]" />
              <span>Emergency Contact</span>
            </h4>
            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div>
                <span className="text-[#84909D] block text-[11px]">Contact Person</span>
                <span className="font-bold text-[#303943]">
                  {member.emergencyContactName || '—'}
                </span>
              </div>
              <div>
                <span className="text-[#84909D] block text-[11px]">Relationship</span>
                <span className="font-semibold text-[#303943]">
                  {member.emergencyContactRelation || '—'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#84909D] block text-[11px]">Emergency Phone</span>
                <span className="font-bold text-[#303943]">
                  {member.emergencyContactPhone || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Source & Onboarding */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/70 shadow-glass p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#84909D] pb-2 border-b border-slate-100">
              Acquisition & Preferences
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#84909D] block text-[11px]">Member Source</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-slate-100 text-[#303943] font-bold text-xs mt-1">
                  {member.source || 'Walk-in'}
                </span>
              </div>
              <div>
                <span className="text-[#84909D] block text-[11px]">Notes</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {member.notes || 'No operational notes provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'membership' && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/70 shadow-glass p-12 text-center space-y-3">
          <div className="p-3 bg-[#EBF3FB] rounded-2xl text-[#346CB0] w-12 h-12 mx-auto flex items-center justify-center">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#303943]">No Active Membership Plan</h4>
          <p className="text-xs text-[#84909D] max-w-md mx-auto leading-relaxed">
            This member does not have an active membership plan yet. In Phase 4, you will be
            able to assign plans, set freeze periods, and process subscription renewals here.
          </p>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/70 shadow-glass p-12 text-center space-y-3">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 w-12 h-12 mx-auto flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#303943]">No Invoices or Payment History</h4>
          <p className="text-xs text-[#84909D] max-w-md mx-auto leading-relaxed">
            No payments have been recorded for this member. In Phase 6, all transaction ledgers,
            receipts, and outstanding balance summaries will be displayed here.
          </p>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/70 shadow-glass p-12 text-center space-y-3">
          <div className="p-3 bg-sky-50 rounded-2xl text-sky-600 w-12 h-12 mx-auto flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#303943]">No Attendance Logged</h4>
          <p className="text-xs text-[#84909D] max-w-md mx-auto leading-relaxed">
            Attendance check-ins, biometric scans, and QR code access will appear here once
            Phase 5 (Attendance Module) is active.
          </p>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/70 shadow-glass p-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#84909D]">
            Member Notes & Remarks
          </h4>
          <p className="text-xs text-[#303943] leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60">
            {member.notes || 'No specific notes recorded for this member.'}
          </p>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/70 shadow-glass p-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#84909D]">
            Account Activity History
          </h4>
          <div className="border-l-2 border-slate-200 ml-3 pl-4 space-y-4 text-xs">
            <div>
              <span className="font-bold text-[#303943]">Member Profile Created</span>
              <p className="text-[#84909D] text-[11px] mt-0.5">
                Initial registration completed with code {member.memberCode} on{' '}
                {new Date(member.createdAt).toLocaleString('en-GB')}.
              </p>
            </div>
            <div>
              <span className="font-bold text-[#303943]">Current Status</span>
              <p className="text-[#84909D] text-[11px] mt-0.5">
                Account status is currently <StatusBadge status={member.status} className="ml-1" />
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleActionConfirm}
        isLoading={isProcessing}
        title={
          modalAction === 'archive'
            ? 'Archive Member'
            : modalAction === 'deactivate'
            ? 'Deactivate Member'
            : 'Activate Member'
        }
        message={
          modalAction === 'archive'
            ? `Are you sure you want to archive ${member.fullName}? Historical data will be preserved.`
            : `Are you sure you want to change status to ${modalAction}?`
        }
        confirmLabel={
          modalAction === 'archive'
            ? 'Archive'
            : modalAction === 'deactivate'
            ? 'Deactivate'
            : 'Activate'
        }
        confirmVariant={
          modalAction === 'archive'
            ? 'danger'
            : modalAction === 'deactivate'
            ? 'warning'
            : 'primary'
        }
      />
    </div>
  );
};
