import { CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Enquiry } from '../types';
import { useAdmissionsStore } from '../hooks/useAdmissionsStore';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';

interface Props {
  enquiry: Enquiry;
  index: number;
}

export function DocsVerifiedCard({ enquiry, index }: Props) {
  const { setSelectedEnquiry, openConfirmAdmission } = useAdmissionsStore();
  const allVerified = enquiry.documents?.every((d) => d.status === 'verified');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card
        onClick={() => setSelectedEnquiry(enquiry.id)}
        className="p-4 cursor-pointer border-gray-100 hover:border-blue-200 transition-all"
      >
        <h3 className="font-semibold text-gray-900 text-sm mb-3">{enquiry.studentName}</h3>

        {enquiry.documents && enquiry.documents.length > 0 && (
          <ul className="space-y-1.5 mb-3">
            {enquiry.documents.map((doc) => (
              <li key={doc.name} className="flex items-center gap-2 text-xs">
                {doc.status === 'verified' ? (
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                ) : (
                  <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
                )}
                <span className={doc.status === 'verified' ? 'text-gray-700' : 'text-amber-600 font-medium'}>
                  {doc.name}
                  {doc.status === 'pending' && ' Pending'}
                </span>
              </li>
            ))}
          </ul>
        )}

        <Button
          onClick={(e) => {
            e.stopPropagation();
            openConfirmAdmission(enquiry.id);
          }}
          disabled={!allVerified}
          variant="default"
          size="sm"
          className="w-full"
        >
          Confirm Admission
        </Button>
      </Card>
    </motion.div>
  );
}
