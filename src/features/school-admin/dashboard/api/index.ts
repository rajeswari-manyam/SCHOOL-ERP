import api from "@/config/axios";
import type {
  DashboardData, AdmissionThisWeek, RawAdmissionsThisWeekResponse,
  SchoolTodayAttendance, RawTodayAttendanceResponse,
  AttendanceClass, RawClassTodayAttendanceResponse, RawClassAttendanceItem,
  ClassAttendanceStatus, RawClassAttendanceStatusResponse,
  RawAllClassesTodayAttendanceResponse,
  RawEnquiriesResponse, AdmissionStage,
} from '../types';

const MOCK_DASHBOARD: DashboardData = {
  schoolName: '',
  stats: [
    { id: 'attendance', label: 'STUDENTS PRESENT TODAY', value: '—', sub: 'Loading…', icon: 'users' },
    { id: 'classes', label: 'CLASSES MARKED TODAY', value: '—', sub: 'Loading…', icon: 'check' },
    { id: 'fees', label: 'COLLECTED THIS MONTH', value: '—', sub: 'Loading…', icon: 'rupee' },
    { id: 'admissions', label: 'ADMISSIONS THIS WEEK', value: '—', sub: 'Loading…', icon: 'user-plus' },
  ],
  attendanceClasses: [
    { id: '1', className: '10A', section: 'A', teacher: 'Mrs. Lakshmi Reddy', present: null, absent: null, status: 'not_marked' },
    { id: '2', className: '10B', section: 'B', teacher: 'Mr. Srikant Ch.', present: 38, absent: 2, status: 'marked' },
    { id: '3', className: '9A', section: 'A', teacher: 'Mrs. Vanaja M.', present: null, absent: null, status: 'not_marked' },
    { id: '4', className: '9B', section: 'B', teacher: 'Mr. Anand G.', present: 35, absent: 5, status: 'marked' },
    { id: '5', className: '8A', section: 'A', teacher: 'Mrs. Sharada P.', present: null, absent: null, status: 'not_marked' },
  ],
  feeDefaulters: [
    { id: '1', initials: 'RT', name: 'Ravi Teja', className: 'Class 10A', amount: 14500, overdueDays: 15, color: '#818cf8' },
    { id: '2', initials: 'PS', name: 'Priya Sharma', className: 'Class 9B', amount: 12000, overdueDays: 10, color: '#f87171' },
    { id: '3', initials: 'KK', name: 'Kiran Kumar', className: 'Class 8A', amount: 10500, overdueDays: 5, color: '#4ade80' },
  ],
  feeCollected: 234000,
  feePending: 118000,
  feeTotalOutstanding: 118000,
  feePaidPercent: 66,
  whatsappActivity: [
    { id: '1', type: 'alert', message: '24 absence alerts sent to parents', time: '10:32 AM', delivered: 'Delivered to all recipients' },
    { id: '2', type: 'fee', message: 'Fee reminder sent to Class 10A Defaulters', time: '09:45 AM', delivered: '12 parents notified' },
    { id: '3', type: 'broadcast', message: 'Broadcast: "Annual Sports Day Date Finalized"', time: '09:15 AM', delivered: '342 parents reached' },
    { id: '4', type: 'staff', message: 'Staff attendance reminder sent', time: 'Yesterday, 06:00 PM', delivered: '' },
  ],
  admissionPipeline: [],
};

// ─── Response extraction: /tenant/getadmissionsthisweek ────────────────────

