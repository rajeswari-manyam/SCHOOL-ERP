export interface SchoolSettings {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  academicYear: string;
  logoUrl?: string;
}

export interface UpdateSchoolSettingsInput extends Partial<SchoolSettings> {}
