export interface Report {
  id: string;
  title: string;
  type: string; // e.g., attendance, fees, performance
  createdAt: string;
  createdBy: string;
  data: any;
}

export interface ReportCreateInput {
  title: string;
  type: string;
  data: any;
}

export interface ReportUpdateInput extends Partial<ReportCreateInput> {}
