import React from "react";
import type { FeeStats } from "../types/fees.types";
import { formatCurrency } from "../utils/Fee.utils";

interface FeeStatCardsProps {
  stats: FeeStats;
}

export function FeeStatCards({ stats }: FeeStatCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {/* Alert - Outstanding */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">!</span>
          <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Alert</span>
        </div>
        <div className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalOutstanding)}</div>
        <div className="text-xs text-gray-500 mt-1">
          <span className="text-red-600 font-semibold">{stats.pendingStudents} students</span> with dues pending
        </div>
      </div>

      {/* Progress - Collected */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Progress</span>
        </div>
        <div className="text-xl font-bold text-gray-900">{formatCurrency(stats.collectedThisMonth)}</div>
        <div className="mt-2">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${stats.collectedPercent}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">{stats.collectedPercent}% of expected revenue</div>
        </div>
      </div>

      {/* Active - Reminders */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-white text-xs">💬</span>
          <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Active</span>
        </div>
        <div className="text-xl font-bold text-gray-900">{stats.remindersToday}</div>
        <div className="text-xs text-gray-500 mt-1">
          via <span className="text-green-600 font-semibold">WhatsApp</span> at {stats.reminderTime}
        </div>
      </div>

      {/* Priority - Severely Overdue */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">⏰</span>
          <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Priority</span>
        </div>
        <div className="text-xl font-bold text-gray-900">{stats.severelyOverdue}</div>
        <div className="text-xs text-gray-500 mt-1">Needs immediate admin action</div>
      </div>
    </div>
  );
}