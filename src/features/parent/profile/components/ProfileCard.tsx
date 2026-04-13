const PhoneIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 14 14"
    fill="none"
    style={{ display: "block" }}
  >
    <path
      d="M2 3a1 1 0 011-1h2l1 3-1.5 1.5a9 9 0 004 4L10 9l3 1v2a1 1 0 01-1 1A11 11 0 012 3z"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  </svg>
);

import { Card, CardContent } from "@/components/ui/card";
interface ProfileCardProps {
  name: string;
  initials: string;
  role: string;
  phone: string;
  onEdit?: () => void;   // ✅ ADD THIS
}

export function ProfileCard({
  name,
  initials,
  role,
  phone,
  onEdit,
}: ProfileCardProps) {
  return (
    <Card
      className="
        rounded-2xl border-0 shadow-sm
        hover:shadow-xl hover:-translate-y-1
        hover:border-[#3525CD]
        hover:border-1
        transition-all duration-300
      "
    >
      <CardContent className="p-5 text-center">

        {/* AVATAR */}
        <div className="
          w-[72px] h-[72px] rounded-full
          bg-[#3525CD] flex items-center justify-center
          text-[22px] font-bold text-white
          mx-auto mb-3
          hover:scale-105 transition-transform duration-200
        ">
          {initials}
        </div>

        {/* NAME */}
        <p className="text-[16px] font-bold text-[#0B1C30]">
          {name}
        </p>

        {/* ROLE */}
        <p className="text-[12px] text-gray-400 mt-0.5">
          {role}
        </p>

        {/* PHONE */}
        <div className="
          flex items-center justify-center gap-1.5
          text-[12px] text-gray-500 mt-2
        ">
          <PhoneIcon />
          {phone}
        </div>

        {/* BUTTON */}
      <button
  onClick={onEdit}   // ✅ ADD THIS
  className="
    w-full mt-4 py-2.5
    border border-[#E8EBF2]
    rounded-xl
    text-[12px] font-semibold text-[#3525CD]
    hover:bg-[#EEF2FF]
    active:scale-95
    transition-all duration-200
  "
>
  ✎ Edit Profile
</button>

      </CardContent>
    </Card>
  );
}