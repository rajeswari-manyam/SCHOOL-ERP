import type { Homework, StudyMaterial } from "../types/homework.types";

export const homeworkMock: Homework[] = [
  {
    id: "1",
    title: "Essay — My Favourite Festival",
    subject: "English",
    description:
      "Write a 500-word essay detailing your favorite Indian festival. Include cultural significance and personal memories. Ensure proper structure: Introduction, Body paragraphs, and Conclusion.",
    dueDate: "Due Tomorrow",
    dueUrgency: "urgent",
    assignedBy: "Priya Reddy",
    submitted: false,
    attachment: "essay-guidelines.pdf",
    weekDay: "MON",
    weekDate: 7,
  },
  {
    id: "2",
    title: "Exercise 5.3",
    subject: "Mathematics",
    description:
      "Complete all problems from Exercise 5.3 (Arithmetic Progressions). Focus on the 'Sum of N terms' formulas. Show detailed step-by-step calculations for all problems.",
    dueDate: "Due in 3 days",
    dueUrgency: "medium",
    assignedBy: "Kiran Kumar",
    submitted: false,
    weekDay: "WED",
    weekDate: 9,
  },
  {
    id: "3",
    title: "Lab Report — Light Reflection",
    subject: "Science",
    description:
      "Submit the lab report for last week's optics experiment. Include your observations, ray diagrams for convex lenses, and the final calculation for focal length.",
    dueDate: "Due in 5 days",
    dueUrgency: "normal",
    assignedBy: "Venkat R",
    submitted: false,
    attachment: "lab-manual.pdf",
    weekDay: "FRI",
    weekDate: 11,
  },
  {
    id: "4",
    title: "Chapter 3 — Summary Notes",
    subject: "SST",
    description:
      "Write a one-page summary of Chapter 3 (The Rise of Nationalism). Focus on key events, dates, and important personalities.",
    dueDate: "Due in 7 days",
    dueUrgency: "normal",
    assignedBy: "Anitha Devi",
    submitted: true,
    weekDay: "THU",
    weekDate: 10,
  },
  {
    id: "5",
    title: "Poem Recitation",
    subject: "Hindi",
    description:
      "Memorize and recite the poem 'Maati Wali' from Chapter 2. Practice pronunciation and expression. Duration: 2-3 minutes.",
    dueDate: "Due in 2 days",
    dueUrgency: "medium",
    assignedBy: "Sunita Sharma",
    submitted: false,
    weekDay: "TUE",
    weekDate: 8,
  },
  {
    id: "6",
    title: "Quadratic Equations — Practice Set",
    subject: "Mathematics",
    description:
      "Solve all 20 problems in the practice set on Quadratic Equations. Show all steps. Attempt both factorization and formula methods.",
    dueDate: "Due in 6 days",
    dueUrgency: "normal",
    assignedBy: "Kiran Kumar",
    submitted: false,
    weekDay: "FRI",
    weekDate: 11,
  },
];

export const materialsMock: StudyMaterial[] = [
  {
    id: "1",
    title: "Grammar Notes.pdf",
    subject: "English",
    type: "pdf",
    uploadedDate: "2 Apr",
  },
  {
    id: "2",
    title: "Algebra Formula Sheet.pdf",
    subject: "Mathematics",
    type: "pdf",
    uploadedDate: "1 Apr",
  },
  {
    id: "3",
    title: "History Timeline.jpg",
    subject: "SST",
    type: "image",
    uploadedDate: "28 Mar",
  },
  {
    id: "4",
    title: "Khan Academy — English Videos",
    subject: "Mathematics",
    type: "link",
    uploadedDate: "25 Mar",
    url: "https://www.khanacademy.org",
  },
  {
    id: "5",
    title: "Essay Writing Guide.docx",
    subject: "English",
    type: "doc",
    uploadedDate: "25 Mar",
  },
  {
    id: "6",
    title: "Physics Formula Sheet.pdf",
    subject: "Science",
    type: "pdf",
    uploadedDate: "20 Mar",
  },
];

export const scheduleWeek = [
  { day: "MON", date: 7, hasAssignment: true },
  { day: "TUE", date: 8, hasAssignment: true },
  { day: "WED", date: 9, hasAssignment: true },
  { day: "THU", date: 10, hasAssignment: false },
  { day: "FRI", date: 11, hasAssignment: true },
];

export const upcomingExam = {
  label: "UPCOMING EXAM",
  title: "Mathematics Unit Test",
  date: "April 15, 2024",
};