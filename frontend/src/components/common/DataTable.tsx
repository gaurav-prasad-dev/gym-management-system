import React from 'react';
import {
  Search,
  SlidersHorizontal,
  FileDown,
  Activity,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  filterPlaceholder?: string;
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface StatPill {
  label: string;
  count: number | string;
  color?: 'blue' | 'green' | 'amber' | 'rose' | 'sky';
}

export interface DataTableProps<T> {
  title: string;
  subtitle?: string;
  statPills?: StatPill[];
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  totalCountText?: string;
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  columnFilters?: Record<string, string>;
  onColumnFilterChange?: (key: string, value: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
  };
  selectedIds?: string[];
  onSelectAll?: (checked: boolean) => void;
  onSelectRow?: (id: string, checked: boolean) => void;
  getRowId?: (row: T) => string;
  onExport?: () => void;
  extraHeaderActions?: React.ReactNode;
}

export function DataTable<T>({
  title,
  subtitle,
  statPills = [],
  primaryAction,
  totalCountText,
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No records found',
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  columnFilters = {},
  onColumnFilterChange,
  sortBy,
  sortOrder = 'desc',
  onSort,
  pagination,
  selectedIds = [],
  onSelectAll,
  onSelectRow,
  getRowId,
  onExport,
  extraHeaderActions,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const isFilterable = columns.some((c) => c.filterable);

  const getPillStyle = (color?: string) => {
    switch (color) {
      case 'green':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-rose-200/60';
      case 'sky':
        return 'bg-sky-50 text-sky-700 border-sky-200/60';
      default:
        return 'bg-blue-50 text-[#346CB0] border-blue-200/60';
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Page Header (Title + Subtitle & Right Pills + Primary Action) */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-[#303943] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#84909D] mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {statPills.map((pill, idx) => (
            <div
              key={idx}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-xs ${getPillStyle(
                pill.color
              )}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>{pill.label}</span>
              <span className="font-bold ml-1">{pill.count}</span>
            </div>
          ))}

          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#303943] hover:bg-[#1E252D] text-white text-xs font-bold shadow-glass transition-all duration-150 ml-auto lg:ml-0"
            >
              <Plus className="w-4 h-4" />
              <span>{primaryAction.label}</span>
            </button>
          )}

          {extraHeaderActions}
        </div>
      </div>

      {/* 2. Operational Action Toolbar (Matching image.png) */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/70 shadow-glass-sm p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left Toolbar: Total Badge, Search, Activity, Filters */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {totalCountText && (
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#EBF3FB] text-[#346CB0] text-xs font-bold border border-blue-100">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{totalCountText}</span>
            </div>
          )}

          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#84909D]" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-[#303943] placeholder-[#AAB4BE] focus:outline-none focus:ring-2 focus:ring-[#346CB0]/20 focus:border-[#346CB0] transition-all"
            />
          </div>

          <button
            type="button"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#84909D] hover:text-[#303943] bg-white border border-slate-200/70 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-[#346CB0]" />
            <span>Activity</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#84909D] hover:text-[#303943] bg-white border border-slate-200/70 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-[#346CB0]" />
            <span>Filters</span>
          </button>
        </div>

        {/* Right Toolbar: Export, Columns */}
        <div className="flex items-center space-x-2">
          {onExport && (
            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#84909D] hover:text-[#303943] bg-white border border-slate-200/70 hover:bg-slate-50 shadow-xs transition-colors"
            >
              <FileDown className="w-3.5 h-3.5 text-[#346CB0]" />
              <span>Export</span>
            </button>
          )}

          <button
            type="button"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#84909D] hover:text-[#303943] bg-white border border-slate-200/70 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#346CB0]" />
            <span>Columns</span>
          </button>
        </div>
      </div>

      {/* 3. The Data Table (Matching image.png structure) */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/70 shadow-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            {/* Header Row */}
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[#84909D] font-bold uppercase tracking-wider text-[11px]">
                {onSelectAll && (
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => onSelectAll(e.target.checked)}
                      className="rounded text-[#346CB0] focus:ring-0 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`py-3 px-4 ${col.width ? col.width : ''} ${
                      col.sortable ? 'cursor-pointer hover:text-[#303943] select-none' : ''
                    }`}
                    onClick={() => col.sortable && onSort && onSort(col.key)}
                  >
                    <div className="inline-flex items-center space-x-1.5">
                      <span>{col.label}</span>
                      {col.sortable && (
                        <ArrowUpDown
                          className={`w-3 h-3 transition-transform ${
                            sortBy === col.key
                              ? `text-[#346CB0] ${sortOrder === 'asc' ? 'rotate-180' : ''}`
                              : 'text-slate-300'
                          }`}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>

              {/* Column Filter Inputs Row (Exact pattern from image.png) */}
              {isFilterable && onColumnFilterChange && (
                <tr className="border-b border-slate-100/80 bg-white/40">
                  {onSelectAll && <th className="py-1.5 px-4" />}
                  {columns.map((col) => (
                    <th key={`filter-${col.key}`} className="py-1.5 px-3">
                      {col.filterable ? (
                        <input
                          type="text"
                          value={columnFilters[col.key] || ''}
                          onChange={(e) => onColumnFilterChange(col.key, e.target.value)}
                          placeholder={col.filterPlaceholder || col.label}
                          className="w-full px-2.5 py-1 bg-slate-50/60 border border-slate-200/60 rounded-lg text-[11px] font-normal text-[#303943] placeholder-[#AAB4BE] focus:outline-none focus:border-[#346CB0] focus:bg-white transition-all"
                        />
                      ) : null}
                    </th>
                  ))}
                </tr>
              )}
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100/70 text-[#303943]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + (onSelectAll ? 1 : 0)}
                    className="py-12 text-center text-[#84909D]"
                  >
                    <div className="inline-flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-[#346CB0] border-t-transparent rounded-full animate-spin" />
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onSelectAll ? 1 : 0)}
                    className="py-12 text-center text-[#84909D]"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => {
                  const rowId = getRowId ? getRowId(row) : (row as any).id || String(idx);
                  const isChecked = selectedIds.includes(rowId);

                  return (
                    <tr
                      key={rowId}
                      className="hover:bg-[#F4F9FD]/60 transition-colors group"
                    >
                      {onSelectRow && (
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => onSelectRow(rowId, e.target.checked)}
                            className="rounded text-[#346CB0] focus:ring-0 cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className="py-3 px-4 font-medium align-middle">
                          {col.render ? col.render(row, idx) : (row as any)[col.key] ?? '-'}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination Footer (Matching image.png: ROWS dropdown, range text, Prev/Next) */}
        {pagination && (
          <div className="border-t border-slate-100/80 px-4 py-3 bg-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#84909D]">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-[11px] uppercase tracking-wider text-[#AAB4BE]">
                  ROWS
                </span>
                <select
                  value={pagination.limit}
                  onChange={(e) => pagination.onLimitChange(Number(e.target.value))}
                  className="bg-white border border-slate-200/70 rounded-lg px-2 py-1 text-xs text-[#303943] font-semibold focus:outline-none focus:border-[#346CB0] cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <span>
                {pagination.total > 0
                  ? `${(pagination.page - 1) * pagination.limit + 1}-${Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )} of ${pagination.total} records`
                  : '0 records'}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-2.5 py-1 rounded-lg border border-slate-200/70 bg-white text-xs font-semibold text-[#303943] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 shadow-xs transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              {Array.from({ length: Math.min(pagination.totalPages || 1, 5) }).map((_, i) => {
                const pageNumber = i + 1;
                const isActive = pagination.page === pageNumber;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => pagination.onPageChange(pageNumber)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-[#303943] text-white shadow-xs'
                        : 'bg-white border border-slate-200/70 text-[#84909D] hover:bg-slate-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-2.5 py-1 rounded-lg border border-slate-200/70 bg-white text-xs font-semibold text-[#303943] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 shadow-xs transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
