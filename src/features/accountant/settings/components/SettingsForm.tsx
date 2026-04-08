import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AccountantSettings,
  UpdateAccountantSettingsInput,
} from "../types/settings.types";

const schema = z.object({
  notificationsEnabled: z.boolean(),
  theme: z.enum(["light", "dark"]),
  language: z.string().min(2),
});

type SettingsFormProps = {
  defaultValues: AccountantSettings;
  onSubmit: (values: UpdateAccountantSettingsInput) => void;
  loading?: boolean;
};

export const SettingsForm = ({
  defaultValues,
  onSubmit,
  loading,
}: SettingsFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateAccountantSettingsInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label className="block">Notifications</label>
        <input type="checkbox" {...register("notificationsEnabled")} />
        {errors.notificationsEnabled && (
          <span className="text-red-600">
            {errors.notificationsEnabled.message as string}
          </span>
        )}
      </div>
      <div>
        <label className="block">Theme</label>
        <select {...register("theme")} className="input">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        {errors.theme && (
          <span className="text-red-600">{errors.theme.message as string}</span>
        )}
      </div>
      <div>
        <label className="block">Language</label>
        <input {...register("language")} className="input" />
        {errors.language && (
          <span className="text-red-600">
            {errors.language.message as string}
          </span>
        )}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        Save
      </button>
    </form>
  );
};
