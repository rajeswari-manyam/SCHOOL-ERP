import type { Admission, AdmissionDocument, AddEnquiryFormData, ConfirmAdmissionFormData } from "../types/admissions.types";

// ─── Mock Data ────────────────────────────────────────────────────────────────

let MOCK_ADMISSIONS: Admission[] = [
  // ENQUIRY stage
  {
    id: "enq-1",
    studentName: "Arjun Reddy",
    parentName: "Vikram Reddy",
    parentPhone: "+91 98765 43210",
    classApplied: "4",
    source: "Social Media",
    stage: "ENQUIRY",
    enquiryDate: "12 Oct 2024",
    dob: "2015-03-14",
  },
  {
    id: "enq-2",
    studentName: "Priya Menon",
    parentName: "Sunita Menon",
    parentPhone: "+91 98765 43210",
    classApplied: "1",
    source: "Referral",
    stage: "ENQUIRY",
    enquiryDate: "13 Oct 2024",
    dob: "2018-07-22",
  },
  {
    id: "enq-3",
    studentName: "Zayn Malik",
    parentName: "Imran Malik",
    parentPhone: "+91 97654 32100",
    classApplied: "8",
    source: "Phone Inquiry",
    stage: "ENQUIRY",
    enquiryDate: "14 Oct 2024",
    counselorNote: "Interested in science stream, needs transport facility.",
  },
  // INTERVIEW stage
  {
    id: "enq-4",
    studentName: "Sakshi Patel",
    parentName: "Dinesh Patel",
    parentPhone: "+91 87654 32109",
    classApplied: "5",
    source: "Walk-in",
    stage: "INTERVIEW",
    enquiryDate: "10 Oct 2024",
    interviewDate: "24 Oct 2024",
    interviewTime: "10:30 AM",
  },
  {
    id: "enq-5",
    studentName: "Ishaan Kapoor",
    parentName: "Rahul Kapoor",
    parentPhone: "+91 76543 21098",
    classApplied: "3",
    source: "Referral",
    stage: "INTERVIEW",
    enquiryDate: "11 Oct 2024",
    interviewNote: "Waiting for principal's slot confirmation.",
  },
  // DOCS_VERIFIED stage
  {
    id: "enq-6",
    studentName: "Kiran Sharma",
    parentName: "Anil Sharma",
    parentPhone: "+91 65432 10987",
    classApplied: "6",
    source: "Website",
    stage: "DOCS_VERIFIED",
    enquiryDate: "5 Oct 2024",
    documents: [
      { id: "d1", name: "Birth Certificate", verified: true },
      { id: "d2", name: "Transfer Certificate", verified: true },
      { id: "d3", name: "Aadhaar Card", verified: true },
    ],
  },
  {
    id: "enq-7",
    studentName: "Ananya Das",
    parentName: "Suresh Das",
    parentPhone: "+91 54321 09876",
    classApplied: "2",
    source: "Walk-in",
    stage: "DOCS_VERIFIED",
    enquiryDate: "6 Oct 2024",
    documents: [
      { id: "d4", name: "Birth Certificate", verified: true },
      { id: "d5", name: "Previous Marksheet", verified: false },
      { id: "d6", name: "Aadhaar Card", verified: true },
    ],
  },
  // CONFIRMED stage
  {
    id: "enq-8",
    admissionNo: "ADM2025-042",
    studentName: "Meena Devi",
    parentName: "Raju Devi",
    parentPhone: "+91 43210 98765",
    classApplied: "2",
    section: "A",
    rollNumber: 15,
    annualFee: 18500,
    source: "Walk-in",
    stage: "CONFIRMED",
    enquiryDate: "1 Oct 2024",
    firstDayOfSchool: "14 Apr 2025",
    welcomeWhatsappSent: true,
  },
  {
    id: "enq-9",
    admissionNo: "ADM2025-039",
    studentName: "Rahul Bose",
    parentName: "Amit Bose",
    parentPhone: "+91 32109 87654",
    classApplied: "7",
    section: "B",
    rollNumber: 22,
    annualFee: 18500,
    source: "Referral",
    stage: "CONFIRMED",
    enquiryDate: "2 Oct 2024",
    firstDayOfSchool: "14 Apr 2025",
    welcomeWhatsappSent: true,
  },
  // DECLINED stage
  {
    id: "enq-10",
    studentName: "Rakesh Kumar",
    parentName: "Sunil Kumar",
    parentPhone: "+91 21098 76543",
    classApplied: "9",
    source: "Social Media",
    stage: "DECLINED",
    enquiryDate: "8 Oct 2024",
    declineReason: "Relocated to another city before completion.",
  },
  {
    id: "enq-11",
    studentName: "Sania Mirza",
    parentName: "Irfan Mirza",
    parentPhone: "+91 10987 65432",
    classApplied: "1",
    source: "Walk-in",
    stage: "DECLINED",
    enquiryDate: "9 Oct 2024",
    declineReason: "Age criteria not met for Grade 1 admission.",
  },
];

