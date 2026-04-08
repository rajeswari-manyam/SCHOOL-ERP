import { RevenueData } from "../types/dashboard.types";

interface RevenueWidgetProps {
  data: RevenueData[];
}

export const RevenueWidget = ({ data }: RevenueWidgetProps) => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-4 border-b">
      <h3 className="font-semibold">Revenue Trend</h3>
    </div>
    <div className="p-4">
      <div className="h-48 flex items-end gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-blue-500 rounded-t"
              style={{ height: `${(item.revenue / Math.max(...data.map(d => d.revenue))) * 150}px` }}
            />
            <p className="text-xs text-gray-500 mt-2">{item.month}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
