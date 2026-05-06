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

  const leftPerms = ALL_PERMISSIONS.slice(0, Math.ceil(ALL_PERMISSIONS.length / 2));
  const rightPerms = ALL_PERMISSIONS.slice(Math.ceil(ALL_PERMISSIONS.length / 2));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Add User Account</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <p className="text-sm text-gray-600 mb-6 font-medium">Grant a staff member login access to this school's portal</p>

        <Form
          onSubmit={e => {
            e.preventDefault();
            onAdd(form);
          }}
          className="space-y-5"
        >
          <FormField label="Full Name" description="Required for staff profile creation">
            <Input
              value={form.fullName}
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
              placeholder="Kiran Kumar"
            />
          </FormField>

          <FormField label="Mobile Number" description="This number is used for OTP login.">
            <div className="flex items-center gap-0">
              <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-300 bg-slate-100 text-sm text-slate-600">
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

          <FormField label="Module Permissions" description="Preset permissions load automatically when a role is selected.">
            <div className="grid grid-cols-2 gap-3">
              {[leftPerms, rightPerms].map((column, columnIndex) => (
                <div key={columnIndex} className="space-y-2">
                  {column.map(perm => (
                    <label key={perm} className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={form.permissions.includes(perm)}
                        onCheckedChange={checked => {
                          if (checked) {
                            setForm(prev => ({
                              ...prev,
                              permissions: [...prev.permissions, perm],
                            }));
                          } else {
                            setForm(prev => ({
                              ...prev,
                              permissions: prev.permissions.filter(p => p !== perm),
                            }));
                          }
                        }}
                      />
                      <span className="text-sm font-medium text-slate-700">{PERMISSION_LABELS[perm]}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </FormField>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
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

// ─── Main Tab ─────────────────────────────────────────────────────────────────
export const UserAccountsTab: React.FC<Props> = ({
  users, totalCount, page, totalPages, onSetPage, onAddUser, onDeactivate,
}) => {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      <div className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/30 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">User Accounts</h2>
          <p className="text-blue-100 mt-2">{totalCount} users can log in to this school</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-6 py-3 bg-white text-blue-600 rounded-xl text-sm font-bold hover:shadow-lg transition-all duration-200 flex items-center gap-2 active:scale-95"
        >
          <span>+</span> Add User
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-sm text-blue-700 font-medium">
        ⓘ Each user logs in with their mobile number. Permissions can be set per user.
      </div>

      <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              {["Name", "Role", "Mobile (Login)", "Last Login", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-4 text-xs font-bold text-blue-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-blue-50 last:border-0 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${getColor(user.fullName)} flex items-center justify-center shadow-md`}>
                      <span className="text-white text-xs font-bold">{getInitials(user.fullName)}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{user.fullName}</span>
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