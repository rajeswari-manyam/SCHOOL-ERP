// Mock data for Attendance Dashboard — mirrors the screenshot (Ravi Kumar, April 2025)

export const mockStudent = {
  id: "STU001",
  name: "Ravi Kumar",
  className: "Class 10A",
  academicYear: "2024-25",
  rollNo: "01",
  schoolName: "Hamankonda Public School",
};

export const mockCurrentMonth = {
  month: "April",
  year: 2025,
  totalSchoolDays: 24,
  daysPresent: 22,
  daysAbsent: 2,
  percentage: 91.7,
  days: [
    // Week 1
    { date: 1,  status: "PRESENT" },
    { date: 2,  status: "PRESENT" },
    { date: 3,  status: "PRESENT" },
    { date: 4,  status: "PRESENT" },
    { date: 5,  status: "ABSENT",  alertSentAt: "9:12 AM",  alertChannel: "WhatsApp" },
    { date: 6,  status: "ABSENT",  alertSentAt: "8:52 AM",  alertChannel: "WhatsApp" },
    // Week 2
    { date: 7,  status: "PRESENT" },
    { date: 8,  status: "PRESENT" },
    { date: 9,  status: "PRESENT" },
    { date: 10, status: "HOLIDAY" },
    { date: 11, status: "PRESENT" },
    { date: 12, status: "PRESENT" },
    { date: 13, status: "HOLIDAY" },
    // Week 3
    { date: 14, status: "PRESENT" },
    { date: 15, status: "PRESENT" },
    { date: 16, status: "PRESENT" },
    { date: 17, status: "PRESENT" },
    { date: 18, status: "PRESENT" },
    { date: 19, status: "PRESENT" },
    { date: 20, status: "HOLIDAY" },
    // Week 4
    { date: 21, status: "PRESENT" },
    { date: 22, status: "PRESENT" },
    { date: 23, status: "PRESENT" },
    { date: 24, status: "PRESENT" },
    { date: 25, status: "PRESENT" },
    { date: 26, status: "PRESENT" },
    { date: 27, status: "HOLIDAY" },
  ],
};

export const mockYearSummary = {
  academicYear: "2024-25",
  totalSchoolDays: 198,
  daysPresent: 182,
  daysAbsent: 16,
  percentage: 91.9,
};

export const mockPolicy = {
  minimumPercentage: 75,
  canMissMoreDays: 12,
  safetyMargin: 16.7,
  status: "SAFE" as const,
};

export const mockAbsentDays = [
  {
    date: "5 April 2025 (Saturday)",
    alertSentAt: "9:12 AM",
    alertChannel: "WhatsApp" as const,
  },
  {
    date: "6 April 2025 (Sunday)",
    alertSentAt: "8:52 AM",
    alertChannel: "WhatsApp" as const,
  },
];

export const mockMotivationalMessage = "Consistency is key to academic success!";
export const mockSelectedMonth = "April 2025";