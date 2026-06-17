import { MessageCircle, Phone, User } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Enquiry } from '../types';
import { useAdmissionsStore } from '../hooks/useAdmissionsStore';

interface Props {
  enquiry: Enquiry;
  index: number;
}

// Format date as "17 Jun 2026"
function fmtDate(d?: string) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Two-letter initials from a name
function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ConfirmedCard({ enquiry, index }: Props) {
  const { setSelectedEnquiry } = useAdmissionsStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <div
        onClick={() => setSelectedEnquiry(enquiry.id)}
        className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer hover:border-emerald-200 hover:shadow-sm transition-all"
      >
        {/* Avatar + name row */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[11px] font-bold text-emerald-700 shrink-0">
            {initials(enquiry.studentName || '?')}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate">
              {enquiry.studentName}
            </h3>
            {enquiry.classApplyingFor && (
              <p className="text-[11px] text-gray-500 leading-none mt-0.5">
                Class {enquiry.classApplyingFor}
              </p>
            )}
          </div>
          {enquiry.admissionNo && (
            <span className="ml-auto text-[10px] text-gray-400 font-mono shrink-0">
              #{enquiry.admissionNo}
            </span>
          )}
        </div>

        {/* Parent info */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
          <User size={10} className="shrink-0" />
          <span className="truncate">{enquiry.parentName}</span>
        </div>
        {enquiry.parentPhone && (
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-3">
            <Phone size={10} className="shrink-0" />
            <span>{enquiry.parentPhone}</span>
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Fees Paid
          </span>
          {enquiry.welcomeWhatsappSent && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-700 border border-green-100">
              <MessageCircle size={9} />
              WA Sent
            </span>
          )}
        </div>

        {/* Date */}
        {enquiry.enquiryDate && (
          <p className="text-[10px] text-gray-400 mt-2">
            {fmtDate(enquiry.enquiryDate)}
          </p>
        )}
      </div>
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
      <div
        onClick={() => setSelectedEnquiry(enquiry.id)}
        className="bg-white rounded-xl border border-red-100 p-4 cursor-pointer hover:border-red-200 hover:shadow-sm transition-all"
      >
        {/* Avatar + name row */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[11px] font-bold text-red-500 shrink-0">
            {initials(enquiry.studentName || '?')}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-red-500 text-sm leading-snug truncate">
              {enquiry.studentName}
            </h3>
            {enquiry.classApplyingFor && (
              <p className="text-[11px] text-gray-500 leading-none mt-0.5">
                Class {enquiry.classApplyingFor}
              </p>
            )}
          </div>
          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-500 border border-red-100 shrink-0">
            Declined
          </span>
        </div>

        {/* Parent info */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
          <User size={10} className="shrink-0" />
          <span className="truncate">{enquiry.parentName}</span>
        </div>
        {enquiry.parentPhone && (
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-3">
            <Phone size={10} className="shrink-0" />
            <span>{enquiry.parentPhone}</span>
          </div>
        )}

        {/* Decline reason */}
        {enquiry.declineReason && (
          <p className="text-[11px] text-gray-400 italic leading-relaxed mt-1">
            "{enquiry.declineReason}"
          </p>
        )}

        {/* Date */}
        {enquiry.enquiryDate && (
          <p className="text-[10px] text-gray-400 mt-2">
            {fmtDate(enquiry.enquiryDate)}
          </p>
        )}
      </div>
    </motion.div>
  );
}
