import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Status = "success" | "warning" | "error";

interface StatCardProps {
  title: string;
  value: string | number;
  status?: Status;
  extra?: string;
}

const statusLabelMap: Record<Status, string> = {
  success: "Good",
  warning: "Attention",
  error: "Critical",
};

export const StatCard = ({ title, value, status, extra }: StatCardProps) => {
  return (
    <Card className="hover:shadow-md transition">
      <CardContent className="flex flex-col gap-2">
        
        {/* Title */}
        <p className="text-sm text-gray-500">{title}</p>

        {/* Value + Status */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{value}</h2>

          {status && (
            <Badge variant={status}>
              {statusLabelMap[status]}
            </Badge>
          )}
        </div>

        {/* Extra Info */}
        {extra && (
          <p className="text-xs text-gray-400">{extra}</p>
        )}
      </CardContent>
    </Card>
  );
};