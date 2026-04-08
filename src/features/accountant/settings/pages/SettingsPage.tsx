import { SettingsForm } from "../components/SettingsForm";
import {
  useAccountantSettings,
  useUpdateAccountantSettings,
} from "../hooks/useAccountantSettings";

export default function SettingsPage() {
  const { data, isLoading } = useAccountantSettings();
  const updateSettings = useUpdateAccountantSettings();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No settings found.</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Accountant Settings</h1>
      <SettingsForm
        defaultValues={data}
        onSubmit={(values) => updateSettings.mutate(values)}
        loading={updateSettings.isLoading}
      />
    </div>
  );
}
