// SettingsPage.tsx

import { useOutletContext } from "react-router-dom";


import { NotificationPreferences } from "./profile/components/NotificationPreferance";
import { useProfileStore } from "./profile/hooks/useProfileStore";


type ParentLayoutContext = {
    activeChild: {
        id: number;
        name: string;
        class: string;
        school: string;
        avatar: string;
    };
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const { notifications, toggleNotification } = useProfileStore();
    const { activeChild } = useOutletContext<ParentLayoutContext>();

    return (
        <div className="min-h-screen bg-[#F4F6FB]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-10 py-8">

                {/* BREADCRUMB */}
                <p className="text-[12px] text-gray-400 mb-4">
                    {activeChild.name} ›
                    <span className="text-gray-600 font-medium"> Settings</span>
                </p>

                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-[22px] font-bold text-[#0B1C30]">Settings</h1>
                    <p className="text-[13px] text-gray-400 mt-1">
                        Manage your account preferences and security.
                    </p>
                </div>

                {/* TWO COLUMN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                        <NotificationPreferences
                            notifications={notifications}
                            onToggle={toggleNotification}
                            onSave={() => console.log("Notification preferences saved")}
                        />
                    </div>
                  
            
                </div>

            </div>
        </div>
    );
}

// ─── Icons ───────────────────────────────────────────────────────────────────


