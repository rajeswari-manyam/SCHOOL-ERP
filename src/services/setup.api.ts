import api from "@/config/axios";

export interface SetupStatusResponse {
  success: boolean;
  completedSteps: number;
  totalSteps: number;
  progress: number;
  currentStep: string;
  nextAction: string;
  steps: {
    academicConfiguration: boolean;
    staff: boolean;
    classes: boolean;
    students: boolean;
    feeManagement: boolean;
    timetable: boolean;
  };
  sidebar: {
    dashboard: boolean;
    settings: boolean;
    staff: boolean;
    classes: boolean;
    admissions: boolean;
    students: boolean;
    attendance: boolean;
    feeCollection: boolean;
    timetable: boolean;
    reports: boolean;
  };
}

export async function getSetupStatus(): Promise<SetupStatusResponse> {
  const { data } = await api.get<SetupStatusResponse>("/tenant/setupstatus");
  return data;
}
