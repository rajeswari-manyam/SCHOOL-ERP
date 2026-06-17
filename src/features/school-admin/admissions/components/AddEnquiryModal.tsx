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
import { useAddEnquiry } from '../hooks/useAdmissionsQueries';
import { fetchSchoolProfile } from '@/services/school-settings.api';
import type { NewEnquiryFormData } from '../types';

const schema = z.object({
  parentName: z.string().min(2, 'Required'),
  parentPhone: z.string().min(10, 'Valid phone required'),
  parentEmail: z.string().email().optional().or(z.literal('')),
  studentName: z.string().min(2, 'Required'),
  dateOfBirth: z.string().optional(),
  classApplyingFor: z.string().min(1, 'Select a class'),
  enquiryDate: z.string().min(1, 'Required'),
  source: z.enum(['walk-in', 'social_media', 'referral', 'phone', 'website', 'other']),
  referredBy: z.string().optional(),
  notes: z.string().optional(),
});

const classes = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)];
const classOptions = classes.map(c => ({ label: c, value: c }));

const sourceOptions = [
  { label: 'Walk-in', value: 'walk-in' },
  { label: 'Social Media', value: 'social_media' },
  { label: 'Referral', value: 'referral' },
  { label: 'Phone', value: 'phone' },
  { label: 'Website', value: 'website' },
  { label: 'Other', value: 'other' },
];

