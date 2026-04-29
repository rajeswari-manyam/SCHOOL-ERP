import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type {
  AccountantSettings,
 
} from "../types/settings.types";

const schema = z.object({
  notificationsEnabled: z.boolean(),
  theme: z.enum(["light", "dark"]),
  language: z.string().min(2),
});

type SettingsFormValues = z.infer<typeof schema>;

const THEME_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

type SettingsFormProps = {
  defaultValues: AccountantSettings;
  onSubmit: (values: SettingsFormValues) => void;
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
    control,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      notificationsEnabled: defaultValues.notificationsEnabled,
      theme: defaultValues.theme,
      language: defaultValues.language,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <Label>Notifications</Label>
        <Checkbox {...register("notificationsEnabled")} />
        {errors.notificationsEnabled && (
          <span className="text-red-600">
            {errors.notificationsEnabled.message as string}
          </span>
        )}
      </div>
      <div>
        <Label>Theme</Label>
        <Controller
          name="theme"
          control={control}
          render={({ field }) => (
            <Select
              options={THEME_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
        {errors.theme && (
          <span className="text-red-600">{errors.theme.message as string}</span>
        )}
      </div>
      <div>
        <Label>Language</Label>
        <Input {...register("language")} />
        {errors.language && (
          <span className="text-red-600">
            {errors.language.message as string}
          </span>
        )}
      </div>
      <Button type="submit" disabled={loading}>
        Save
      </Button>
    </form>
  );
};
