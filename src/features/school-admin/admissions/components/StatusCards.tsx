import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Enquiry } from '../types';
import { useAdmissionsStore } from '../hooks/useAdmissionsStore';
import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';

interface Props {
  enquiry: Enquiry;
  index: number;
}

export function ConfirmedCard({ enquiry, index }: Props) {
  const { setSelectedEnquiry } = useAdmissionsStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card
        onClick={() => setSelectedEnquiry(enquiry.id)}
        className="p-4 cursor-pointer border-gray-100 hover:border-emerald-200 transition-all"
      >
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-sm">{enquiry.studentName}</h3>
          {enquiry.admissionNo && (
            <span className="text-[10px] text-gray-400 font-medium">{enquiry.admissionNo}</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-3">
          {enquiry.classApplyingFor} • Fees Paid
        </p>

        {enquiry.welcomeWhatsappSent && (
          <Badge variant="emerald" className="flex items-center gap-1.5 w-fit">
            <MessageCircle size={12} />
            Welcome WA Sent
          </Badge>
        )}
      </Card>
    </motion.div>
  );
}

export function DeclinedCard({ enquiry, index }: Props) {
  const { setSelectedEnquiry } = useAdmissionsStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card
        onClick={() => setSelectedEnquiry(enquiry.id)}
        className="p-4 cursor-pointer border-gray-100 hover:border-red-200 transition-all"
      >
        <h3 className="font-semibold text-red-500 text-sm mb-1">{enquiry.studentName}</h3>
        {enquiry.declineReason && (
          <p className="text-xs text-gray-400 leading-relaxed">{enquiry.declineReason}</p>
        )}
      </Card>
    </motion.div>
  );
}
