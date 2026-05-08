import React, { useState } from "react";
import type { UserAccount, AddUserFormData, UserRole } from "../types/settings.types";
import {
  PERMISSION_LABELS, DEFAULT_ROLE_PERMISSIONS, ROLE_OPTIONS, ALL_PERMISSIONS,
} from "../utils/Settings.utils";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// ── Helpers ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-indigo-500", "bg-purple-500", "bg-emerald-500", "bg-sky-500",
  "bg-rose-500", "bg-amber-500", "bg-pink-500", "bg-teal-500",
];

const getInitials = (name: string) =>
  name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

const getColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  users: UserAccount[];
  totalCount: number;
  page: number;
  totalPages: number;
  onSetPage: (p: number) => void;
  onAddUser: (data: AddUserFormData) => void;
  onDeactivate: (id: string) => void;
  onEdit: (id: string, data: Partial<UserAccount>) => void;
}

// ── Add User Modal ─────────────────────────────────────────────────────────────

const AddUserModal: React.FC<{
  onClose: () => void;
  onAdd: (data: AddUserFormData) => void;
}> = ({ onClose, onAdd }) => {
  const [form, setForm] = useState<AddUserFormData>({
    fullName: "",
    mobileNumber: "",
    role: "",
    email: "",
    permissions: ["viewDashboard", "viewAttendance", "viewStudents", "viewFeeRecords"],
  });

  const handleRoleChange = (role: UserRole) => {
    setForm(prev => ({
      ...prev,
      role,
      permissions: DEFAULT_ROLE_PERMISSIONS[role] ?? [],
    }));
  };

  const leftPerms  = ALL_PERMISSIONS.slice(0, Math.ceil(ALL_PERMISSIONS.length / 2));
  const rightPerms = ALL_PERMISSIONS.slice(Math.ceil(ALL_PERMISSIONS.length / 2));

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Sheet on mobile, centred modal on sm+ */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-200 shadow-2xl
        w-full sm:max-w-lg
        rounded-t-2xl sm:rounded-2xl
        max-h-[92dvh] overflow-y-auto
        p-5 sm:p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Add User Account
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 text-xl leading-none p-1 -mr-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Grant a staff member login access to this school's portal
        </p>

        <Form
          onSubmit={e => { e.preventDefault(); onAdd(form); }}
          className="space-y-4 sm:space-y-5"
        >
          <FormField label="Full Name" description="Required for staff profile creation">
            <Input
              value={form.fullName}
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
              placeholder="Kiran Kumar"
            />
          </FormField>

          <FormField label="Mobile Number" description="This number is used for OTP login.">
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 sm:px-4 h-10 rounded-l-xl border border-r-0 border-gray-300 bg-slate-100 text-sm text-slate-600 flex-shrink-0">
                +91
              </span>
              <Input
                value={form.mobileNumber}
                onChange={e => setForm(p => ({ ...p, mobileNumber: e.target.value }))}
                placeholder="98765 43210"
                className="rounded-l-none"
              />
            </div>
          </FormField>

          <FormField label="Role">
            <Select
              value={form.role}
              onValueChange={value => handleRoleChange(value as UserRole)}
              options={ROLE_OPTIONS.map(role => ({ label: role, value: role }))}
              placeholder="Select a role"
            />
          </FormField>

          <FormField label="Email" description="Optional, used for report delivery">
            <Input
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="staff@example.com"
            />
          </FormField>

          <FormField
            label="Module Permissions"
            description="Preset permissions load automatically when a role is selected."
          >
            {/* 1 col on xs, 2 cols on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
              {[leftPerms, rightPerms].map((column, colIdx) => (
                <div key={colIdx} className="space-y-2.5">
                  {column.map(perm => (
                    <label key={perm} className="flex items-center gap-2.5 cursor-pointer group">
                      <Checkbox
                        checked={form.permissions.includes(perm)}
                        onCheckedChange={checked => {
                          setForm(prev => ({
                            ...prev,
                            permissions: checked
                              ? [...prev.permissions, perm]
                              : prev.permissions.filter(p => p !== perm),
                          }));
                        }}
                        className="flex-shrink-0"
                      />
                      <span className="text-xs sm:text-sm font-medium text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">
                        {PERMISSION_LABELS[perm]}
                      </span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </FormField>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-1">
            <Button variant="outline" type="button" className="w-full sm:w-auto" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={!form.fullName || !form.mobileNumber || !form.role}
            >
              Add User
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

// ── Mobile user card (shown on xs/sm) ─────────────────────────────────────────

const UserCard: React.FC<{
  user: UserAccount;
  onDeactivate: (id: string) => void;
}> = ({ user, onDeactivate }) => (
  <div className="flex items-start justify-between gap-3 px-4 py-4 border-b border-blue-50 last:border-b-0">
    <div className="flex items-start gap-3 min-w-0">
      <div className={`w-9 h-9 flex-shrink-0 rounded-full ${getColor(user.fullName)} flex items-center justify-center shadow-md`}>
        <span className="text-white text-xs font-bold">{getInitials(user.fullName)}</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{user.fullName}</p>
        <p className="text-xs text-gray-500 mt-0.5">{user.role} · {user.mobileNumber}</p>
        <p className="text-xs text-gray-400 mt-0.5">Last login: {user.lastLogin}</p>
        <div className="mt-1.5">
          <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold
            ${user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {user.status}
          </span>
        </div>
      </div>
    </div>
    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
      <button className="text-indigo-600 text-xs font-medium hover:text-indigo-700 transition-colors">
        Edit
      </button>
      {user.role !== "Principal" && (
        <button
          onClick={() => onDeactivate(user.id)}
          className="text-red-500 text-xs font-medium hover:text-red-600 transition-colors"
        >
          Deactivate
        </button>
      )}
    </div>
  </div>
);

// ── Main Tab ──────────────────────────────────────────────────────────────────

export const UserAccountsTab: React.FC<Props> = ({
  users, totalCount, page, totalPages, onSetPage, onAddUser, onDeactivate,
}) => {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="w-full space-y-4 sm:space-y-6">

      {/* ── Hero banner ── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg shadow-blue-500/30">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">User Accounts</h2>
            <p className="text-blue-100 text-sm sm:text-base mt-1">
              {totalCount} users can log in to this school
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3
              bg-white text-blue-600 rounded-xl text-sm font-bold
              hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            <span className="text-base leading-none">+</span> Add User
          </button>
        </div>
      </div>

      {/* ── Info banner ── */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl px-4 py-3
        flex items-start sm:items-center gap-2 text-xs sm:text-sm text-blue-700 font-medium">
        <span className="flex-shrink-0 mt-0.5 sm:mt-0">ⓘ</span>
        <span>Each user logs in with their mobile number. Permissions can be set per user.</span>
      </div>

      {/* ── Users table / cards ── */}
      <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-lg">

        {/* Mobile cards (< md) */}
        <div className="md:hidden">
          {users.map(user => (
            <UserCard key={user.id} user={user} onDeactivate={onDeactivate} />
          ))}
        </div>

        {/* Desktop table (≥ md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                {["Name", "Role", "Mobile (Login)", "Last Login", "Status", "Actions"].map(h => (
                  <th
                    key={h}
                    className="text-left px-4 py-3.5 text-xs font-bold text-blue-600 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr
                  key={user.id}
                  className="border-b border-blue-50 last:border-0 hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 flex-shrink-0 rounded-full ${getColor(user.fullName)} flex items-center justify-center shadow-md`}>
                        <span className="text-white text-xs font-bold">{getInitials(user.fullName)}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 truncate max-w-[140px] lg:max-w-none">
                        {user.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">{user.role}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap tabular-nums">{user.mobileNumber}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">{user.lastLogin}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold
                      ${user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors">
                        Edit
                      </button>
                      {user.role !== "Principal" && (
                        <button
                          onClick={() => onDeactivate(user.id)}
                          className="text-red-500 text-sm font-medium hover:text-red-600 transition-colors"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{users.length}</span> of{" "}
            <span className="font-medium text-gray-700">{totalCount}</span> users
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSetPage(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-sm text-gray-600
                hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50
                disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ‹
            </button>
            <span className="px-2 text-xs text-gray-500 tabular-nums">{page} / {totalPages}</span>
            <button
              onClick={() => onSetPage(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-sm text-gray-600
                hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50
                disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ── Add user modal ── */}
      {showAdd && (
        <AddUserModal
          onClose={() => setShowAdd(false)}
          onAdd={data => { onAddUser(data); setShowAdd(false); }}
        />
      )}
    </div>
  );
};