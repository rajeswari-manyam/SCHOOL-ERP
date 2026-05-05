import React, { useState, useEffect } from "react";
import type { SchoolProfile } from "../types/settings.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BOARD_OPTIONS, SCHOOL_TYPE_OPTIONS } from "../utils/Settings.utils";

interface Props {
  profile: SchoolProfile;
  saving: boolean;
  onSave: (data: Partial<SchoolProfile>) => void;
}

const BOARD_SELECT_OPTIONS = BOARD_OPTIONS.map((value) => ({ label: value, value }));
const SCHOOL_TYPE_SELECT_OPTIONS = SCHOOL_TYPE_OPTIONS.map((value) => ({ label: value, value }));

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
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl border border-blue-200 p-8 shadow-lg shadow-blue-100/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">School Information</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your school's core details and branding</p>
          </div>
          <Button
            onClick={() => onSave(form)}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
          >
            {saving ? "Saving…" : "Save School Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">School Name</label>
            <Input
              value={form.schoolName}
              onChange={(e) => handleChange("schoolName", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Board</label>
            <Select
              value={form.board}
              onValueChange={(value) => handleChange("board", value)}
              options={BOARD_SELECT_OPTIONS}
              placeholder="Select board"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Principal Name</label>
            <Input
              value={form.principalName}
              onChange={(e) => handleChange("principalName", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Established Year</label>
            <Input
              value={String(form.establishedYear)}
              onChange={(e) => handleChange("establishedYear", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Phone</label>
            <Input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Total Student Capacity</label>
            <Input
              value={String(form.totalStudentCapacity)}
              onChange={(e) => handleChange("totalStudentCapacity", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Email</label>
            <Input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">School Type</label>
            <Select
              value={form.schoolType}
              onValueChange={(value) => handleChange("schoolType", value)}
              options={SCHOOL_TYPE_SELECT_OPTIONS}
              placeholder="Select school type"
              className="w-full"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Address</label>
            <Textarea
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="resize-none"
            />
          </div>
        </div>
      </div>

      {/* School Logo Card */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-2xl border border-indigo-200 p-8 shadow-lg shadow-indigo-100/50">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-6">School Logo</h2>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center border-2 border-blue-200 shadow-lg">
            {form.logoUrl
              ? <img src={form.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
              : <span className="text-indigo-700 font-bold text-2xl">
                  {form.schoolName.split(" ").map(w => w[0]).slice(0, 3).join("")}
                </span>
            }
          </div>
          <div>
            <Button variant="outline" className="px-5 py-3 rounded-xl text-sm font-bold text-blue-600">
              Upload New Logo
            </Button>
              <input type="file" accept="image/*" className="hidden"/>
            <p className="text-xs text-gray-600 mt-2 font-medium">Recommended: 512×512px. Supports PNG, JPG (Max 2MB).</p>
          </div>
        </div>
      </div>  

    </div>
  );
};
