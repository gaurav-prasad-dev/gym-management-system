import React, { useState, useEffect } from 'react';
import { DataTable, ColumnDef, StatPill } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { MapPin, Eye, Edit2, Archive, PowerOff, CheckCircle2 } from 'lucide-react';

export interface MemberRecord {
  id: string;
  memberCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  alternatePhone?: string | null;
  email?: string | null;
  gender?: string | null;
  city?: string | null;
  state?: string | null;
  status: string;
  source?: string | null;
  occupation?: string | null;
  createdAt: string;
}

interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newThisMonth: number;
}

interface MembersListPageProps {
  onNavigateAdd: () => void;
  onNavigateDetail: (id: string) => void;
  onNavigateEdit: (id: string) => void;
}

export const MembersListPage: React.FC<MembersListPageProps> = ({
  onNavigateAdd,
  onNavigateDetail,
  onNavigateEdit,
}) => {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [stats, setStats] = useState<MemberStats>({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    newThisMonth: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State
  const [activeModalMember, setActiveModalMember] = useState<{
    id: string;
    name: string;
    action: 'activate' | 'deactivate' | 'archive';
  } | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/v1/members/stats');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStats(json.data);
        }
      }
    } catch (e) {
      console.error('Error fetching member stats:', e);
    }
  };

  // Fetch Members
  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sortBy,
        sortOrder,
      });

      if (search.trim()) params.append('search', search.trim());
      if (columnFilters.status) params.append('status', columnFilters.status);
      if (columnFilters.city) params.append('city', columnFilters.city);

      const res = await fetch(`/api/v1/members?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setMembers(json.data);
          if (json.pagination) {
            setTotalCount(json.pagination.total);
            setTotalPages(json.pagination.totalPages);
          }
        }
      }
    } catch (e) {
      console.error('Error fetching members:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [page, limit, search, columnFilters, sortBy, sortOrder]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleColumnFilterChange = (key: string, val: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: val }));
    setPage(1);
  };

  const handleConfirmAction = async () => {
    if (!activeModalMember) return;
    setModalLoading(true);
    try {
      let endpoint = `/api/v1/members/${activeModalMember.id}/${activeModalMember.action}`;
      const res = await fetch(endpoint, { method: 'PATCH' });
      if (res.ok) {
        setActiveModalMember(null);
        await Promise.all([fetchMembers(), fetchStats()]);
      }
    } catch (err) {
      console.error('Error performing member action:', err);
    } finally {
      setModalLoading(false);
    }
  };

  // Stat Pills matching image.png top-right counters
  const statPills: StatPill[] = [
    { label: 'Active', count: stats.activeMembers, color: 'green' },
    { label: 'Inactive', count: stats.inactiveMembers, color: 'amber' },
    { label: 'New This Month', count: stats.newThisMonth, color: 'sky' },
  ];

  // Table Columns matching image.png structure
  const columns: ColumnDef<MemberRecord>[] = [
    {
      key: 'srNo',
      label: 'Sr No',
      width: 'w-16',
      render: (_row, idx) => (
        <span className="text-[#84909D] font-semibold">
          {(page - 1) * limit + idx + 1}
        </span>
      ),
    },
    {
      key: 'memberCode',
      label: 'Member ID',
      sortable: true,
      filterable: true,
      filterPlaceholder: 'ID...',
      render: (row) => (
        <button
          onClick={() => onNavigateDetail(row.id)}
          className="font-bold text-[#346CB0] hover:underline hover:text-[#28558c] text-left"
        >
          {row.memberCode}
        </button>
      ),
    },
    {
      key: 'status',
      label: 'Member Status',
      sortable: true,
      filterable: true,
      filterPlaceholder: 'Status...',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'createdAt',
      label: 'Reg Date',
      sortable: true,
      filterable: false,
      render: (row) => {
        const d = new Date(row.createdAt);
        return (
          <span className="text-slate-600 font-medium">
            {d.toLocaleDateString('en-GB')}
          </span>
        );
      },
    },
    {
      key: 'fullName',
      label: 'Customer Name & City',
      sortable: true,
      filterable: true,
      filterPlaceholder: 'Customer...',
      render: (row) => {
        const initials = `${row.firstName?.[0] || ''}${row.lastName?.[0] || ''}`.toUpperCase();
        return (
          <div className="flex items-center space-x-3">
            {/* Avatar Circle with Initials (image.png style) */}
            <div className="w-8 h-8 rounded-full bg-[#303943] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {initials || 'M'}
            </div>
            <div>
              <button
                onClick={() => onNavigateDetail(row.id)}
                className="font-bold text-[#303943] hover:text-[#346CB0] text-left block leading-tight"
              >
                {row.fullName}
              </button>
              {row.city && (
                <div className="flex items-center space-x-1 text-[11px] text-[#84909D] mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{row.city}</span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'phone',
      label: 'Mobile No',
      sortable: true,
      filterable: true,
      filterPlaceholder: 'Mobile...',
      render: (row) => (
        <span className="font-semibold text-[#303943]">{row.phone}</span>
      ),
    },
    {
      key: 'alternatePhone',
      label: 'WhatsApp / Alt No',
      render: (row) => (
        <span className="text-[#84909D]">
          {row.alternatePhone ? row.alternatePhone : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 'w-28',
      render: (row) => (
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onNavigateDetail(row.id)}
            title="View Details"
            className="p-1.5 rounded-lg text-[#84909D] hover:text-[#346CB0] hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigateEdit(row.id)}
            title="Edit Member"
            className="p-1.5 rounded-lg text-[#84909D] hover:text-[#303943] hover:bg-slate-100 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          {row.status === 'active' ? (
            <button
              onClick={() =>
                setActiveModalMember({ id: row.id, name: row.fullName, action: 'deactivate' })
              }
              title="Deactivate Member"
              className="p-1.5 rounded-lg text-[#84909D] hover:text-amber-600 hover:bg-amber-50 transition-colors"
            >
              <PowerOff className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() =>
                setActiveModalMember({ id: row.id, name: row.fullName, action: 'activate' })
              }
              title="Activate Member"
              className="p-1.5 rounded-lg text-[#84909D] hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() =>
              setActiveModalMember({ id: row.id, name: row.fullName, action: 'archive' })
            }
            title="Archive Member"
            className="p-1.5 rounded-lg text-[#84909D] hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Archive className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        title="Members"
        subtitle="Active gym customer records, registrations, and status directory"
        statPills={statPills}
        primaryAction={{
          label: 'New Member',
          onClick: onNavigateAdd,
        }}
        totalCountText={`${totalCount} Total Members`}
        columns={columns}
        data={members}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search member, phone, email, ID..."
        columnFilters={columnFilters}
        onColumnFilterChange={handleColumnFilterChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        pagination={{
          page,
          limit,
          total: totalCount,
          totalPages,
          onPageChange: (p) => setPage(p),
          onLimitChange: (l) => {
            setLimit(l);
            setPage(1);
          },
        }}
        selectedIds={selectedIds}
        onSelectAll={(checked) =>
          setSelectedIds(checked ? members.map((m) => m.id) : [])
        }
        onSelectRow={(id, checked) =>
          setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((i) => i !== id)
          )
        }
        getRowId={(r) => r.id}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!activeModalMember}
        onClose={() => setActiveModalMember(null)}
        onConfirm={handleConfirmAction}
        isLoading={modalLoading}
        title={
          activeModalMember?.action === 'archive'
            ? 'Archive Member'
            : activeModalMember?.action === 'deactivate'
            ? 'Deactivate Member'
            : 'Activate Member'
        }
        message={
          activeModalMember?.action === 'archive'
            ? `Are you sure you want to archive '${activeModalMember?.name}'? Their profile will be hidden from active lists but historical billing and attendance records are permanently preserved.`
            : `Are you sure you want to change status of '${activeModalMember?.name}' to ${activeModalMember?.action === 'activate' ? 'active' : 'inactive'}?`
        }
        confirmLabel={
          activeModalMember?.action === 'archive'
            ? 'Archive'
            : activeModalMember?.action === 'deactivate'
            ? 'Deactivate'
            : 'Activate'
        }
        confirmVariant={
          activeModalMember?.action === 'archive'
            ? 'danger'
            : activeModalMember?.action === 'deactivate'
            ? 'warning'
            : 'primary'
        }
      />
    </>
  );
};
