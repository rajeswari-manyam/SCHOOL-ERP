import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { parentProfile } from "../data/profile.data";
import { useProfileStore } from "../hooks/useProfileStore";
import { ProfileCard } from "../components/ProfileCard";
import { ChildrenCard } from "../components/ChildrenCard";
import { ContactInfoCard } from "../components/ContactInfoCard";
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
  };
};

export default function ProfilePage() {
  const { contact, notifications, setContact, toggleNotification } =
    useProfileStore();
  const { activeChild } = useOutletContext<ParentLayoutContext>();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<ContactInfo>(contact);

  const update = (key: keyof ContactInfo, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setContact(form);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB]">

      {/* ── MODAL OVERLAY ── */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditing(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-[15px] font-bold text-[#0B1C30]">Edit Profile</p>
              <button
                onClick={() => setIsEditing(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E8EBF2] text-gray-400 hover:text-gray-600 hover:bg-gray-50 text-[14px]"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FormField label="Father Name">
                  <Input
                    value={form.fatherName}
                    onChange={(e) => update("fatherName", e.target.value)}
                  />
                </FormField>

                <FormField label="Father Phone">
                  <div className="px-3 py-2 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl text-[13px] text-gray-400 flex items-center justify-between">
                    {form.fatherPhone}
                    <span className="text-[10px] text-[#3525CD] font-semibold">Read-only</span>
                  </div>
                </FormField>

                <FormField label="Mother Name">
                  <Input
                    value={form.motherName}
                    onChange={(e) => update("motherName", e.target.value)}
                  />
                </FormField>

                <FormField label="Mother Email">
                  <Input
                    value={form.motherEmail}
                    onChange={(e) => update("motherEmail", e.target.value)}
                  />
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Emergency Contact">
                    <Input
                      value={form.emergencyContact}
                      onChange={(e) => update("emergencyContact", e.target.value)}
                    />
                  </FormField>
                </div>

              </div>
            </Form>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-[#E8EBF2] rounded-xl text-[12px] font-semibold text-gray-500 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#3525CD] rounded-xl text-[12px] font-semibold text-white hover:bg-[#2a1eb0] active:scale-95 transition-all"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── PAGE CONTENT ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-10 py-8">

        {/* BREADCRUMB */}
        <p className="text-[12px] text-gray-400 mb-4">
          {activeChild.name} ›
          <span className="text-gray-600 font-medium"> Profile</span>
        </p>

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-[#0B1C30]">My Profile</h1>
          <p className="text-[13px] text-gray-400 mt-1 max-w-[600px]">
            Manage your personal information and academic notification preferences.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5">
            <ProfileCard
              name={parentProfile.name}
              initials={parentProfile.initials}
              role={parentProfile.role}
              phone={parentProfile.phone}
              onEdit={() => setIsEditing(true)}
            />
            <ChildrenCard children={parentProfile.children} />
          </div>

          {/* RIGHT COLUMN — single ContactInfoCard, no Save button */}
          <div className="flex flex-col gap-5">
            <ContactInfoCard contact={contact} />
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