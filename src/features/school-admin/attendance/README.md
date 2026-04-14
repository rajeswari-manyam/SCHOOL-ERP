# Attendance Module

Full implementation matching all 6 screenshots.

## File structure

```
attendance/
├── index.ts                          ← barrel exports
├── AttendancePage.tsx                ← main page (Image 1 / 4 / 5)
├── api/
│   └── attendance.api.ts             ← axios API layer
├── hooks/
│   └── useAttendance.ts              ← React Query hooks + all mock data
├── types/
│   └── attendance.types.ts           ← TypeScript types
├── components/
│   ├── TodayTab.tsx                  ← Image 1: class-wise table, stat cards, WA banner
│   ├── HistoryTab.tsx                ← Image 4: trend chart, chronic absentees
│   ├── HolidayCalendarTab.tsx        ← Image 5: monthly calendar grid + holiday list
│   └── ClassDetailDrawer.tsx         ← Image 3: right-side detail drawer
└── modals/
    ├── MarkAttendanceModal.tsx        ← Image 2: Web Form modal
    └── AddHolidayModal.tsx            ← Image 6: Add Holiday modal
```

## Screenshot coverage

| Image | Component | Description |
|-------|-----------|-------------|
| 1 | `TodayTab` | Today tab: WA banner, 4 stat cards, class-wise table with status/method/alerts, Send Reminder CTA |
| 2 | `MarkAttendanceModal` | Web Form: class/section/date dropdowns, checkbox checklist, present/absent badge, WA alert notice |
| 3 | `ClassDetailDrawer` | Right drawer: student list, ABSENT/PRESENT badges, Alert Delivered/Failed+Retry, stats footer, Resend + Edit buttons |
| 4 | `HistoryTab` | History tab: date/class filters, SVG trend chart, monthly avg, action required card, chronic absentees table |
| 5 | `HolidayCalendarTab` | Holiday Calendar tab: month nav, Add Holiday button, color-coded calendar grid, legend, holiday list |
| 6 | `AddHolidayModal` | Add Holiday modal: name, date, type dropdown, repeat toggle, notes, WA notify checkbox |

## Router wiring

```tsx
import { AttendancePage } from "@/attendance";

<Route path="/attendance" element={<AttendancePage />} />
```

## Dependencies
- `@tanstack/react-query`
- `date-fns`
- `axios` (via `@/config/axios`)
- Tailwind CSS
