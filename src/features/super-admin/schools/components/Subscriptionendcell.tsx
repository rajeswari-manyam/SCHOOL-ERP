import { differenceInDays, parseISO, format } from "date-fns";

interface SubscriptionEndCellProps {
  dateStr: string;
  status: string;
}

const SubscriptionEndCell = ({ dateStr, status }: SubscriptionEndCellProps) => {
  if (status === "SUSPENDED") {
    return <span className="text-red-500 font-semibold text-sm">Expired</span>;
  }

  const date = parseISO(dateStr);
  const daysLeft = differenceInDays(date, new Date());
  const formatted = format(date, "d MMM yyyy");

  const isWarning = daysLeft > 0 && daysLeft <= 30;
  const isExpired = daysLeft <= 0;

  return (
    <div className="text-sm">
      <p className="text-gray-800 font-medium">{formatted}</p>
      {isExpired ? (
        <p className="text-red-500 font-semibold text-xs">Expired</p>
      ) : isWarning ? (
        <p className="text-amber-500 font-medium text-xs">{daysLeft} days remaining</p>
      ) : (
        <p className="text-gray-400 text-xs">{daysLeft} days remaining</p>
      )}
    </div>
  );
};

export default SubscriptionEndCell;