const extractAdmissionsThisWeek = (raw: unknown): AdmissionThisWeek => {
  if (!raw || typeof raw !== 'object') {
    return { total: 0, changeVsLastWeek: 0, pendingFollowUp: 0 };
  }

  const obj = raw as Record<string, unknown>;

  // Unwrap common envelope shapes: { data: {...} } | { status, message, data: {...} }
  const source: Record<string, unknown> =
    (obj['data'] && typeof obj['data'] === 'object' && !Array.isArray(obj['data'])
      ? (obj['data'] as Record<string, unknown>)
      : null) ?? obj;

  const pick = <T>(keys: string[], fallback: T): T => {
    for (const k of keys) {
      const v = source[k];
      if (v !== undefined && v !== null && v !== '') return v as T;
    }
    return fallback;
  };

  return {
    total: pick<number>(['total', 'count', 'admission_count'], 0),
    changeVsLastWeek: pick<number>(
      ['changeVsLastWeek', 'change_vs_last_week', 'vs_last_week', 'change'],
      0,
    ),
    pendingFollowUp: pick<number>(
      ['pendingFollowUp', 'pending_follow_up', 'pending', 'follow_up'],
      0,
    ),
    dailyBreakdown: (() => {
      const bd = pick<unknown[] | undefined>(
        ['dailyBreakdown', 'daily_breakdown', 'breakdown', 'daily'],
        undefined,
      );
      return Array.isArray(bd) ? (bd as AdmissionThisWeek['dailyBreakdown']) : undefined;
    })(),
    recentAdmissions: (() => {
      const ra = pick<unknown[] | undefined>(
        ['recentAdmissions', 'recent_admissions', 'admissions', 'list', 'items'],
        undefined,
      );
      return Array.isArray(ra) ? (ra as AdmissionThisWeek['recentAdmissions']) : undefined;
    })(),
  };
};

// ─── Response extraction: /tenant/getschooltodayattendance ─────────────────

