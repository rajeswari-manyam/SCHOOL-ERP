import React, { useState } from 'react';
import { SlidersHorizontal, Download, ChevronDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SchoolDetailPanel } from './SchoolsByStatusTable';
import type { TopSchoolRevenue, SubscriptionStatusFilter } from '../types/billing.types';

interface TopInstitutionsTableProps {
  data?: TopSchoolRevenue[];
  isLoading: boolean;
  onViewAll: () => void;
}

const RANK_STYLES: Record<number, string> = {
  1: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  2: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
};

const STATUS_BADGE: Record<SubscriptionStatusFilter, string> = {
  TRIAL: "bg-indigo-100 text-indigo-700",
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  DUE: "bg-yellow-100 text-yellow-700",
  OVERDUE: "bg-red-100 text-red-700",
  SUSPENDED: "bg-gray-200 text-gray-600",
  CANCELLED: "bg-gray-100 text-gray-500",
};

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell className="py-3.5 pl-4">
        <div className="h-6 w-6 animate-pulse rounded-full bg-gray-100 dark:bg-white/10" />
      </TableCell>
      <TableCell className="py-3.5 pl-3">
        <div className="h-4 w-40 animate-pulse rounded bg-gray-100 dark:bg-white/10" />
      </TableCell>
      <TableCell className="hidden sm:table-cell py-3.5">
        <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100 dark:bg-white/10" />
      </TableCell>
      <TableCell className="py-3.5">
        <div className="h-4 w-20 animate-pulse rounded bg-gray-100 dark:bg-white/10" />
      </TableCell>
      <TableCell className="hidden sm:table-cell py-3.5 pr-4">
        <div className="h-4 w-10 animate-pulse rounded bg-gray-100 dark:bg-white/10" />
      </TableCell>
    </TableRow>
  );
}

export const TopInstitutionsTable: React.FC<TopInstitutionsTableProps> = ({
  data,
  isLoading,
  onViewAll,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggleExpanded = (schoolId: string) =>
    setExpandedId((prev) => (prev === schoolId ? null : schoolId));

  const handleExport = () => {
    if (!data || data.length === 0) return;
    const header = ['Rank', 'School', 'Status', 'Total Revenue', 'Payments', 'Last Payment'];
    const rows = data.map((s, i) => [
      String(i + 1), s.schoolName, s.status, String(s.totalRevenue), String(s.paymentCount),
      s.lastPaymentDate ? new Date(s.lastPaymentDate).toLocaleDateString('en-IN') : '',
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `top-schools-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="rounded-2xl border-gray-100 bg-white dark:border-white/10 dark:bg-white/5">
      <CardHeader className="flex items-start justify-between gap-4 px-5 pt-5 pb-3 border-b-0">
        <div>
          <CardTitle className="text-sm text-gray-900 dark:text-white">
            Top Schools by Revenue
          </CardTitle>
          <CardDescription className="mt-0.5 text-[11px] text-gray-400">
            Analysis of highest contributing institutions
          </CardDescription>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="Filter institutions"
          >
            <SlidersHorizontal size={15} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            disabled={!data || data.length === 0}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-40"
            aria-label="Download CSV"
          >
            <Download size={15} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-[#EFF4FF] dark:bg-white/5">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Rank
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                School
              </TableHead>
              <TableHead className="hidden sm:table-cell text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Status
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Total Revenue
              </TableHead>
              <TableHead className="hidden sm:table-cell text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Payments
              </TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-50/50 dark:divide-white/5">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => <SkeletonRow key={index} />)
              : data?.map((school, index) => {
                  const rank = index + 1;
                  const rankStyle =
                    RANK_STYLES[rank] ??
                    'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400';
                  const isExpanded = expandedId === school.schoolId;

                  return (
                    <React.Fragment key={school.schoolId}>
                      <TableRow
                        onClick={() => toggleExpanded(school.schoolId)}
                        className="group cursor-pointer hover:bg-gray-50/80 dark:hover:bg-white/5"
                      >
                        <TableCell className="py-3.5 pl-4">
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${rankStyle}`}
                          >
                            {rank}
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5 pl-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-[11px] font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                              {school.schoolName.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {school.schoolName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${STATUS_BADGE[school.status]}`}>
                            {school.status.charAt(0) + school.status.slice(1).toLowerCase()}
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                          ₹{school.totalRevenue.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-3.5 px-4 text-sm text-gray-500 dark:text-gray-400">
                          {school.paymentCount}
                        </TableCell>
                        <TableCell className="py-3.5 pr-4">
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-gray-50/40 px-4 dark:bg-white/[0.02]">
                            <SchoolDetailPanel schoolId={school.schoolId} />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="border-t border-gray-100 px-5 py-3 dark:border-white/10">
        <Button
          variant="ghost"
          className="text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          onClick={onViewAll}
        >
          View All Institutions →
        </Button>
      </CardFooter>
    </Card>
  );
};
