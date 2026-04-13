import { AVATAR_COLORS } from "../utils/constants";

interface TeacherAvatarProps {
  initials: string;
  name: string;
}

export function TeacherAvatar({ initials, name }: TeacherAvatarProps) {
  const colorClass = AVATAR_COLORS[initials] ?? "bg-gray-100 text-gray-600";
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${colorClass}`}
      >
        {initials}
      </div>
      <span className="text-sm text-gray-700 leading-tight">{name}</span>
    </div>
  );
}