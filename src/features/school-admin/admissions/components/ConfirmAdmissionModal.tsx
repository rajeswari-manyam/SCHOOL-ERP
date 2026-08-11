import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAdmissionsStore } from '../hooks/useAdmissionsStore';
import { useEnquiries, useConfirmAdmission } from '../hooks/useAdmissionsQueries';
// Tenant-scoped (/tenant/school-profile) — NOT "@/services/settings.api",
// whose fetchSchoolProfile hits an org/super-admin-only endpoint that 401s
// for a school-admin token and force-logs-out the session.
import { fetchSchoolProfile } from '@/features/school-admin/settings/api/settings.api';
import { useAuthStore } from '@/store/authStore';
import type { ConfirmAdmissionFormData } from '../types';

const schema = z.object({
  section: z.string().min(1, 'Required'),
  rollNumber: z.string().min(1, 'Required'),
  firstDayOfSchool: z.string().min(1, 'Required'),
  notes: z.string().optional(),
});

const ANNUAL_FEE = 18500;
const ADM_NO_PREFIX = 'ADM-2025-343';
const sectionOptions = ['A', 'B', 'C', 'D'].map(s => ({ label: s, value: s }));

export function ConfirmAdmissionModal() {
  const { isConfirmAdmissionOpen, confirmTargetId, closeConfirmAdmission } = useAdmissionsStore();
  const { data: enquiries } = useEnquiries();
  const confirmAdmission = useConfirmAdmission();
  const [schoolName, setSchoolName] = useState(() => localStorage.getItem("schoolName")?.trim() || "");
  const [principalName, setPrincipalName] = useState(() => useAuthStore.getState().user?.principalName?.trim() || "");

  useEffect(() => {
    if (isConfirmAdmissionOpen) {
      fetchSchoolProfile().then(profile => {
        if (profile.schoolName) setSchoolName(profile.schoolName);
        if (profile.principalName) setPrincipalName(profile.principalName);
      }).catch(() => {});
    }
  }, [isConfirmAdmissionOpen]);

  const enquiry = enquiries?.find((e) => e.id === confirmTargetId);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ConfirmAdmissionFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      section: 'A',
      rollNumber: '36',
      firstDayOfSchool: '2025-04-14',
    },
  });

  const section = watch('section');
  const firstDay = watch('firstDayOfSchool');

  const onSubmit = async (data: ConfirmAdmissionFormData) => {
    if (!confirmTargetId) return;
    await confirmAdmission.mutateAsync({ id: confirmTargetId, data });
    reset();
    closeConfirmAdmission();
  };

  if (!enquiry) return null;

  const formattedFirstDay = firstDay
    ? new Date(firstDay).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '14 April 2025';

  return (
    <AnimatePresence>
      {isConfirmAdmissionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeConfirmAdmission}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                  Confirm Admission — {enquiry.studentName}
                </h2>
                <Button
                  onClick={closeConfirmAdmission}
                  variant="ghost"
                  size="sm"
                  className="p-1.5"
                >
                  <X size={20} />
                </Button>
              </div>

              {/* Student Info */}
              <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-gray-400">STUDENT</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{enquiry.studentName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-gray-400">PARENT</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{enquiry.parentName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-gray-400">CLASS</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{enquiry.classApplyingFor}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-gray-400">ADMISSION NO</p>
                  <Badge variant="default" className="mt-0.5">
                    {ADM_NO_PREFIX}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-gray-400">ANNUAL FEE</p>
                  <p className="font-semibold text-gray-900 mt-0.5">₹{ANNUAL_FEE.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-gray-400">ENQUIRY DATE</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{enquiry.enquiryDate}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1">SECTION</Label>
                    <Select
                      {...register('section')}
                      options={sectionOptions}
                      onValueChange={(value) => {
                        register('section').onChange({ target: { value } });
                      }}
                    />
                  </div>
                  <div>
                    <Label className="mb-1">ROLL NUMBER</Label>
                    <Input
                      {...register('rollNumber')}
                      variant={errors.rollNumber ? 'error' : 'default'}
                    />
                    {errors.rollNumber && <p className="text-red-500 text-xs mt-1">{errors.rollNumber.message}</p>}
                  </div>
                </div>

                <div>
                  <Label className="mb-1">FIRST DAY OF SCHOOL</Label>
                  <Input
                    type="date"
                    {...register('firstDayOfSchool')}
                  />
                </div>

                <div>
                  <Label className="mb-1">NOTES</Label>
                  <Textarea
                    {...register('notes')}
                    placeholder="Add optional admission notes..."
                    size="sm"
                  />
                </div>

                {/* WhatsApp Preview */}
                <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                  <p className="text-xs font-bold text-green-700 tracking-wider mb-3">WELCOME WHATSAPP PREVIEW</p>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      Welcome to <strong>{schoolName}!</strong> {enquiry.studentName} has been admitted to{' '}
                      {enquiry.classApplyingFor}{section}. Admission No: {ADM_NO_PREFIX}. First day: {formattedFirstDay}. Fee: ₹
                      {ANNUAL_FEE.toLocaleString()}/year. We look forward to seeing you!
                      <br />
                      <br />— <strong>Principal {principalName}</strong>
                    </p>
                    <div className="flex justify-end items-center gap-1 mt-1">
                      <span className="text-[10px] text-gray-400">
                        {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-blue-500 text-xs">✓✓</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-1">
                  <Button
                    type="button"
                    onClick={closeConfirmAdmission}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={confirmAdmission.isPending}
                    variant="default"
                  >
                    <MessageCircle size={14} />
                    {confirmAdmission.isPending ? 'Confirming...' : 'Confirm & Send Welcome WhatsApp'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
