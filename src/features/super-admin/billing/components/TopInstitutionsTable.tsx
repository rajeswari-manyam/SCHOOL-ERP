import React from 'react';
import { Download, SlidersHorizontal } from 'lucide-react';
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
import { PlanBadge } from './BillingBadges';
import type { TopInstitution } from '../types/billing.types';

interface TopInstitutionsTableProps {
  data?: TopInstitution[];
  isLoading: boolean;
  onViewAll: () => void;
}

const RANK_STYLES: Record<number, string> = {
  1: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  2: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
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
      <TableCell className="py-3.5">
        <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100 dark:bg-white/10" />
      </TableCell>
      <TableCell className="py-3.5">
        <div className="h-4 w-20 animate-pulse rounded bg-gray-100 dark:bg-white/10" />
      </TableCell>
      <TableCell className="py-3.5 pr-4">
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
  return (
    <Card className="rounded-2xl border-gray-100 bg-white dark:border-white/10 dark:bg-white/5">
      <CardHeader className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
        <div>
          <CardTitle className="text-sm text-gray-900 dark:text-white">
            Top Schools by Revenue
          </CardTitle>
          <CardDescription className="mt-0.5 text-[11px] text-gray-400">
            Analysis of highest contributing institutions
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
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
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="Download data"
          >
            <Download size={15} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-50/60 dark:bg-white/5">
              {['Rank', 'School', 'Plan', 'Monthly Value', '% of MRR'].map((heading) => (
                <TableHead
                  key={heading}
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500"
                >
                  {heading}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-50 dark:divide-white/5">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => <SkeletonRow key={index} />)
              : data?.map((inst, index) => {
                  const rank = index + 1;
                  const rankStyle =
                    RANK_STYLES[rank] ??
                    'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400';

                  return (
                    <TableRow
                      key={inst.id}
                      className="group hover:bg-gray-50/80 dark:hover:bg-white/5"
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
                            {inst.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {inst.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        <PlanBadge plan={inst.plan} />
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        ₹{inst.monthlyValue.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="py-3.5 px-4 pr-5 text-sm text-gray-500 dark:text-gray-400">
                        {inst.mrrPercent.toFixed(1)}%
                      </TableCell>
                    </TableRow>
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
