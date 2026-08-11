import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "../hooks/useProfileStore";
import { ProfileCard } from "../components/ProfileCard";
import { ChildrenCard } from "../components/ChildrenCard";
import { ContactInfoCard } from "../components/ContactInfoCard";
import { ClassTeacherCard } from "../components/ClassTeacherCard";
import { NotificationPreferences } from "../components/NotificationPreferance";
import { Input } from "@/components/ui/input";
import { Form, FormField } from "@/components/ui/form";
import type { ContactInfo } from "../types/profile.types";

type ParentLayoutContext = {
  activeChild: {
    id: number;
    name: string;
    class: string;
    school: string;
    avatar: string;
    section?: string;
    studentId?: string;
  };
};

export default function ProfilePage() {
  const authUser = useAuthStore((s) => s.user);

  const parentName        = useProfileStore((s) => s.parentName);
  const parentPhone       = useProfileStore((s) => s.parentPhone);
  const parentEmail       = useProfileStore((s) => s.parentEmail);
  const parentRelation    = useProfileStore((s) => s.parentRelation);
  const parentOccupation  = useProfileStore((s) => s.parentOccupation);
  const parentAddress     = useProfileStore((s) => s.parentAddress);
  const contact           = useProfileStore((s) => s.contact);
  const classTeacher      = useProfileStore((s) => s.classTeacher);
  const notifications     = useProfileStore((s) => s.notifications);
  const children          = useProfileStore((s) => s.children);
  const isLoading         = useProfileStore((s) => s.isLoading);
  const error             = useProfileStore((s) => s.error);
  const fetchProfile      = useProfileStore((s) => s.fetchProfile);
  const setContact        = useProfileStore((s) => s.setContact);
  const toggleNotification = useProfileStore((s) => s.toggleNotification);

  const { activeChild } = useOutletContext<ParentLayoutContext>();

  // Same resolution order as ParentLayout
  const parentId =
    localStorage.getItem("parentId") ||
    authUser?.id ||
    "";

  const activeStudentId = String(activeChild?.studentId ?? activeChild?.id ?? "");

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<ContactInfo>(contact);

  useEffect(() => {
    if (parentId) fetchProfile(parentId, activeStudentId);
  }, [parentId, activeStudentId]);

  useEffect(() => {
    setForm(contact);
  }, [contact]);

  const update = (key: keyof ContactInfo, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setContact(form);
    setIsEditing(false);
  };

  const displayName = parentName || activeChild?.name || "";
  const initials = displayName
    .split(" ").filter(Boolean)
    .map((w: string) => w[0].toUpperCase())
    .join("").slice(0, 2);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#3525CD] border-t-transparent animate-spin" />
          <p className="text-[13px] text-gray-400 font-medium">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-sm text-center">
          <p className="text-[15px] font-bold text-[#0B1C30] mb-2">Failed to load profile</p>
          <p className="text-[13px] text-gray-400 mb-5">{error}</p>
          <button
            onClick={() => parentId && fetchProfile(parentId)}
            className="px-5 py-2.5 bg-[#3525CD] rounded-xl text-[12px] font-semibold text-white hover:bg-[#2a1eb0] transition-colors"
          >Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB]">

      {/* ── EDIT MODAL ── */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setIsEditing(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[15px] font-bold text-[#0B1C30]">Edit Profile</p>
              <button
                onClick={() => setIsEditing(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E8EBF2] text-gray-400 hover:text-gray-600 hover:bg-gray-50 text-[14px]"
              >✕</button>
            </div>

            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Father Name">
                  <Input value={form.fatherName} onChange={(e) => update("fatherName", e.target.value)} />
                </FormField>
                <FormField label="Father Phone">
                  <div className="px-3 py-2 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl text-[13px] text-gray-400 flex items-center justify-between">
                    {form.fatherPhone || "—"}
                    <span className="text-[10px] text-[#3525CD] font-semibold">Read-only</span>
                  </div>
                </FormField>
                <FormField label="Mother Name">
                  <Input value={form.motherName} onChange={(e) => update("motherName", e.target.value)} />
                </FormField>
                <FormField label="Mother Email">
                  <Input value={form.motherEmail} onChange={(e) => update("motherEmail", e.target.value)} />
                </FormField>
                <div className="md:col-span-2">
                  <FormField label="Emergency Contact">
                    <Input value={form.emergencyContact} onChange={(e) => update("emergencyContact", e.target.value)} />
                  </FormField>
                </div>
              </div>
            </Form>

            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-[#E8EBF2] rounded-xl text-[12px] font-semibold text-gray-500 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-[#3525CD] rounded-xl text-[12px] font-semibold text-white hover:bg-[#2a1eb0] active:scale-95 transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PAGE CONTENT ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-10 py-8">
        <p className="text-[12px] text-gray-400 mb-4">
          {activeChild.name} › <span className="text-gray-600 font-medium">Profile</span>
        </p>
        <div className="mb-6">
          <h1 className="text-sm font-semibold text-[#0B1C30]">My Profile</h1>
          <p className="text-[13px] text-gray-400 mt-1 max-w-[600px]">
            Manage your personal information and academic notification preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
          <div className="flex flex-col gap-5">
            {/* ✅ parentPhone now populated from real API */}
            <ProfileCard
              name={displayName}
              initials={initials}
              role="Parent"
              phone={parentPhone}
              email={parentEmail}
              relation={parentRelation}
              occupation={parentOccupation}
              address={parentAddress}
              onEdit={() => setIsEditing(true)}
            />
            <ChildrenCard children={children} />
          </div>

          <div className="flex flex-col gap-5">
            {/* ✅ contact fields now populated from real API */}
            <ContactInfoCard contact={contact} />
            <ClassTeacherCard teacher={classTeacher} />
            <NotificationPreferences
              notifications={notifications}
              onToggle={toggleNotification}
              onSave={() => console.log("Preferences saved", notifications)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}