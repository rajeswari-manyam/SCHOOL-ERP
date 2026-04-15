import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type{ ReminderStatus } from "../types/dashboard.types";

export const ReminderStatusCard = ({ data }: { data: ReminderStatus }) => {
  return (
    <Card className="border-2 border-green-500">
      <CardHeader>
        <CardTitle>Automated Reminder Status</CardTitle>
      </CardHeader>

      <CardContent className="flex justify-between">
        <span>Sent: {data.sent}</span>
        <span>Delivered: {data.delivered}</span>
        <span className="text-red-500">Failed: {data.failed}</span>
      </CardContent>
    </Card>
  );
};