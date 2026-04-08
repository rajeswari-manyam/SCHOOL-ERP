import {
  useSchoolSettings,
  useUpdateSchoolSettings,
} from "./hooks/useSchoolSettings";
import { useState } from "react";
import { SchoolSettingsForm } from "./components/SchoolSettingsForm";

const SettingsPage = () => {
  const { data, isLoading } = useSchoolSettings();
  const updateSettings = useUpdateSchoolSettings();
  const [formOpen, setFormOpen] = useState(false);

  const handleFormSubmit = (values: any) => {
    updateSettings.mutate(values);
    setFormOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">School Settings</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setFormOpen(true)}
        >
          Edit Settings
        </button>
      </div>
      {formOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded shadow p-6 w-96">
            <h2 className="font-semibold mb-4">Edit School Settings</h2>
            <SchoolSettingsForm
              defaultValues={data ?? {}}
              onSubmit={handleFormSubmit}
              loading={updateSettings.isLoading}
            />
            <button
              className="mt-4 px-3 py-1"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="bg-white rounded shadow p-6">
        <h2 className="font-semibold mb-4">Current Settings</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : data ? (
          <ul className="space-y-2">
            <li>
              <strong>Name:</strong> {data.name}
            </li>
            <li>
              <strong>Address:</strong> {data.address}
            </li>
            <li>
              <strong>Phone:</strong> {data.phone}
            </li>
            <li>
              <strong>Email:</strong> {data.email}
            </li>
            <li>
              <strong>Academic Year:</strong> {data.academicYear}
            </li>
            {data.logoUrl && (
              <li>
                <strong>Logo:</strong>{" "}
                <img src={data.logoUrl} alt="Logo" className="h-12" />
              </li>
            )}
          </ul>
        ) : (
          <div>No settings found.</div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
