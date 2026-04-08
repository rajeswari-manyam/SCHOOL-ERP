interface StatCardProps {
  title: string;
  value: number;
}

export const StatCard = ({ title, value }: StatCardProps) => (
  <div className="bg-white rounded shadow p-4 flex flex-col items-center">
    <div className="text-lg font-semibold">{title}</div>
    <div className="text-2xl font-bold mt-2">{value}</div>
  </div>
);
