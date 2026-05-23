import { X, Phone, MessageCircle, ArrowRight, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmissionsStore } from '../hooks/useAdmissionsStore';
import { useEnquiries, useMoveToStage } from '../hooks/useAdmissionsQueries';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';

const stageBadgeVariants: Record<string, 'default' | 'success' | 'error' | 'warning'> = {
  enquiry: 'default',
  interview: 'warning',
  docs_verified: 'default',
  confirmed: 'success',
  declined: 'error',
};

export function EnquiryDetailDrawer() {
  const { selectedEnquiryId, setSelectedEnquiry, openConfirmAdmission } = useAdmissionsStore();
  const { data: enquiries } = useEnquiries();
  const moveToStage = useMoveToStage();

  const enquiry = enquiries?.find((e) => e.id === selectedEnquiryId);

  return (
    <AnimatePresence>
      {selectedEnquiryId && enquiry && (
        <div className="fixed inset-0 z-40 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEnquiry(null)}
            className="flex-1 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-md bg-white shadow-2xl overflow-y-auto"
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{enquiry.studentName}</h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant={stageBadgeVariants[enquiry.stage] ?? 'default'}>
                      {enquiry.stage.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="gray">
                      {enquiry.source?.replace('_', '-').toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-400">4 days ago</span>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedEnquiry(null)}
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <X size={20} />
                </Button>
              </div>

              {/* Parent Details */}
              <section className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-semibold tracking-wider text-gray-400">PARENT DETAILS</p>
                  {enquiry.whatsappSent && (
                    <Badge variant="green">
                      WA sent on {enquiry.enquiryDate}
                    </Badge>
                  )}
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 text-sm font-bold">
                        {enquiry.parentName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{enquiry.parentName}</p>
                      <p className="text-sm text-gray-500">{enquiry.parentPhone}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                      <Phone size={14} /> Call
                    </Button>
                    <Button className="flex-1 gap-1.5 bg-green-500 hover:bg-green-600">
                      <MessageCircle size={14} /> Send WhatsApp
                    </Button>
                  </div>
                </div>
              </section>

              {/* Enquiry Details */}
              <section className="mb-5">
                <p className="text-[11px] font-semibold tracking-wider text-gray-400 mb-2">ENQUIRY DETAILS</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Applied For</p>
                    <p className="font-semibold text-gray-900 text-sm">{enquiry.classApplyingFor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Date of Birth</p>
                    <p className="font-semibold text-gray-900 text-sm">{enquiry.dateOfBirth ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Lead Source</p>
                    <p className="font-semibold text-gray-900 text-sm capitalize">{enquiry.source?.replace('_', '-')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Enquiry Date</p>
                    <p className="font-semibold text-gray-900 text-sm">{enquiry.enquiryDate}</p>
                  </div>
                </div>
              </section>

              {/* Counselor Note */}
              {enquiry.counselorNote && (
                <section className="mb-5">
                  <div className="bg-indigo-50 border-l-4 border-indigo-400 rounded-r-xl p-3">
                    <p className="text-[11px] font-semibold tracking-wider text-indigo-400 mb-1">COUNSELOR NOTE</p>
                    <p className="text-sm text-gray-700 italic">"{enquiry.counselorNote}"</p>
                  </div>
                </section>
              )}

              {/* Status History */}
              {enquiry.statusHistory && enquiry.statusHistory.length > 0 && (
                <section className="mb-5">
                  <p className="text-[11px] font-semibold tracking-wider text-gray-400 mb-3">STATUS HISTORY</p>
                  <div className="space-y-3">
                    {enquiry.statusHistory.map((h, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${i === 0 ? 'bg-indigo-500' : 'bg-amber-400'}`} />
                          {i < enquiry.statusHistory!.length - 1 && (
                            <div className="w-px flex-1 bg-gray-200 mt-1" />
                          )}
                        </div>
                        <div className="pb-3">
                          <p className="text-sm font-semibold text-gray-900">{h.status}</p>
                          <p className="text-xs text-gray-400">
                            {h.date}{h.note && ` • ${h.note}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Actions */}
              {enquiry.stage !== 'confirmed' && enquiry.stage !== 'declined' && (
                <section className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-wider text-gray-400 mb-2">ACTIONS</p>

                  {enquiry.stage === 'enquiry' && (
                    <Button
                      onClick={() => moveToStage.mutate({ id: enquiry.id, stage: 'interview' })}
                      className="w-full gap-2"
                    >
                      Move to Interview <ArrowRight size={16} />
                    </Button>
                  )}

                  {enquiry.stage === 'interview' && (
                    <Button
                      onClick={() => moveToStage.mutate({ id: enquiry.id, stage: 'docs_verified' })}
                      className="w-full gap-2"
                    >
                      Move to Docs <ArrowRight size={16} />
                    </Button>
                  )}

                  {enquiry.stage === 'docs_verified' && (
                    <Button
                      onClick={() => { openConfirmAdmission(enquiry.id); setSelectedEnquiry(null); }}
                      className="w-full gap-2"
                    >
                      Confirm Admission <ArrowRight size={16} />
                    </Button>
                  )}

                  <Button variant="outline" className="w-full gap-2">
                    <Calendar size={14} /> Schedule Interview
                  </Button>

                  <Button variant="outline" className="w-full gap-2 border-green-200 text-green-600 hover:bg-green-50">
                    <MessageCircle size={14} /> Send WhatsApp Update
                  </Button>

                  <Button variant="link" className="w-full text-red-500 hover:text-red-700">
                    Decline Enquiry
                  </Button>
                </section>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