// ─── Simulated API ────────────────────────────────────────────────────────────

export const admissionsApi = {
  getAll: async (): Promise<Admission[]> => {
    await new Promise(r => setTimeout(r, 300));
    return [...MOCK_ADMISSIONS];
  },

  getById: async (id: string): Promise<Admission | undefined> => {
    await new Promise(r => setTimeout(r, 200));
    return MOCK_ADMISSIONS.find(a => a.id === id);
  },

  create: async (data: AddEnquiryFormData): Promise<Admission> => {
    await new Promise(r => setTimeout(r, 500));
    const newAdmission: Admission = {
      id: `enq-${Date.now()}`,
      studentName: data.studentName,
      parentName: data.parentName,
      parentPhone: `+91 ${data.parentPhone}`,
      parentEmail: data.parentEmail || undefined,
      dob: data.dob || undefined,
      classApplied: data.classApplied,
      source: data.source as Admission["source"],
      referredBy: data.referredBy || undefined,
      enquiryDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      stage: "ENQUIRY",
      notes: data.notes || undefined,
    };
    MOCK_ADMISSIONS = [newAdmission, ...MOCK_ADMISSIONS];
    return newAdmission;
  },

  moveToInterview: async (id: string, date?: string, time?: string): Promise<Admission> => {
    await new Promise(r => setTimeout(r, 300));
    MOCK_ADMISSIONS = MOCK_ADMISSIONS.map(a =>
      a.id === id ? { ...a, stage: "INTERVIEW", interviewDate: date, interviewTime: time } : a
    );
    return MOCK_ADMISSIONS.find(a => a.id === id)!;
  },

  moveToDocs: async (id: string): Promise<Admission> => {
    await new Promise(r => setTimeout(r, 300));
    const defaultDocs: AdmissionDocument[] = [
      { id: "d-bc", name: "Birth Certificate", verified: false },
      { id: "d-tc", name: "Transfer Certificate", verified: false },
      { id: "d-id", name: "Aadhaar Card", verified: false },
    ];
    MOCK_ADMISSIONS = MOCK_ADMISSIONS.map(a =>
      a.id === id ? { ...a, stage: "DOCS_VERIFIED", documents: defaultDocs } : a
    );
    return MOCK_ADMISSIONS.find(a => a.id === id)!;
  },

  confirmAdmission: async (id: string, data: ConfirmAdmissionFormData): Promise<Admission> => {
    await new Promise(r => setTimeout(r, 400));
    const adm = MOCK_ADMISSIONS.find(a => a.id === id)!;
    const admissionNo = `ADM${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
    const confirmed: Admission = {
      ...adm,
      stage: "CONFIRMED",
      admissionNo,
      section: data.section,
      rollNumber: data.rollNumber ? Number(data.rollNumber) : undefined,
      firstDayOfSchool: data.firstDayOfSchool,
      annualFee: data.annualFee ? Number(data.annualFee) : 18500,
      notes: data.notes || adm.notes,
      welcomeWhatsappSent: false,
    };
    MOCK_ADMISSIONS = MOCK_ADMISSIONS.map(a => a.id === id ? confirmed : a);
    return confirmed;
  },

  declineAdmission: async (id: string, reason: string): Promise<Admission> => {
    await new Promise(r => setTimeout(r, 300));
    MOCK_ADMISSIONS = MOCK_ADMISSIONS.map(a =>
      a.id === id ? { ...a, stage: "DECLINED", declineReason: reason } : a
    );
    return MOCK_ADMISSIONS.find(a => a.id === id)!;
  },

  toggleDocVerified: async (admissionId: string, docId: string): Promise<Admission> => {
    await new Promise(r => setTimeout(r, 200));
    MOCK_ADMISSIONS = MOCK_ADMISSIONS.map(a => {
      if (a.id !== admissionId) return a;
      return {
        ...a,
        documents: a.documents?.map(d => d.id === docId ? { ...d, verified: !d.verified } : d),
      };
    });
    return MOCK_ADMISSIONS.find(a => a.id === admissionId)!;
  },

  markWhatsappSent: async (id: string, type: "enquiry" | "welcome"): Promise<Admission> => {
    await new Promise(r => setTimeout(r, 200));
    MOCK_ADMISSIONS = MOCK_ADMISSIONS.map(a =>
      a.id === id
        ? { ...a, whatsappSent: type === "enquiry" ? true : a.whatsappSent, welcomeWhatsappSent: type === "welcome" ? true : a.welcomeWhatsappSent }
        : a
    );
    return MOCK_ADMISSIONS.find(a => a.id === id)!;
  },
};