interface ListItemProps {
  title: string
  subtitle?: string
  right?: React.ReactNode
  onClick?: () => void
}

export function ListItem({
  title,
  subtitle,
  right,
  onClick
}: ListItemProps) {
  return (
    <div
      onClick={onClick}
      className="p-4 flex justify-between items-center cursor-pointer"
    >
      <div>
        <p className="font-medium">{title}</p>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  )
}