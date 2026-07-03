import api from "@/config/axios";
import { useAuthStore } from "@/store/authStore";
import type { Student } from "@/features/teacher/students/types/my-students.types";

/** Extract a student array from any common API response envelope */
const extractStudents = (raw: unknown): unknown[] => {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== 'object') return [];
  const obj = raw as Record<string, unknown>;
  for (const key of ['data', 'students', 'list', 'records', 'result', 'items']) {
    const val = obj[key];
    if (Array.isArray(val)) return val;
  }
  return [];
};

const normalizeFeeStatus = (val: unknown): Student['feeStatus'] => {
  const s = String(val ?? '').toLowerCase().trim();
  if (s === 'paid' || s === 'fully_paid') return 'PAID';
  if (s === 'pending' || s === 'unpaid') return 'PENDING';
  if (s === 'overdue') return 'OVERDUE';
  if (s === 'partial' || s === 'partially_paid') return 'PARTIAL';
  return 'PENDING';
};

/** Map a raw API record to the Student type used by the UI */
const mapStudent = (item: Record<string, unknown>): Student => ({
  id: String(item['id'] ?? item['student_id'] ?? item['_id'] ?? ''),
  rollNo: String(item['roll_no'] ?? item['rollNo'] ?? item['roll_number'] ?? item['roll'] ?? ''),
  name: String(item['name'] ?? item['student_name'] ?? item['studentName'] ?? ''),
  className: String(item['class_name'] ?? item['className'] ?? item['class'] ?? ''),
  classId: (item['class_id'] ?? item['classId']) as string | undefined,
  section: String(item['section'] ?? item['section_name'] ?? item['sectionName'] ?? ''),
  sectionId: (item['section_id'] ?? item['sectionId']) as string | undefined,
  isActive: item['is_active'] !== false && item['isActive'] !== false && item['status'] !== 'inactive',
  attendancePct: Number(item['attendance_pct'] ?? item['attendancePct'] ?? item['attendance_percentage'] ?? 0),
  feeStatus: normalizeFeeStatus(item['fee_status'] ?? item['feeStatus'] ?? 'PENDING'),
  fatherName: String(item['father_name'] ?? item['fatherName'] ?? ''),
  fatherPhone: String(item['father_phone'] ?? item['fatherPhone'] ?? item['father_mobile'] ?? ''),
  motherName: String(item['mother_name'] ?? item['motherName'] ?? ''),
  motherPhone: String(item['mother_phone'] ?? item['motherPhone'] ?? item['mother_mobile'] ?? ''),
  feeTotal: Number(item['fee_total'] ?? item['feeTotal'] ?? item['total_fee'] ?? 0),
  feePaid: Number(item['fee_paid'] ?? item['feePaid'] ?? item['paid_fee'] ?? 0),
  feeDueDate: String(item['fee_due_date'] ?? item['feeDueDate'] ?? item['due_date'] ?? ''),
  attendanceDays: [],
  homework: [],
});

export const getTeacherId = (): string => {
  const user = useAuthStore.getState().user;
  return user?.id ?? localStorage.getItem('userId') ?? '';
};

export const myStudentsApi = {
  /** GET /tenant/getstudentsbyteacher/{teacherId} */
  getStudents: async (teacherId?: string): Promise<Student[]> => {
    const id = teacherId || getTeacherId();
    if (!id) {
      console.warn('[myStudents] getStudents: no teacher ID available');
      return [];
    }
    try {
      const { data } = await api.get(`/tenant/getstudentsbyteacher`, { params: { teacher_id: id } });
      if (import.meta.env.DEV) {
        console.log('[myStudents] GET /tenant/getstudentsbyteacher?teacher_id= response', JSON.stringify(data).slice(0, 300));
      }
      const raw = extractStudents(data);
      return raw.map((r) => mapStudent(r as Record<string, unknown>));
    } catch (err: any) {
      const status = err?.response?.status;
      const body = err?.response?.data;
      const bodyStr = typeof body === 'object' ? JSON.stringify(body) : String(body ?? '');
      console.error(`[myStudents] GET /tenant/getstudentsbyteacher FAILED (${status ?? 'network'})`, bodyStr || err?.message || '');
      return [];
    }
  },

  getStudent: async (id: string): Promise<Student | null> => {
    try {
      const { data } = await api.get(`/tenant/teacher/students/${id}`);
      const records = extractStudents(data);
      return records.length > 0 ? mapStudent(records[0] as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  },

  exportClassList: async (format: 'csv' | 'pdf'): Promise<void> => {
    try {
      const res = await api.get(`/tenant/teacher/students/export`, { params: { format }, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `class-list.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('exportClassList failed', { format, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? 'Failed to export class list';
      throw new Error(message);
    }
  },
};