/** Try to coerce a raw value to a number; returns 0 for null/undefined/NaN */
const toNum = (v: unknown): number => {
  if (v === null || v === undefined) return 0;
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  if (typeof v === 'string') {
    const n = Number(v.replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const extractSchoolTodayAttendance = (raw: unknown): SchoolTodayAttendance | null => {
  if (!raw || typeof raw !== 'object') {
    if (import.meta.env.DEV) {
      console.warn("[dashboard] extractSchoolTodayAttendance: unexpected raw type", typeof raw, raw);
    }
    return null;
  }

  const obj = raw as Record<string, unknown>;

  // Try data wrapper first, fall back to flat object
  const hasDataWrapper = obj['data'] !== undefined;
  let source: Record<string, unknown> =
    hasDataWrapper && typeof obj['data'] === 'object' && obj['data'] !== null && !Array.isArray(obj['data'])
      ? (obj['data'] as Record<string, unknown>)
      : obj;

  // If data wrapper gave an empty object, try the flat object instead
  if (hasDataWrapper && Object.keys(source).length === 1 && source === obj) {
    source = obj;
  }

  if (import.meta.env.DEV) {
    console.log("[dashboard] extractSchoolTodayAttendance: source", JSON.stringify(source));
  }

  const pick = (keys: string[]): number => {
    for (const k of keys) {
      if (k in source) return toNum(source[k]);
    }
    return 0;
  };

  // Try multiple field-name conventions for total
  const total = pick(['totalStudents', 'total_students', 'total', 'totalStudent', 'studentCount', 'enrolled', 'strength', 'count', 'allStudents', 'all_students', 'registered', 'total_count']);
  const present = pick(['present', 'present_today', 'presentToday', 'presentCount', 'present_count', 'presentStudents', 'present_students', 'presentStudent', 'attended', 'checked_in', 'checkedIn', 'todayPresent', 'today_present']);

  const computedPct = total > 0 ? Math.round((present / total) * 100) : 0;
  const absent     = pick(['absent', 'absent_today', 'absentToday', 'absentCount', 'absent_count', 'absence', 'absentStudents', 'absent_students', 'missing', 'todayAbsent', 'today_absent']);
  const pct        = pick(['percentage', 'percent', 'attendance_percentage', 'attendancePercentage', 'rate', 'presentPercent', 'present_percent', 'pct']);

  return {
    totalStudents: total,
    present,
    absent: absent || (total - present),
    percentage: pct || computedPct,
    classesMarked: pick(['classesMarked', 'classes_marked', 'markedClasses', 'marked_classes', 'marked']),
    totalClasses: pick(['totalClasses', 'total_classes', 'classes', 'classCount', 'class_count']),
  };
};

// ─── Response extraction: /tenant/getclasstodayattendance ───────────────────

const CLASS_STATUS_MARKED = new Set(['marked', 'present', 'done', 'completed', 'yes', 'true', '1']);

/** Extract a string from a value that may be a plain string or an object with a name/label field */
const extractStr = (val: unknown, fallback = ''): string => {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') {
    const obj = val as Record<string, unknown>;
    return String(obj['name'] ?? obj['label'] ?? obj['value'] ?? obj['title'] ?? fallback);
  }
  return String(val ?? fallback);
};

const mapClassAttendanceItem = (item: RawClassAttendanceItem, index: number): AttendanceClass => {
  const className = extractStr(item.className ?? item.class_name ?? item.class);
  const section = extractStr(item.section ?? item.section_name ?? item.sectionName ?? item.sec);
  const teacher = extractStr(item.teacher ?? item.teacher_name ?? item.teacherName);
  const rawId = String(item.id ?? item.class_id ?? item.classId ?? '');
  return {
    id: rawId || `${className}-${section}-${teacher}-${index}`,
    className,
    section,
    teacher,
    present: item.present ?? null,
    absent: item.absent ?? null,
    status: CLASS_STATUS_MARKED.has(String(item.status ?? item.attendance_status ?? item.attendanceStatus ?? '').toLowerCase())
      ? 'marked'
      : 'not_marked',
  };
};

const extractClassTodayAttendance = (raw: unknown): AttendanceClass[] => {
  if (!raw || typeof raw !== 'object') {
    if (import.meta.env.DEV) {
      console.warn("[dashboard] extractClassTodayAttendance: unexpected raw type", typeof raw, raw);
    }
    return [];
  }

  const obj = raw as Record<string, unknown>;

  // Unwrap envelope: { data: [...] } | { status, message, data: { classes: [...] } }
  let items: unknown[] | null = null;

  const dataField = obj['data'];
  if (Array.isArray(dataField)) {
    items = dataField;
  } else if (dataField && typeof dataField === 'object') {
    const inner = dataField as Record<string, unknown>;
    items = (Array.isArray(inner['classes'])
      ? inner['classes']
      : Array.isArray(inner['attendance'])
        ? inner['attendance']
        : Array.isArray(inner['items'])
          ? inner['items']
          : Array.isArray(inner['records'])
            ? inner['records']
            : Array.isArray(inner['list'])
              ? inner['list']
              : null) ?? null;
  }

  if (!items) {
    items = (Array.isArray(obj['classes'])
      ? obj['classes']
      : Array.isArray(obj['attendance'])
        ? obj['attendance']
        : Array.isArray(obj['items'])
          ? obj['items']
          : Array.isArray(obj['records'])
            ? obj['records']
            : Array.isArray(obj['list'])
              ? obj['list']
              : Array.isArray(obj['data'])
                ? obj['data']
                : null) ?? null;
  }

  if (!items) {
    if (import.meta.env.DEV) {
      console.warn("[dashboard] extractClassTodayAttendance: no array found in response", JSON.stringify(obj));
    }
    return [];
  }

  return items.map((item: unknown, i: number) => mapClassAttendanceItem(item as RawClassAttendanceItem, i));
};

// ─── Response extraction: /tenant/getallclassestodayattendance ──────────────

const extractAllClassesTodayAttendance = (raw: unknown): AttendanceClass[] => {
  if (!raw || typeof raw !== 'object') {
    if (import.meta.env.DEV) {
      console.warn("[dashboard] extractAllClassesTodayAttendance: unexpected raw type", typeof raw, raw);
    }
    return [];
  }

  const obj = raw as Record<string, unknown>;
  let items: unknown[] | null = null;

  // Envelope: { data: [...] } | { data: { classes: [...] } }
  const dataField = obj['data'];
  if (Array.isArray(dataField)) {
    items = dataField;
  } else if (dataField && typeof dataField === 'object') {
    const inner = dataField as Record<string, unknown>;
    items = (Array.isArray(inner['classes'])
      ? inner['classes']
      : Array.isArray(inner['attendance'])
        ? inner['attendance']
        : Array.isArray(inner['items'])
          ? inner['items']
          : Array.isArray(inner['records'])
            ? inner['records']
            : Array.isArray(inner['list'])
              ? inner['list']
              : null) ?? null;
  }

  if (!items) {
    items = (Array.isArray(obj['classes'])
      ? obj['classes']
      : Array.isArray(obj['attendance'])
        ? obj['attendance']
        : Array.isArray(obj['items'])
          ? obj['items']
          : Array.isArray(obj['records'])
            ? obj['records']
            : Array.isArray(obj['list'])
              ? obj['list']
              : Array.isArray(obj['data'])
                ? obj['data']
                : null) ?? null;
  }

  if (!items) {
    if (import.meta.env.DEV) {
      console.warn("[dashboard] extractAllClassesTodayAttendance: no array found", JSON.stringify(obj));
    }
    return [];
  }

  return items.map((item: unknown, i: number) => mapClassAttendanceItem(item as RawClassAttendanceItem, i));
};

// ─── Response extraction: /tenant/getenquiries (for AdmissionsPipeline) ────

const STAGE_VALUE_MAP: Record<string, string> = {
  enquiry: 'ENQUIRY', interview: 'INTERVIEW', docs_verified: 'DOCS', docs_verification: 'DOCS',
  confirmed: 'CONFIRMED', declined: 'DECLINED',
  shortlisted: 'INTERVIEW', interviewing: 'INTERVIEW', 'for-interview': 'INTERVIEW',
  docs: 'DOCS', doc_verified: 'DOCS', 'docs-verified': 'DOCS', 'doc verified': 'DOCS',
  admitted: 'CONFIRMED', enrolled: 'CONFIRMED', enrolled_confirmed: 'CONFIRMED',
  rejected: 'DECLINED', cancelled: 'DECLINED', 'not-admitted': 'DECLINED', 'not admitted': 'DECLINED',
  enquire: 'ENQUIRY', enq: 'ENQUIRY', new: 'ENQUIRY',
  interview_scheduled: 'INTERVIEW', 'interview-scheduled': 'INTERVIEW', scheduled: 'INTERVIEW',
  docs_uploaded: 'DOCS', docs_pending: 'DOCS', 'docs-pending': 'DOCS',
  confirmed_admission: 'CONFIRMED', 'confirmed-admission': 'CONFIRMED',
};

/** Normalize a raw stage value — exact alias matching only, no substring fuzz */
const normalizeStage = (val: string): string | null => {
  const cleaned = val.toLowerCase().replace(/[-_\s]+/g, '_').trim();
  if (STAGE_VALUE_MAP[cleaned]) return STAGE_VALUE_MAP[cleaned];
  // Try original value (in case backend uses different casing pattern)
  if (STAGE_VALUE_MAP[val.toLowerCase().trim()]) return STAGE_VALUE_MAP[val.toLowerCase().trim()];
  return null;
};

/** Known field names that may contain pipeline stage info — checked in priority order */
const STAGE_FIELD_NAMES = [
  'stage', 'current_stage', 'stage_name', 'status', 'pipeline_status',
  'enquiry_stage', 'enquirystage', 'admission_stage', 'admissionstage',
  'stage_id', 'stageId', 'pipeline_stage', 'pipelinestage',
  'student_status', 'studentstatus', 'enquiry_status', 'enquirystatus',
  'admission_status', 'admissionstatus', 'stage_status', 'stagestatus',
  'progress', 'current_status', 'currentstatus',
];

const PIPELINE_STAGE_ORDER = ['ENQUIRY', 'INTERVIEW', 'DOCS', 'CONFIRMED', 'DECLINED'];

const PIPELINE_STAGE_KEYS = [
  'enquiry', 'enquiries', 'interview', 'interviews', 'docs_verified', 'docs', 'docs_verification',
  'doc_verified', 'confirmed', 'declined', 'rejected',
  'enquire', 'enq', 'new', 'shortlisted', 'scheduled', 'admitted',
  'enrolled', 'cancelled', 'not_admitted', 'docs_pending',
];

/** Recursively find an array of raw enquiry items from any response shape */
const extractRawEnquiriesList = (raw: unknown, depth = 0): unknown[] => {
  if (depth > 3) return [];
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== 'object') return [];
  const obj = raw as Record<string, unknown>;
  const arrayKeys = ['data', 'enquiries', 'list', 'records', 'items', 'result', 'interviews', 'docs'];
  for (const key of arrayKeys) {
    const val = obj[key];
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') {
      const nested = extractRawEnquiriesList(val, depth + 1);
      if (nested.length > 0) return nested;
    }
  }
  for (const v of Object.values(obj)) {
    if (Array.isArray(v)) return v;
  }
  return [];
};

