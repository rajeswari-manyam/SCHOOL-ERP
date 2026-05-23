interface ListProps {
  children: React.ReactNode
}

export function List({ children }: ListProps) {
  return (
    <div className="divide-y rounded-xl border bg-white">
      {children}
    </div>
  )
}