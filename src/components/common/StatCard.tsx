import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/utils/cn";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard = ({ title, value, icon, className }: StatCardProps) => (
  <Card className={cn("flex flex-col items-center p-4", className)}>
    {icon && <div className="mb-2 text-3xl text-blue-500">{icon}</div>}
    <CardHeader className="text-sm font-medium text-gray-500">
      {title}
    </CardHeader>
    <CardContent className="text-2xl font-bold">{value}</CardContent>
  </Card>
);