/** Try to extract direct pipeline counts from response (e.g. { enquiry: 12, confirmed: 7 }) */
const extractDirectCounts = (raw: unknown): Record<string, number> | null => {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  // Collect sources: top-level + common count containers + data sub-objects
  const sources: Record<string, unknown>[] = [obj];

  const addSubSource = (key: string): void => {
    const v = obj[key];
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      sources.push(v as Record<string, unknown>);
      // Check one level deeper inside count containers
      const inner = v as Record<string, unknown>;
      for (const innerKey of ['data', 'counts', 'stats', 'summary']) {
        const iv = inner[innerKey];
        if (iv && typeof iv === 'object' && !Array.isArray(iv)) {
          sources.push(iv as Record<string, unknown>);
        }
      }
    }
  };

  addSubSource('data');
  addSubSource('counts');
  addSubSource('stats');
  addSubSource('summary');

  for (const source of sources) {
    const counts: Record<string, number> = {};
    let found = false;
    for (const [key, val] of Object.entries(source)) {
      if (typeof val !== 'number') continue;
      const lowerKey = key.toLowerCase().replace(/[-_\s]+/g, '_');
      for (const stageKey of PIPELINE_STAGE_KEYS) {
        if (lowerKey === stageKey || lowerKey === `${stageKey}_count` || lowerKey === `${stageKey}s` || lowerKey === `total_${stageKey}s` || lowerKey === `total_${stageKey}`) {
          counts[stageKey] = val;
          found = true;
          break;
        }
      }
    }
    if (found) return counts;
  }
  return null;
};

