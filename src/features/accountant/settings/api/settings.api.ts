import { axios } from "@/config/axios";
import type {
  AccountantSettings,
  UpdateAccountantSettingsInput,
} from "../types/settings.types";

export const fetchAccountantSettings =
  async (): Promise<AccountantSettings> => {
    const { data } = await axios.get("/accountant/settings");
    return data;
  };

export const updateAccountantSettings = async (
  input: UpdateAccountantSettingsInput,
): Promise<AccountantSettings> => {
  const { data } = await axios.put("/accountant/settings", input);
  return data;
};
