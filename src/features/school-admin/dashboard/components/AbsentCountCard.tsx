import type { ReactNode } from "react";
import type { AttendanceSummary, FeeSummary, AdmissionsSummary } from "../types/dashboard.types";
import { formatRate, formatWeeklyDelta } from "../utils/formatters.ts";

interface StatCardProps {
  label: string;
  children: ReactNode;
  subtext: string;
  action?: { label: string; onClick?: () => void; colorClass?: string };
}

function StatCard({ label, children, subtext, action }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">{label}</p>
      <div className="flex items-end gap-2">{children}</div>
      <p className="text-xs text-gray-400 mt-1">{subtext}</p>
      {action && (
        <button
          onClick={action.onClick}
          className={`text-xs font-medium mt-3 hover:underline ${action.colorClass ?? "text-blue-600"}`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

interface AbsentCountCardProps {
  attendance: AttendanceSummary;
  onViewDetails?: () => void;
}

export function AbsentCountCard({ attendance, onViewDetails }: AbsentCountCardProps) {
  return (
    <StatCard
      label="Students Present Today"
      subtext={`${attendance.absentCount} absent across ${attendance.classCount} classes`}
      action={{ label: "View Details →", onClick: onViewDetails }}
    >
      <span className="text-3xl font-bold text-gray-900">{attendance.present}/{attendance.total}</span>
      <span className="mb-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
        {formatRate(attendance.rate)} RATE
      </span>
    </StatCard>
  );
}

interface ClassesMarkedCardProps {
  attendance: AttendanceSummary;
  onSendReminder?: () => void;
}

export function ClassesMarkedCard({ attendance, onSendReminder }: ClassesMarkedCardProps) {
  const pending = attendance.totalClasses - attendance.classCount;
  return (
    <StatCard
      label="Classes Marked Today"
      subtext={`${pending} classes pending`}
      action={{
        label: "Send Reminders →",
        onClick: onSendReminder,
        colorClass: "text-orange-500",
      }}
    >
      <span className="text-3xl font-bold text-gray-900">{attendance.classCount}/{attendance.totalClasses}</span>
      <span className="mb-1 text-orange-500 text-xs font-semibold">● Action needed</span>
    </StatCard>
  );
}

interface FeeCollectionCardProps {
  fees: FeeSummary;
  onViewDefaulters?: () => void;
}

export function FeeCollectionCard({ fees, onViewDefaulters }: FeeCollectionCardProps) {
  return (
    <StatCard
      label="Collected This Month"
      subtext={`${fees.totalOutstanding} still pending`}
      action={{ label: "View Defaulters →", onClick: onViewDefaulters }}
    >
      <span className="text-3xl font-bold text-gray-900">{fees.collected}</span>
      <span className="mb-1 text-gray-400 text-xs">{fees.paidPercent}% PAID</span>
    </StatCard>
  );
}

interface AdmissionsThisWeekCardProps {
  admissions: AdmissionsSummary;
  onViewPipeline?: () => void;
}

export function AdmissionsThisWeekCard({ admissions, onViewPipeline }: AdmissionsThisWeekCardProps) {
  return (
    <StatCard
      label="Admissions This Week"
      subtext={`${admissions.pendingFollowUp} pending follow-up`}
      action={{ label: "View Pipeline →", onClick: onViewPipeline }}
    >
      <span className="text-3xl font-bold text-gray-900">{admissions.weeklyCount}</span>
      <span className="mb-1 text-green-600 text-xs font-semibold">{formatWeeklyDelta(admissions.weeklyDelta)}</span>
    </StatCard>
  );
}