/** Extract stage value from an item — only checks known field names, no substring fuzz */
const extractStageFromItem = (item: Record<string, unknown>): string | null => {
  for (const field of STAGE_FIELD_NAMES) {
    const val = item[field];
    if (typeof val === 'string' && val.trim()) {
      const mapped = normalizeStage(val);
      if (mapped) return mapped;
    }
  }
  return null;
};

const extractEnquiriesPipeline = (raw: unknown): AdmissionStage[] => {
  if (!raw || typeof raw !== 'object') {
    if (import.meta.env.DEV) {
      console.warn("[dashboard] extractEnquiriesPipeline: unexpected type", typeof raw, raw);
    }
    return [];
  }

  const devLog = (msg: string, ...args: unknown[]) => {
    if (import.meta.env.DEV) console.log(`[dashboard] extractEnquiriesPipeline: ${msg}`, ...args);
  };

  // Strategy 1: Find array of items and count per stage
  const items = extractRawEnquiriesList(raw);
  if (items.length > 0) {
    devLog(`found ${items.length} items, first item keys:`, Object.keys(items[0] as object));
    const counts: Record<string, number> = {};
    let unmatched = 0;
    for (const item of items) {
      if (!item || typeof item !== 'object') continue;
      const mapped = extractStageFromItem(item as Record<string, unknown>);
      if (mapped) {
        counts[mapped] = (counts[mapped] ?? 0) + 1;
      } else {
        unmatched++;
        devLog(`unmatched item keys:`, Object.keys(item as object), 'values:', Object.values(item as object).slice(0, 5));
      }
    }
    devLog(`counts:`, counts, `unmatched:`, unmatched);
    return PIPELINE_STAGE_ORDER.map((stage) => ({
      stage,
      count: counts[stage] ?? 0,
      highlight: stage === 'CONFIRMED',
      danger: stage === 'DECLINED',
    }));
  }

  // Strategy 2: Try direct counts from response
  const direct = extractDirectCounts(raw);
  if (direct) {
    devLog(`direct counts:`, direct);
    return PIPELINE_STAGE_ORDER.map((stage) => {
      const count = PIPELINE_STAGE_KEYS.reduce((sum, k) => {
        if (STAGE_VALUE_MAP[k] === stage || k.toUpperCase() === stage) {
          return sum + (direct[k] ?? 0);
        }
        return sum;
      }, 0);
      return {
        stage,
        count,
        highlight: stage === 'CONFIRMED',
        danger: stage === 'DECLINED',
      };
    });
  }

  devLog(`FAILED — no array or direct counts. Raw keys:`, Object.keys(raw as object), `First 200 chars:`, JSON.stringify(raw).slice(0, 200));
  return [];
};

