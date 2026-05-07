import type {
  Enquiry,
  PipelineStage,
  NewEnquiryFormData,
  ConfirmAdmissionFormData,
  PipelineStats,
} from '../types';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

let mockEnquiries: Enquiry[] = [
  {
    id: '1',
    studentName: 'Arjun Reddy',
    parentName: 'Ramesh K',
    parentPhone: '+91 98765 43210',
    classApplyingFor: 'Class 7',
    dateOfBirth: '15 June 2014',
    enquiryDate: 'Oct 12, 2024',
    source: 'walk-in',
    stage: 'enquiry',
    whatsappSent: true,
    counselorNote: 'Interested in science stream, needs transport facility.',
    statusHistory: [
      { status: 'Enquiry added', date: '2 Apr', note: 'WhatsApp sent automatically' },
      { status: 'Interview scheduled', date: '4 Apr', note: 'Set for 10 Apr, 10:30 AM' },
    ],
  },
  {
    id: '2',
    studentName: 'Priya Menon',
    parentName: 'Suresh Menon',
    parentPhone: '+91 98765 43210',
    classApplyingFor: 'Grade 1',
    enquiryDate: 'Oct 14, 2024',
    source: 'referral',
    stage: 'enquiry',
    whatsappSent: false,
  },
  {
    id: '3',
    studentName: 'Zayn Malik',
    parentName: 'Imran Malik',
    parentPhone: '+91 99887 76655',
    classApplyingFor: 'Grade 8',
    enquiryDate: 'Oct 15, 2024',
    source: 'phone',
    stage: 'enquiry',
  },
  {
    id: '4',
    studentName: 'Sakshi Patel',
    parentName: 'Ravi Patel',
    parentPhone: '+91 91234 56789',
    classApplyingFor: 'Grade 5',
    enquiryDate: 'Oct 13, 2024',
    source: 'social_media',
    stage: 'interview',
    interviewDate: 'Oct 24, 10:30 AM',
  },
  {
    id: '5',
    studentName: 'Ishaan Kapoor',
    parentName: 'Deepak Kapoor',
    parentPhone: '+91 93456 78901',
    classApplyingFor: 'Grade 3',
    enquiryDate: 'Oct 11, 2024',
    source: 'referral',
    stage: 'interview',
    interviewNote: "Waiting for principal's slot confirmation.",
  },
  {
    id: '6',
    studentName: 'Kiran Sharma',
    parentName: 'Vijay Sharma',
    parentPhone: '+91 94567 89012',
    classApplyingFor: 'Grade 6',
    enquiryDate: 'Oct 9, 2024',
    source: 'walk-in',
    stage: 'docs_verified',
    documents: [
      { name: 'Birth Certificate', status: 'verified' },
      { name: 'Transfer Certificate', status: 'verified' },
      { name: 'Aadhaar Card', status: 'verified' },
    ],
  },
  {
    id: '7',
    studentName: 'Ananya Das',
    parentName: 'Subhash Das',
    parentPhone: '+91 95678 90123',
    classApplyingFor: 'Grade 4',
    enquiryDate: 'Oct 8, 2024',
    source: 'website',
    stage: 'docs_verified',
    documents: [
      { name: 'Previous Marksheet', status: 'pending' },
    ],
  },
  {
    id: '8',
    studentName: 'Meena Devi',
    admissionNo: '#ADM2025-042',
    parentName: 'Krishna Devi',
    parentPhone: '+91 96789 01234',
    classApplyingFor: 'Grade 2',
    enquiryDate: 'Oct 5, 2024',
    source: 'referral',
    stage: 'confirmed',
    welcomeWhatsappSent: true,
    annualFee: 18500,
    section: 'A',
    rollNumber: '22',
  },
  {
    id: '9',
    studentName: 'Rahul Bose',
    admissionNo: '#ADM2025-039',
    parentName: 'Sanjay Bose',
    parentPhone: '+91 97890 12345',
    classApplyingFor: 'Grade 5',
    enquiryDate: 'Oct 3, 2024',
    source: 'social_media',
    stage: 'confirmed',
    welcomeWhatsappSent: true,
    annualFee: 18500,
  },
  {
    id: '10',
    studentName: 'Rakesh Kumar',
    parentName: 'Anil Kumar',
    parentPhone: '+91 98901 23456',
    classApplyingFor: 'Grade 3',
    enquiryDate: 'Oct 1, 2024',
    source: 'walk-in',
    stage: 'declined',
    declineReason: 'Relocated to another city before completion.',
  },
  {
    id: '11',
    studentName: 'Sania Mirza',
    parentName: 'Feroz Mirza',
    parentPhone: '+91 99012 34567',
    classApplyingFor: 'Grade 1',
    enquiryDate: 'Sep 28, 2024',
    source: 'phone',
    stage: 'declined',
    declineReason: 'Age criteria not met for Grade 1 admission.',
  },
];

