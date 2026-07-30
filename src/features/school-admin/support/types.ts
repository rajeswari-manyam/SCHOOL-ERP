export type TicketPriority = "Low" | "Medium" | "High" | "Urgent";

export const PRIORITY_TO_API: Record<TicketPriority, "low" | "medium" | "high" | "urgent"> = {
  Low: "low",
  Medium: "medium",
  High: "high",
  Urgent: "urgent",
};

export const priorityFromApi = (priority: string): TicketPriority => {
  const match = (["Low", "Medium", "High", "Urgent"] as TicketPriority[]).find(
    (p) => p.toLowerCase() === priority.toLowerCase()
  );
  return match ?? "Medium";
};