// ─── Response extraction: /tenant/class-attendance-status ───────────────────

const extractClassAttendanceStatus = (raw: unknown): ClassAttendanceStatus | null => {
  if (!raw || typeof raw !== 'object') return null;

  const obj = raw as Record<string, unknown>;

  const source: Record<string, unknown> =
    (obj['data'] && typeof obj['data'] === 'object' && !Array.isArray(obj['data'])
      ? (obj['data'] as Record<string, unknown>)
      : null) ?? obj;

  const pick = <T>(keys: string[], fallback: T): T => {
    for (const k of keys) {
      const v = source[k];
      if (v !== undefined && v !== null && v !== '') return v as T;
    }
    return fallback;
  };

  const marked = pick<number>(['marked', 'classesMarked', 'classes_marked'], 0);
  const total = pick<number>(['total', 'totalClasses', 'total_classes', 'classes'], 0);
  if (marked === 0 && total === 0) return null;

  return {
    marked,
    total,
    pending: pick<number>(['pending', 'pendingClasses', 'pending_classes'], total - marked),
  };
};

export const dashboardApi = {
  async fetchDashboard(): Promise<DashboardData> {
    try {
      const { data } = await api.get<DashboardData>("/tenant/dashboard");
      return data;
    } catch {
      return MOCK_DASHBOARD;
    }
  },

  async sendWhatsAppReminder(classes: string[]): Promise<{ success: boolean }> {
    try {
      const { data } = await api.post<{ success: boolean }>("/tenant/dashboard/whatsapp-reminder", { classes });
      return data;
    } catch (err: any) {
      console.error("sendWhatsAppReminder failed", { url: "/tenant/dashboard/whatsapp-reminder", classes, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to send WhatsApp reminder";
      throw new Error(message);
    }
  },

  /** GET /tenant/getadmissionsthisweek */
  async getAdmissionsThisWeek(): Promise<AdmissionThisWeek> {
    try {
      const { data } = await api.get<RawAdmissionsThisWeekResponse>("/tenant/getadmissionsthisweek");
      return extractAdmissionsThisWeek(data);
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error("[dashboard] getAdmissionsThisWeek failed", {
        url: "/tenant/getadmissionsthisweek",
        response: ctx,
      });
      const message =
        ctx?.message ?? ctx?.error ?? err?.message ?? "Failed to fetch admissions this week";
      throw new Error(typeof message === "string" ? message : JSON.stringify(message));
    }
  },

  /** GET /tenant/getschooltodayattendance */
  async getSchoolTodayAttendance(): Promise<SchoolTodayAttendance | null> {
    try {
      const { data } = await api.get<RawTodayAttendanceResponse>("/tenant/getschooltodayattendance");
      if (import.meta.env.DEV) {
        console.log("[dashboard] GET /tenant/getschooltodayattendance response", JSON.stringify(data));
      }
      return extractSchoolTodayAttendance(data);
    } catch (err: any) {
      const status: number | undefined = err?.response?.status;
      const body = err?.response?.data;
      const bodyStr = typeof body === 'object' ? JSON.stringify(body) : String(body ?? '');
      const msg = bodyStr || err?.message || '';
      console.error(`[dashboard] GET /tenant/getschooltodayattendance FAILED (${status ?? 'network'})`, msg);
      return null;
    }
  },

  /** GET /tenant/class-attendance-status */
  async getClassAttendanceStatus(): Promise<ClassAttendanceStatus | null> {
    try {
      const { data } = await api.get<RawClassAttendanceStatusResponse>("/tenant/class-attendance-status");
      if (import.meta.env.DEV) {
        console.log("[dashboard] GET /tenant/class-attendance-status response", JSON.stringify(data));
      }
      return extractClassAttendanceStatus(data);
    } catch (err: any) {
      const status: number | undefined = err?.response?.status;
      const body = err?.response?.data;
      const bodyStr = typeof body === 'object' ? JSON.stringify(body) : String(body ?? '');
      const msg = bodyStr || err?.message || '';
      console.error(`[dashboard] GET /tenant/class-attendance-status FAILED (${status ?? 'network'})`, msg);
      return null;
    }
  },

  /** GET /tenant/getclasstodayattendance */
  async getClassTodayAttendance(): Promise<AttendanceClass[]> {
    try {
      const { data } = await api.get<RawClassTodayAttendanceResponse>("/tenant/getclasstodayattendance");
      if (import.meta.env.DEV) {
        console.log("[dashboard] GET /tenant/getclasstodayattendance response", JSON.stringify(data));
      }
      return extractClassTodayAttendance(data);
    } catch (err: any) {
      const status: number | undefined = err?.response?.status;
      const body = err?.response?.data;
      const bodyStr = typeof body === 'object' ? JSON.stringify(body) : String(body ?? '');
      const msg = err?.message ?? '';
      console.error(`[dashboard] GET /tenant/getclasstodayattendance FAILED (${status ?? 'network'})`, bodyStr || msg);
      return [];
    }
  },

  /** GET /tenant/getallclassestodayattendance */
  async getAllClassesTodayAttendance(): Promise<AttendanceClass[]> {
    try {
      const { data } = await api.get<RawAllClassesTodayAttendanceResponse>("/tenant/getallclassestodayattendance");
      if (import.meta.env.DEV) {
        console.log("[dashboard] GET /tenant/getallclassestodayattendance response", JSON.stringify(data));
      }
      return extractAllClassesTodayAttendance(data);
    } catch (err: any) {
      const status: number | undefined = err?.response?.status;
      const body = err?.response?.data;
      const bodyStr = typeof body === 'object' ? JSON.stringify(body) : String(body ?? '');
      const msg = err?.message ?? '';
      console.error(`[dashboard] GET /tenant/getallclassestodayattendance FAILED (${status ?? 'network'})`, bodyStr || msg);
      return [];
    }
  },

  /** GET /tenant/getenquiries — build pipeline stages for AdmissionsPipeline */
  async getEnquiriesPipeline(): Promise<AdmissionStage[]> {
    try {
      const { data } = await api.get<RawEnquiriesResponse>("/tenant/getenquiries");
      if (import.meta.env.DEV) {
        console.log("[dashboard] GET /tenant/getenquiries response", JSON.stringify(data));
      }
      return extractEnquiriesPipeline(data);
    } catch (err: any) {
      const status: number | undefined = err?.response?.status;
      const body = err?.response?.data;
      const bodyStr = typeof body === 'object' ? JSON.stringify(body) : String(body ?? '');
      const msg = err?.message ?? '';
      console.error(`[dashboard] GET /tenant/getenquiries FAILED (${status ?? 'network'})`, bodyStr || msg);
      return [];
    }
  },
};
