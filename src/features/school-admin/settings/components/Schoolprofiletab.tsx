import React, { useState, useEffect, useRef } from "react";
import type { SchoolProfile } from "../types/settings.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BOARD_OPTIONS, SCHOOL_TYPE_OPTIONS } from "../utils/Settings.utils";

interface Props {
  profile: SchoolProfile;
  saving: boolean;
  onSave: (data: Partial<SchoolProfile>, files?: { logo?: File | null; adminImage?: File | null }) => void;
}

const BOARD_SELECT_OPTIONS = BOARD_OPTIONS.map((v) => ({ label: v, value: v }));
const SCHOOL_TYPE_SELECT_OPTIONS = SCHOOL_TYPE_OPTIONS.map((v) => ({ label: v, value: v }));

// ─── Reusable field wrapper ───────────────────────────────────────────────────
function Field({
  label,
  htmlFor,
  children,
  fullWidth = false,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "col-span-1 sm:col-span-2" : "col-span-1"}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── SchoolProfileTab ─────────────────────────────────────────────────────────
export const SchoolProfileTab: React.FC<Props> = ({ profile, saving, onSave }) => {
  const [form, setForm] = useState<SchoolProfile>(profile);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(profile.logoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [adminImageFile, setAdminImageFile] = useState<File | null>(null);
  const [adminImagePreview, setAdminImagePreview] = useState<string | undefined>(profile.adminImageUrl);
  const adminImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(profile);
    setLogoFile(null);
    setLogoPreview(profile.logoUrl);
    setAdminImageFile(null);
    setAdminImagePreview(profile.adminImageUrl);
  }, [profile]);

  const handleChange = (key: keyof SchoolProfile, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value } as SchoolProfile));

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAdminImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAdminImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setAdminImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => onSave(form, { logo: logoFile, adminImage: adminImageFile });

  const initials = form.schoolName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 3)
    .join("");

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* ── School Information ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="school-info-heading"
        className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/40 p-5 sm:p-8 shadow-sm"
      >
        {/* Header row */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h2
              id="school-info-heading"
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight"
            >
              School Information
            </h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Manage your school's core details and branding
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className={[
              "w-full sm:w-auto shrink-0",
              "px-5 py-2.5 rounded-xl text-sm font-bold text-white",
              "bg-gradient-to-r from-blue-600 to-indigo-600",
              "hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200",
              "disabled:opacity-60 disabled:cursor-not-allowed active:scale-95",
            ].join(" ")}
          >
            {saving ? "Saving…" : "Save school profile"}
          </Button>
        </div>

        {/* Grid: 1 col on mobile, 2 col on sm+ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="School name" htmlFor="schoolName">
            <Input
              id="schoolName"
              value={form.schoolName}
              onChange={(e) => handleChange("schoolName", e.target.value)}
              className="w-full"
              autoComplete="organization"
            />
          </Field>

          <Field label="Board" htmlFor="board">
            <Select
              
              value={form.board}
              onValueChange={(v) => handleChange("board", v)}
              options={BOARD_SELECT_OPTIONS}
              placeholder="Select board"
              className="w-full"
            />
          </Field>

          <Field label="Principal name" htmlFor="principalName">
            <Input
              id="principalName"
              value={form.principalName}
              onChange={(e) => handleChange("principalName", e.target.value)}
              className="w-full"
            />
          </Field>

          <Field label="Established year" htmlFor="establishedYear">
            <Input
              id="establishedYear"
              value={String(form.establishedYear)}
              onChange={(e) => handleChange("establishedYear", e.target.value)}
              className="w-full"
              inputMode="numeric"
              maxLength={4}
            />
          </Field>

          <Field label="Phone" htmlFor="phone">
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
            />
          </Field>

          <Field label="Total student capacity" htmlFor="totalStudentCapacity">
            <Input
              id="totalStudentCapacity"
              value={String(form.totalStudentCapacity)}
              onChange={(e) => handleChange("totalStudentCapacity", e.target.value)}
              className="w-full"
              inputMode="numeric"
            />
          </Field>

          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full"
              type="email"
              autoComplete="email"
              inputMode="email"
            />
          </Field>

          <Field label="School type" htmlFor="schoolType">
            <Select
             
              value={form.schoolType}
              onValueChange={(v) => handleChange("schoolType", v)}
              options={SCHOOL_TYPE_SELECT_OPTIONS}
              placeholder="Select school type"
              className="w-full"
            />
          </Field>

          {/* Address spans both columns */}
          <Field label="Address" htmlFor="address" fullWidth>
            <Textarea
              id="address"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full resize-none"
              rows={3}
              autoComplete="street-address"
            />
          </Field>
        </div>
      </section>

      {/* ── School Logo ────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="logo-heading"
        className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-blue-950/40 p-5 sm:p-8 shadow-sm"
      >
        <h2
          id="logo-heading"
          className="mb-5 text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
        >
          School Logo
        </h2>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          {/* Avatar */}
          <div
            aria-hidden="true"
            className="mx-auto sm:mx-0 h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center shadow-md overflow-hidden"
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt={`${form.schoolName} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl sm:text-2xl font-bold text-indigo-700 dark:text-indigo-300 select-none">
                {initials}
              </span>
            )}
          </div>

          {/* Upload */}
          <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors duration-150"
            >
              Upload new logo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              aria-label="Upload school logo"
              onChange={handleLogoChange}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium max-w-[260px] sm:max-w-none">
              Recommended: 512×512 px. PNG, JPG or WebP — max 2 MB.
            </p>
          </div>
        </div>
      </section>

      {/* ── Admin Photo ────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="admin-photo-heading"
        className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-blue-950/40 p-5 sm:p-8 shadow-sm"
      >
        <h2
          id="admin-photo-heading"
          className="mb-5 text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
        >
          Admin Photo
        </h2>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          {/* Avatar */}
          <div
            aria-hidden="true"
            className="mx-auto sm:mx-0 h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-full border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center shadow-md overflow-hidden"
          >
            {adminImagePreview ? (
              <img
                src={adminImagePreview}
                alt={`${form.principalName || "Admin"} photo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl sm:text-2xl font-bold text-indigo-700 dark:text-indigo-300 select-none">
                {(form.principalName || "A").charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Upload */}
          <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
            <Button
              type="button"
              variant="outline"
              onClick={() => adminImageInputRef.current?.click()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors duration-150"
            >
              Upload new photo
            </Button>
            <input
              ref={adminImageInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              aria-label="Upload admin photo"
              onChange={handleAdminImageChange}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium max-w-[260px] sm:max-w-none">
              Recommended: 512×512 px. PNG, JPG or WebP — max 2 MB.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};