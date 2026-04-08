import { axios } from "@/config/axios";
import {
  SchoolSettings,
  UpdateSchoolSettingsInput,
} from "../types/settings.types";

export const fetchSchoolSettings = async (): Promise<SchoolSettings> => {
  const { data } = await axios.get("/settings/school");
  return data;
};

export const updateSchoolSettings = async (
  input: UpdateSchoolSettingsInput,
): Promise<SchoolSettings> => {
  const { data } = await axios.put("/settings/school", input);
  return data;
};
