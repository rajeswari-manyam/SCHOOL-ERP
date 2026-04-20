interface Props {
  label: string;
}

export function SubjectPill({ label }: Props) {
  return (
    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
      {label}
    </span>
  );
}