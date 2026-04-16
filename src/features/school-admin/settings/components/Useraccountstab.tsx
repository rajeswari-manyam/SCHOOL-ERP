import React, { useState } from "react";
import type { UserAccount, AddUserFormData, UserRole, ModulePermission } from "../types/settings.types";
import {
  PERMISSION_LABELS, DEFAULT_ROLE_PERMISSIONS, ROLE_OPTIONS, ALL_PERMISSIONS,
} from "../utils/Settings.utils";

const AVATAR_COLORS = [
  "bg-indigo-500", "bg-purple-500", "bg-emerald-500", "bg-sky-500",
  "bg-rose-500", "bg-amber-500", "bg-pink-500", "bg-teal-500",
];

const getInitials = (name: string) =>
  name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

const getColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

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

// ─── Add User Modal ───────────────────────────────────────────────────────────
const AddUserModal: React.FC<{ onClose: () => void; onAdd: (data: AddUserFormData) => void }> = ({ onClose, onAdd }) => {
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

  const togglePermission = (perm: ModulePermission) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const leftPerms = ALL_PERMISSIONS.slice(0, Math.ceil(ALL_PERMISSIONS.length / 2));
  const rightPerms = ALL_PERMISSIONS.slice(Math.ceil(ALL_PERMISSIONS.length / 2));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">Add User Account</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <p className="text-sm text-gray-500 mb-5">Grant a staff member login access to this school's portal</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input
              value={form.fullName}
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
              placeholder="Kiran Kumar"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
            <div className="flex">
              <span className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-600 bg-gray-50">+91</span>
              <input
                value={form.mobileNumber}
                onChange={e => setForm(p => ({ ...p, mobileNumber: e.target.value }))}
                placeholder="98765 43210"
                className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">This number is used for OTP login. Must be a registered staff member's number.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role <span className="text-red-500">*</span></label>
            <select
              value={form.role}
              onChange={e => handleRoleChange(e.target.value as UserRole)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a role</option>
              {ROLE_OPTIONS.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="optional, for report delivery"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Module Permissions</label>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {[leftPerms, rightPerms].map((col, ci) => (
                <div key={ci} className="space-y-2">
                  {col.map(perm => (
                    <label key={perm} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.permissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{PERMISSION_LABELS[perm]}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">Preset permissions for selected role load automatically when role is chosen</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onAdd(form)}
            disabled={!form.fullName || !form.mobileNumber || !form.role}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Tab ─────────────────────────────────────────────────────────────────
export const UserAccountsTab: React.FC<Props> = ({
  users, totalCount, page, totalPages, onSetPage, onAddUser, onDeactivate,
}) => {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">User Accounts</h2>
          <p className="text-sm text-gray-500 mt-0.5">{totalCount} users can log in to this school</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-1.5"
        >
          + Add User
        </button>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2.5 mb-4 flex items-center gap-2 text-sm text-indigo-700">
        ⓘ Each user logs in with their mobile number. Permissions can be set per user.
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Name", "Role", "Mobile (Login)", "Last Login", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${getColor(user.fullName)} flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{getInitials(user.fullName)}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.fullName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{user.role}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{user.mobileNumber}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{user.lastLogin}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">Edit</button>
                    {user.role !== "Principal" && (
                      <button
                        onClick={() => onDeactivate(user.id)}
                        className="text-red-500 text-sm font-medium hover:text-red-600"
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

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {users.length} of {totalCount} users
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => onSetPage(page - 1)}
              disabled={page <= 1}
              className="px-2 py-1 border border-gray-200 rounded text-sm text-gray-600 disabled:opacity-40"
            >
              ‹
            </button>
            <button
              onClick={() => onSetPage(page + 1)}
              disabled={page >= totalPages}
              className="px-2 py-1 border border-gray-200 rounded text-sm text-gray-600 disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {showAdd && (
        <AddUserModal
          onClose={() => setShowAdd(false)}
          onAdd={data => { onAddUser(data); setShowAdd(false); }}
        />
      )}
    </div>
  );
};