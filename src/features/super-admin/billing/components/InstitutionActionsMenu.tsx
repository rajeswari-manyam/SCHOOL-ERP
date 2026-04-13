import React, { useRef, useEffect, useState } from 'react';
import {
  MoreHorizontal,
  Eye,
  Pencil,
  PauseCircle,
  PlayCircle,
  Trash2,
  CreditCard,
} from 'lucide-react';
import type { Institution } from '../types/billing.types';

interface InstitutionActionsMenuProps {
  institution: Institution;
  onView: (inst: Institution) => void;
  onEdit: (inst: Institution) => void;
  onSuspend: (inst: Institution) => void;
  onDelete: (inst: Institution) => void;
  onRecordPayment: (inst: Institution) => void;
}

export const InstitutionActionsMenu: React.FC<InstitutionActionsMenuProps> = ({
  institution,
  onView,
  onEdit,
  onSuspend,
  onDelete,
  onRecordPayment,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isSuspended = institution.status === 'Suspended';

  const items = [
    { icon: Eye, label: 'View details', action: () => onView(institution) },
    { icon: Pencil, label: 'Edit plan', action: () => onEdit(institution) },
    { icon: CreditCard, label: 'Record payment', action: () => onRecordPayment(institution) },
    {
      icon: isSuspended ? PlayCircle : PauseCircle,
      label: isSuspended ? 'Unsuspend' : 'Suspend',
      action: () => onSuspend(institution),
      className: 'text-amber-600 dark:text-amber-400',
    },
    {
      icon: Trash2,
      label: 'Delete',
      action: () => onDelete(institution),
      className: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
        aria-label="Institution actions"
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-gray-900">
          {items.map(({ icon: Icon, label, action, className }) => (
            <button
              key={label}
              onClick={() => { action(); setOpen(false); }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] hover:bg-gray-50 dark:hover:bg-white/5 ${
                className ?? 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
