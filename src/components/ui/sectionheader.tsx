interface SectionHeaderProps {
  title: string
  right?: React.ReactNode
}

export function SectionHeader({ title, right }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      {right}
    </div>
  )
}