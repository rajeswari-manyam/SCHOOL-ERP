// ─── Dashboard API Layer ────────────────────────────────────────────────────
// In production, replace these with real API calls using TanStack Query

import type { DashboardData } from '../types';

const MOCK_DELAY = 600;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const dashboardApi = {
  async fetchDashboard(): Promise<DashboardData> {
    await sleep(MOCK_DELAY);
    return {
      stats: [
        {
          id: 'attendance',
          label: 'STUDENTS PRESENT TODAY',
          value: '318/342',
          badge: { text: '93% RATE', variant: 'green' },
          sub: '24 absent across 8 classes',
          action: { label: 'View Details →' },
          icon: 'users',
        },
        {
          id: 'classes',
          label: 'CLASSES MARKED TODAY',
          value: '12/15',
          badge: { text: '● Action needed', variant: 'orange' },
          sub: '3 classes pending',
          action: { label: 'Send Reminders →' },
          alert: true,
          icon: 'check',
        },
        {
          id: 'fees',
          label: 'COLLECTED THIS MONTH',
          value: '₹2,34,000',
          badge: { text: '66% PAID', variant: 'blue' },
          sub: '₹1,18,000 still pending',
          action: { label: 'View Defaulters →' },
          icon: 'rupee',
        },
        {
          id: 'admissions',
          label: 'ADMISSIONS THIS WEEK',
          value: '7',
          badge: { text: '+2 vs LW', variant: 'green' },
          sub: '3 pending follow-up',
          action: { label: 'View Pipeline →' },
          icon: 'user-plus',
        },
      ],

      attendanceClasses: [
        { id: '1', className: '10A', teacher: 'Mrs. Lakshmi Reddy', present: null,  absent: null, status: 'not_marked' },
        { id: '2', className: '10B', teacher: 'Mr. Srikant Ch.',    present: 38,    absent: 2,    status: 'marked'     },
        { id: '3', className: '9A',  teacher: 'Mrs. Vanaja M.',     present: null,  absent: null, status: 'not_marked' },
        { id: '4', className: '9B',  teacher: 'Mr. Anand G.',       present: 35,    absent: 5,    status: 'marked'     },
        { id: '5', className: '8A',  teacher: 'Mrs. Sharada P.',    present: null,  absent: null, status: 'not_marked' },
      ],

      feeDefaulters: [
        { id: '1', initials: 'RT', name: 'Ravi Teja',    className: 'Class 10A', amount: 14500, overdueDays: 15, color: '#818cf8' },
        { id: '2', initials: 'PS', name: 'Priya Sharma', className: 'Class 9B',  amount: 12000, overdueDays: 10, color: '#f87171' },
        { id: '3', initials: 'KK', name: 'Kiran Kumar',  className: 'Class 8A',  amount: 10500, overdueDays: 5,  color: '#4ade80' },
      ],

      feeCollected: 234000,
      feePending: 118000,
      feeTotalOutstanding: 118000,
      feePaidPercent: 66,

      whatsappActivity: [
        { id: '1', type: 'alert',     message: '24 absence alerts sent to parents',              time: '10:32 AM', delivered: 'Delivered to all recipients' },
        { id: '2', type: 'fee',       message: 'Fee reminder sent to Class 10A Defaulters',      time: '09:45 AM', delivered: '12 parents notified'          },
        { id: '3', type: 'broadcast', message: 'Broadcast: "Annual Sports Day Date Finalized"',  time: '09:15 AM', delivered: '342 parents reached'           },
        { id: '4', type: 'staff',     message: 'Staff attendance reminder sent',                  time: 'Yesterday, 06:00 PM', delivered: ''                  },
      ],

      admissionPipeline: [
        { stage: 'ENQUIRY',   count: 12 },
        { stage: 'INTERVIEW', count: 4  },
        { stage: 'DOCS',      count: 3  },
        { stage: 'CONFIRMED', count: 7,  highlight: true },
        { stage: 'DECLINED',  count: 2,  danger: true    },
      ],
    };
  },

  async sendWhatsAppReminder(classes: string[]): Promise<{ success: boolean }> {
    await sleep(800);
    console.log('Sending reminders to:', classes);
    return { success: true };
  },
};
