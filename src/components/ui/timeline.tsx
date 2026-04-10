interface TimelineItem {
  title: string
  time: string
}

interface TimelineProps {
  items: TimelineItem[]
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-2 h-2 mt-2 rounded-full bg-[#00714D]" />
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-gray-500">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}