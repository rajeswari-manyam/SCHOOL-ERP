
const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4"];

interface StudentAvatarProps {
  name: string;
  size?: number;
}

export function StudentAvatar({ name, size = 36 }: StudentAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const color = COLORS[name.charCodeAt(0) % COLORS.length];
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0"
      style={{ width: size, height: size, background: color }}
    >
      {initials}
    </div>
  );
}
