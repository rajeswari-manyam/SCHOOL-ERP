import type {
  Assignment,
  StudyMaterial,
  HomeworkResponse,
  StudyMaterialsResponse,
} from "../types/Homework.types";

// ─── Week days ──────────────────────────────────────────────────────────────────
export const mockWeekDays = [
  { label: "Mon 7",  dateIso: "2025-04-07", hasDue: true },
  { label: "Tue 8",  dateIso: "2025-04-08", hasDue: false },
  { label: "Wed 9",  dateIso: "2025-04-09", hasDue: true },
  { label: "Thu 10", dateIso: "2025-04-10", hasDue: false },
  { label: "Fri 11", dateIso: "2025-04-11", hasDue: true },
];

// ─── Assignments ────────────────────────────────────────────────────────────────
export const mockAssignments: Assignment[] = [
  {
    id: "HW001",
    subject: "ENGLISH",
    title: "Essay — My Favourite Festival",
    description:
      "Write a 200-word essay detailing the cultural significance, personal traditions, and festivities of your favourite national festival.",
    assignedBy: "Priya Reddy ma'am",
    dueDate: "2025-04-07",
    status: "SUBMITTED",
    submittedAt: "2025-04-06T10:30:00Z",
    attachments: [{ name: "essay-guidelines.pdf", url: "#", type: "PDF" }],
  },
  {
    id: "HW002",
    subject: "MATHEMATICS",
    title: "Exercise 5.3 — Quadratic Equations",
    description:
      "Solve problems 1-15 from the textbook chapter on Quadratic Formula application. Show all steps clearly.",
    assignedBy: "Kiran Kumar sir",
    dueDate: "2025-04-09",
    status: "NOT_SUBMITTED",
  },
  {
    id: "HW003",
    subject: "SCIENCE",
    title: "Lab Report — Photosynthesis Experiment",
    description:
      "Submit the detailed lab findings including observations on sunlight intensity effects on aquatic plant gas production.",
    assignedBy: "Venkat R sir",
    dueDate: "2025-04-11",
    status: "NOT_SUBMITTED",
    attachments: [{ name: "lab-template.docx", url: "#", type: "DOCX" }],
  },
  {
    id: "HW004",
    subject: "PHYSICS",
    title: "Light Reflection Lab Report",
    description:
      "Submit your observations from yesterday's lab experiment regarding concave mirrors.",
    assignedBy: "Anita Desai ma'am",
    dueDate: "2025-04-11",
    status: "NOT_SUBMITTED",
  },
  {
    id: "HW005",
    subject: "SOCIAL_STUDIES",
    title: "Map Work — Rivers of India",
    description:
      "Mark all major rivers of India on the outline map. Label each river and identify which states they pass through.",
    assignedBy: "Ramesh Kumar sir",
    dueDate: "2025-04-14",
    status: "NOT_SUBMITTED",
  },
  {
    id: "HW006",
    subject: "HINDI",
    title: "निबंध — मेरा प्रिय त्योहार",
    description:
      "अपने प्रिय त्योहार पर 300 शब्दों में निबंध लिखें। परिचय, मुख्य भाग और निष्कर्ष अनिवार्य हैं।",
    assignedBy: "Sunita Verma ma'am",
    dueDate: "2025-04-08",
    status: "GRADED",
    submittedAt: "2025-04-07T16:00:00Z",
    grade: "A",
  },
];

// ─── Study Materials ────────────────────────────────────────────────────────────
export const mockStudyMaterials: StudyMaterial[] = [
  {
    id: "SM001",
    title: "Grammar Notes.pdf",
    subject: "ENGLISH",
    className: "Class 10A",
    type: "PDF",
    uploadedAt: "2025-04-02",
    url: "#",
  },
  {
    id: "SM002",
    title: "Algebra Formula Sheet.pdf",
    subject: "MATHEMATICS",
    className: "Class 10A",
    type: "PDF",
    uploadedAt: "2025-04-01",
    url: "#",
  },
  {
    id: "SM003",
    title: "History Timeline.jpg",
    subject: "SOCIAL_STUDIES",
    className: "Class 10A",
    type: "JPG",
    uploadedAt: "2025-03-28",
    url: "#",
  },
  {
    id: "SM004",
    title: "Khan Academy — English Videos",
    subject: "MATHEMATICS",
    className: "Class 10A",
    type: "EXTERNAL",
    uploadedAt: "2025-03-25",
    url: "https://www.khanacademy.org",
    isExternal: true,
    externalLabel: "Khan Academy — English Videos",
  },
  {
    id: "SM005",
    title: "Essay Writing Guide.docx",
    subject: "ENGLISH",
    className: "Class 10A",
    type: "DOCX",
    uploadedAt: "2025-03-25",
    url: "#",
  },
  {
    id: "SM006",
    title: "Physics Formula Sheet.pdf",
    subject: "SCIENCE",
    className: "Class 10A",
    type: "PDF",
    uploadedAt: "2025-03-20",
    url: "#",
  },
];

// ─── Aggregated response mocks ───────────────────────────────────────────────────
export const mockHomeworkResponse: HomeworkResponse = {
  className: "Class 10A",
  academicYear: "2024-25",
  weekView: {
    days: mockWeekDays,
    selectedDate: "2025-04-07",
  },
  assignments: mockAssignments,
  pendingCount: 8,
  urgentCount: 3,
};

export const mockStudyMaterialsResponse: StudyMaterialsResponse = {
  materials: mockStudyMaterials,
  total: mockStudyMaterials.length,
};