let nextId = 12;

export const admissionsApi = {
  async getEnquiries(): Promise<Enquiry[]> {
    await delay(400);
    return [...mockEnquiries];
  },

  async getEnquiryById(id: string): Promise<Enquiry | null> {
    await delay(200);
    return mockEnquiries.find((e) => e.id === id) ?? null;
  },

  async getPipelineStats(): Promise<PipelineStats> {
    await delay(200);
    const total = mockEnquiries.filter((e) => e.stage !== 'declined').length;
    const confirmed = mockEnquiries.filter((e) => e.stage === 'confirmed').length;
    return {
      enquiries: mockEnquiries.filter((e) => e.stage === 'enquiry').length,
      interviews: mockEnquiries.filter((e) => e.stage === 'interview').length,
      docsVerified: mockEnquiries.filter((e) => e.stage === 'docs_verified').length,
      confirmed,
      declined: mockEnquiries.filter((e) => e.stage === 'declined').length,
      conversionRate: total > 0 ? Math.round((confirmed / mockEnquiries.length) * 100) : 0,
    };
  },

  async addEnquiry(data: NewEnquiryFormData): Promise<Enquiry> {
    await delay(600);
    const newEnquiry: Enquiry = {
      id: String(nextId++),
      studentName: data.studentName,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      parentEmail: data.parentEmail,
      dateOfBirth: data.dateOfBirth,
      classApplyingFor: data.classApplyingFor,
      enquiryDate: new Date(data.enquiryDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      source: data.source,
      referredBy: data.referredBy,
      notes: data.notes,
      stage: 'enquiry',
      whatsappSent: true,
      statusHistory: [{ status: 'Enquiry added', date: 'Today', note: 'WhatsApp sent automatically' }],
    };
    mockEnquiries = [newEnquiry, ...mockEnquiries];
    return newEnquiry;
  },

  async moveToStage(id: string, stage: PipelineStage): Promise<Enquiry> {
    await delay(400);
    mockEnquiries = mockEnquiries.map((e) =>
      e.id === id
        ? {
            ...e,
            stage,
            statusHistory: [
              ...(e.statusHistory ?? []),
              { status: `Moved to ${stage.replace('_', ' ')}`, date: 'Today' },
            ],
          }
        : e,
    );
    return mockEnquiries.find((e) => e.id === id)!;
  },

  async confirmAdmission(id: string, data: ConfirmAdmissionFormData): Promise<Enquiry> {
    await delay(600);
    const admNo = `ADM-2025-${String(300 + nextId).padStart(3, '0')}`;
    mockEnquiries = mockEnquiries.map((e) =>
      e.id === id
        ? {
            ...e,
            stage: 'confirmed',
            admissionNo: `#${admNo}`,
            section: data.section,
            rollNumber: data.rollNumber,
            firstDayOfSchool: data.firstDayOfSchool,
            welcomeWhatsappSent: true,
            notes: data.notes,
            statusHistory: [
              ...(e.statusHistory ?? []),
              { status: 'Admission confirmed', date: 'Today', note: 'Welcome WhatsApp sent' },
            ],
          }
        : e,
    );
    return mockEnquiries.find((e) => e.id === id)!;
  },

  async declineEnquiry(id: string, reason: string): Promise<Enquiry> {
    await delay(400);
    mockEnquiries = mockEnquiries.map((e) =>
      e.id === id ? { ...e, stage: 'declined', declineReason: reason } : e,
    );
    return mockEnquiries.find((e) => e.id === id)!;
  },
};
