interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function BottomSheet({
  open,
  onClose,
  children
}: BottomSheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}>
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}