export function AddEnquiryModal() {
  const { isAddEnquiryOpen, closeAddEnquiry } = useAdmissionsStore();
  const addEnquiry = useAddEnquiry();
  const [schoolName, setSchoolName] = useState('Hanamkonda Public School');
  const [principalName, setPrincipalName] = useState('Ramesh Kumar');

  useEffect(() => {
    if (isAddEnquiryOpen) {
      fetchSchoolProfile().then(profile => {
        if (profile.schoolName) setSchoolName(profile.schoolName);
        if (profile.principalName) setPrincipalName(profile.principalName);
      }).catch(() => {});
    }
  }, [isAddEnquiryOpen]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewEnquiryFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      enquiryDate: new Date().toISOString().split('T')[0],
      source: 'walk-in',
    },
  });

  const parentName = watch('parentName');
  const classFor = watch('classApplyingFor');

  const onSubmit = async (data: NewEnquiryFormData) => {
    await addEnquiry.mutateAsync(data);
    reset();
    closeAddEnquiry();
  };

  return (
    <AnimatePresence>
      {isAddEnquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAddEnquiry}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="
              relative bg-white w-full
              rounded-t-2xl sm:rounded-2xl
              shadow-2xl
              max-h-[92vh] sm:max-h-[90vh]
              overflow-y-auto
              sm:max-w-2xl
            "
          >
            {/* Drag handle — mobile only */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                    New Admission Enquiry
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <p className="text-xs sm:text-sm text-gray-500">
                      A thank-you WhatsApp will be sent automatically
                    </p>
                    <Badge variant="green" className="flex items-center gap-1 shrink-0">
                      <MessageCircle size={10} />
                      WHATSAPP ACTIVE
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={closeAddEnquiry}
                  variant="ghost"
                  size="sm"
                  className="p-1.5 shrink-0"
                >
                  <X size={20} />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                {/* Responsive 2-col grid → 1-col on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Parent Name */}
                  <div>
                    <Label className="mb-1">PARENT'S NAME *</Label>
                    <Input
                      {...register('parentName')}
                      placeholder="Father or Mother name"
                      variant={errors.parentName ? 'error' : 'default'}
                    />
                    {errors.parentName && (
                      <p className="text-red-500 text-xs mt-1">{errors.parentName.message}</p>
                    )}
                  </div>

                  {/* Class */}
                  <div>
                    <Label className="mb-1">CLASS APPLYING FOR *</Label>
                    <Select
                      {...register('classApplyingFor')}
                      options={classOptions}
                      placeholder="Select Class"
                      onValueChange={(value) => {
                        register('classApplyingFor').onChange({ target: { value } });
                      }}
                    />
                    {errors.classApplyingFor && (
                      <p className="text-red-500 text-xs mt-1">{errors.classApplyingFor.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label className="mb-1">PARENT'S PHONE *</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center px-3 py-2.5 rounded-xl bg-gray-100 text-sm font-medium text-gray-600 flex-shrink-0 border border-gray-300">
                        +91
                      </div>
                      <Input
                        {...register('parentPhone')}
                        placeholder="98765 43210"
                        variant={errors.parentPhone ? 'error' : 'default'}
                        className="min-w-0"
                      />
                    </div>
                    <p className="text-[11px] text-green-600 mt-1 flex items-center gap-1">
                      <MessageCircle size={10} />
                      WhatsApp message will be sent to this number
                    </p>
                    {errors.parentPhone && (
                      <p className="text-red-500 text-xs">{errors.parentPhone.message}</p>
                    )}
                  </div>

                  {/* Enquiry Date */}
                  <div>
                    <Label className="mb-1">ENQUIRY DATE *</Label>
                    <Input type="date" {...register('enquiryDate')} />
                  </div>

                  {/* Email */}
                  <div>
                    <Label className="mb-1">PARENT'S EMAIL</Label>
                    <Input
                      {...register('parentEmail')}
                      placeholder="optional"
                      type="email"
                    />
                  </div>

                  {/* Source */}
                  <div>
                    <Label className="mb-1">ENQUIRY SOURCE *</Label>
                    <Select
                      {...register('source')}
                      options={sourceOptions}
                      onValueChange={(value) => {
                        register('source').onChange({ target: { value } });
                      }}
                    />
                  </div>

                  {/* Student Name */}
                  <div>
                    <Label className="mb-1">STUDENT'S NAME *</Label>
                    <Input
                      {...register('studentName')}
                      placeholder="Child's full name"
                      variant={errors.studentName ? 'error' : 'default'}
                    />
                    {errors.studentName && (
                      <p className="text-red-500 text-xs mt-1">{errors.studentName.message}</p>
                    )}
                  </div>

                  {/* Referred By */}
                  <div>
                    <Label className="mb-1">REFERRED BY</Label>
                    <Input
                      {...register('referredBy')}
                      placeholder="Name of person who referred"
                    />
                  </div>

                  {/* DOB */}
                  <div>
                    <Label className="mb-1">DATE OF BIRTH</Label>
                    <Input type="date" {...register('dateOfBirth')} />
                  </div>

                  {/* Notes */}
                  <div>
                    <Label className="mb-1">NOTES</Label>
                    <Textarea
                      {...register('notes')}
                      placeholder="Any specific requirements or queries"
                      size="sm"
                    />
                  </div>
                </div>

                {/* WhatsApp Preview */}
                <div className="mt-5 rounded-xl bg-green-50 border border-green-100 p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-green-700 tracking-wider">
                      WHATSAPP PREVIEW
                    </span>
                    <span className="text-xs text-green-600">
                      Auto-sent immediately after adding
                    </span>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm max-w-xs ml-auto">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      Dear{' '}
                      <span className="font-medium">{parentName || 'Parent'} garu</span>,
                      <br />
                      Thank you for visiting{' '}
                      <span className="text-green-600 font-medium">
                        {schoolName}
                      </span>
                      . We will contact you within 24 hours regarding admission to{' '}
                      {classFor || 'the class'}.
                      <br />
                      <br />
                      — Principal {principalName}
                    </p>
                    <p className="text-right text-[10px] text-gray-400 mt-1">
                      {new Date().toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-5">
                  <Button
                    type="button"
                    onClick={closeAddEnquiry}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addEnquiry.isPending}
                    variant="default"
                    className="w-full sm:w-auto"
                  >
                    <MessageCircle size={14} />
                    {addEnquiry.isPending ? 'Adding...' : 'Add Enquiry & Send WhatsApp'}
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