// import { create } from "zustand"
// import {
//   type AttendanceDay,
//   type AbsentRecord,
//   type AttendanceStats,
//   type ChildInfo,
// } from "../types/attendance.types";

// interface AttendanceState {
//   month: string
//   child: ChildInfo
//   days: AttendanceDay[]
//   stats: AttendanceStats
//   absents: AbsentRecord[]

//   setMonth: (month: string) => void
// }

// export const useAttendanceStore = create<AttendanceState>(
//   (set) => ({
//     month: "March 2025",

//     child: {
//       id: "1",
//       name: "Rahul Kumar",
//       className: "5",
//       section: "A",
//     },

//     days: [
//       { date: "2025-03-01", status: "present" },
//       { date: "2025-03-02", status: "present" },
//       { date: "2025-03-03", status: "absent" },
//       { date: "2025-03-04", status: "late" },
//       { date: "2025-03-05", status: "present" },
//     ],

//     stats: {
//       present: 18,
//       absent: 3,
//       late: 2,
//     },

//     absents: [
//       {
//         date: "12 Mar 2025",
//         reason: "Absent",
//         timeline: [
//           {
//             title: "Teacher marked absent",
//             time: "09:05 AM",
//           },
//           {
//             title: "Alert sent to parent",
//             time: "09:06 AM",
//           },
//           {
//             title: "WhatsApp delivered",
//             time: "09:07 AM",
//           },
//         ],
//       },
//     ],

//     setMonth: (month) => set({ month }),
//   })
// )