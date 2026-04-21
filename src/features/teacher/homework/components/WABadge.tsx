import type { HomeworkItem } from "../types/homework.types";

interface WABadgeProps {
  status: HomeworkItem["waNotifyStatus"];
  notifiedAt?: string;
}

const WABadge = ({ status, notifiedAt }: WABadgeProps) => {
  if (status === "SENT") return (
    <span title={notifiedAt ? `Sent ${notifiedAt}` : "WA notification sent"}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] text-[10px] font-bold border border-[#bbf7d0]">
      <span className="text-[#25d366]">💬</span> WA Sent
    </span>
  );
  if (status === "SENDING") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
      <span>💬</span> Sending…
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold">
      <span>💬</span> Not Sent
    </span>
  );
};

export default WABadge;
