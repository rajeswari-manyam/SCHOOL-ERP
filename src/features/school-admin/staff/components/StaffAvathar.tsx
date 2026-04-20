

interface Props {
  initials: string;
  status: string;
}

export function StaffAvatar({ initials }: Props) {
  return (
    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
      {initials}
    </div>
  );
}