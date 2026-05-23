interface SchoolAvatarProps {
  initials: string;
  color?: string;
  size?: "sm" | "md";
}

const colorMap: Record<string, string> = {
  indigo: "bg-indigo-100 text-indigo-700",
  blue:   "bg-blue-100 text-blue-700",
  green:  "bg-emerald-100 text-emerald-700",
  amber:  "bg-amber-100 text-amber-700",
  red:    "bg-red-100 text-red-700",
  purple: "bg-purple-100 text-purple-700",
};

const SchoolAvatar = ({ initials, color = "indigo", size = "md" }: SchoolAvatarProps) => {
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center font-bold flex-shrink-0 ${colorMap[color] ?? colorMap.indigo}`}>
      {initials}
    </div>
  );
};

export default SchoolAvatar;