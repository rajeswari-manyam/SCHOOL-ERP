import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import type { WAConnection, WATemplate, NotificationSettings } from "../types/settings.types";

interface Props {
  connection: WAConnection;
  templates: WATemplate[];
  notifications: NotificationSettings;
  onToggleNotification: (key: keyof NotificationSettings, value: boolean) => void;
}

const TemplateStatusBadge: React.FC<{ status: WATemplate["status"] }> = ({ status }) => {
  const styles: Record<string, string> = {
    APPROVED: "bg-green-100 text-green-700",
    PENDING:  "bg-orange-100 text-orange-700",
    REJECTED: "bg-red-100 text-red-700",
  };
  const dotColor: Record<string, string> = {
    APPROVED: "bg-green-500",
    PENDING:  "bg-orange-500",
    REJECTED: "bg-red-500",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor[status]}`} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
};

const NOTIFICATION_ITEMS: { key: keyof NotificationSettings; label: string; description: string }[] = [
  { key: "attendanceAlerts",             label: "Attendance Alerts",               description: "Send instant WhatsApp messages when a student is absent." },
  { key: "feeReminders",                 label: "Fee Reminders",                   description: "Automatic reminders based on payment schedules." },
  { key: "attendanceReminderToTeachers", label: "Attendance Reminder to Teachers", description: "Notify faculty to complete attendance logs by 10:00 AM." },
  { key: "monthlyReportToPrincipal",     label: "Monthly Report to Principal",     description: "Aggregate performance and financial reports on 1st of month." },
  { key: "broadcastMessaging",           label: "Broadcast Messaging",             description: "Enable manual mass messaging for urgent circulars." },
  { key: "newEnquiryNotification",       label: "New Enquiry Notification",        description: "Alert admission head when a new website form is submitted." },
];

export const WhatsAppTab: React.FC<Props> = ({
  connection, templates, notifications, onToggleNotification,
}) => {
  const usagePercent = Math.min(100, Math.round((connection.monthlyUsed / connection.monthlyLimit) * 100));

  return (
    <div className="space-y-4 sm:space-y-6 w-full">

      {/* ── Connection Card ── */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl border-2 border-blue-200 p-4 sm:p-6 lg:p-8 shadow-lg shadow-blue-100/50">

        {/* Header: title + button wrap on mobile */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              WhatsApp Connection
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  connection.connected
                    ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
                    : "bg-red-500 shadow-lg shadow-red-500/50"
                }`}
              />
              <span className={`text-sm font-bold ${connection.connected ? "text-emerald-600" : "text-red-600"}`}>
                {connection.connected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="flex-shrink-0 px-4 py-2 sm:px-5 sm:py-3 rounded-xl text-sm font-bold text-blue-600"
          >
            Manage Account
          </Button>
        </div>

        {/* Meta fields: 1 col → 3 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">WhatsApp Number</p>
            <p className="text-sm font-medium text-gray-900 break-all">{connection.whatsappNumber}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Account Name</p>
            <p className="text-sm font-medium text-gray-900">{connection.accountName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">360Dialog ID</p>
            <p className="text-sm font-medium text-gray-900 break-all">{connection.dialogId}</p>
          </div>
        </div>

        {/* Usage bar */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
            <p className="text-sm font-medium text-gray-700">Monthly Message Limit</p>
            <p className="text-sm font-semibold text-gray-900 tabular-nums">
              {connection.monthlyUsed.toLocaleString()} / {connection.monthlyLimit.toLocaleString()}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">Usage resetting in {connection.resetInDays} days</p>
        </div>
      </div>

      {/* ── Active Templates Card ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Active Templates</h2>
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
              {templates.length} TEMPLATES
            </span>
          </div>
          <Button
            variant="ghost"
            className="text-indigo-600 font-medium flex items-center gap-1 text-sm px-0 sm:px-3"
          >
            <span className="text-lg leading-none">⊕</span> New Template
          </Button>
        </div>

        {/* Scrollable table wrapper */}
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <Table className="w-full min-w-[400px]">
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Last Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium text-gray-900">{t.name}</TableCell>
                  <TableCell className="text-gray-600">{t.category}</TableCell>
                  <TableCell><TemplateStatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-right text-gray-500 whitespace-nowrap">{t.lastUsed ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Notification Settings Card ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
        <div className="divide-y divide-gray-100">
          {NOTIFICATION_ITEMS.map((item) => (
            <div
              key={item.key}
              className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="flex-1 min-w-0">
                <label
                  htmlFor={`toggle-${item.key}`}
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  {item.label}
                </label>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.description}</p>
              </div>
              <div className="flex-shrink-0 pt-0.5">
                <Toggle
                  id={`toggle-${item.key}`}
                  checked={notifications[item.key]}
                  onCheckedChange={(checked) => onToggleNotification(item.key, checked)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};