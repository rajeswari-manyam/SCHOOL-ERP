import React, { useState, useEffect } from "react";
import type { SchoolProfile } from "../types/settings.types";
import { BOARD_OPTIONS, SCHOOL_TYPE_OPTIONS } from "../utils/Settings.utils";

interface Props {
  profile: SchoolProfile;
  saving: boolean;
  onSave: (data: Partial<SchoolProfile>) => void;
}

export const SchoolProfileTab: React.FC<Props> = ({
  profile, saving, onSave,
}) => {
  const [form, setForm] = useState<SchoolProfile>(profile);

  useEffect(() => { setForm(profile); }, [profile]);

  const handleChange = (key: keyof SchoolProfile, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value } as SchoolProfile));

  return (
    <div className="space-y-6">
      {/* School Information Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">School Information</h2>
          <button
            onClick={() => onSave(form)}
            disabled={saving}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save School Profile"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">School Name</label>
            <input
              value={form.schoolName}
              onChange={e => handleChange("schoolName", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Board</label>
            <select
              value={form.board}
              onChange={e => handleChange("board", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {BOARD_OPTIONS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Principal Name</label>
            <input
              value={form.principalName}
              onChange={e => handleChange("principalName", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Established Year</label>
            <input
              value={form.establishedYear}
              onChange={e => handleChange("establishedYear", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Phone</label>
            <input
              value={form.phone}
              onChange={e => handleChange("phone", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Student Capacity</label>
            <input
              value={form.totalStudentCapacity}
              onChange={e => handleChange("totalStudentCapacity", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</label>
            <input
              value={form.email}
              onChange={e => handleChange("email", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">School Type</label>
            <select
              value={form.schoolType}
              onChange={e => handleChange("schoolType", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {SCHOOL_TYPE_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Address</label>
            <textarea
              value={form.address}
              onChange={e => handleChange("address", e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* School Logo Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">School Logo</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
            {form.logoUrl
              ? <img src={form.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
              : <span className="text-indigo-700 font-bold text-lg">
                  {form.schoolName.split(" ").map(w => w[0]).slice(0, 3).join("")}
                </span>
            }
          </div>
          <div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Upload New Logo
            </button>
        
            <p className="text-xs text-gray-500 mt-1">Recommended: 512×512px. Supports PNG, JPG (Max 2MB).</p>
          </div>
        </div>
      </div>

    </div>
  );
};
