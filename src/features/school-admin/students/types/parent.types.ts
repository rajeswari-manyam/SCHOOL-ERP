export interface CreateParentPayload {
  father_name?: string;
  father_occupation?: string;
  father_email?: string;
  father_phone?: string;
  mother_name?: string;
  mother_occupation?: string;
  mother_email?: string;
  mother_phone?: string;
  students: string[];
  address: string;
  /** Not required by the backend (it's derived from the auth token) — omit rather than send a mismatched value. */
  school_id?: string;
  father_image?: File | null;
  mother_image?: File | null;
}
