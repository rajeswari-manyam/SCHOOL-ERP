import { useCallback, useEffect, useState } from "react";
import { getUserById } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";

/**
 * Portal-agnostic view of a GetUserById response — resolves the various
 * per-role name fields (parent_name / teacher_name / admin_name / ...) into
 * a single `name`, same logic ProfileModal.tsx and authStore's
 * setUserProfile already use, so School Admin/Accountant profile pages
 * don't need to know about those field-name variants at all.
 */
export interface ResolvedUserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  image?: string | null;
  status?: string;
  schoolCode?: string;
  // School branding (distinct from the person's own `image` above) — the
  // school's own photo/logo, plus its name. getUserById doesn't return a
  // school name field, so that one comes from what LoginPage already stored
  // in localStorage when this session started.
  schoolName?: string;
  schoolImage?: string | null;
  schoolLogo?: string | null;
  principalName?: string;
  roleName?: string;
  createdAt?: string;
}

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim() : undefined;

const resolveName = (d: Record<string, unknown>, fallback: string): string =>
  str(d.parent_name) ?? str(d.teacher_name) ?? str(d.student_name) ??
  str(d.admin_name)  ?? str(d.accountant_name) ??
  (str(d.first_name) ? `${str(d.first_name)} ${str(d.last_name) ?? ""}`.trim() : undefined) ??
  str(d.name) ?? fallback;

/**
 * Fetches the logged-in user's own record via getUserById — the same API
 * every portal layout already calls to keep the auth store's avatar fresh —
 * and exposes it in a normalized shape for a dedicated Profile page.
 */
export function useUserProfile() {
  // Only the id is reactive-dependency-worthy here — setUserProfile (called
  // below) mutates the store's `user` object on every load, so depending on
  // the whole object (or even just re-reading it reactively inside the
  // callback's deps) would recreate `load` every time it runs and loop.
  const userId = useAuthStore((s) => s.user?.id) ?? localStorage.getItem("userId") ?? "";
  const setUserProfile = useAuthStore((s) => s.setUserProfile);

  const [profile, setProfile] = useState<ResolvedUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setError("No logged-in user found.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getUserById(userId);
      if (!res?.status) {
        setError("Could not load profile.");
        return;
      }
      // Snapshot the store at call time (not a reactive dependency) purely
      // as a fallback for fields the fresh response didn't include.
      const fallback = useAuthStore.getState().user;
      const d = res.data as unknown as Record<string, unknown>;
      setProfile({
        id: userId,
        name: resolveName(d, fallback?.name ?? "User"),
        email: str(d.email) ?? fallback?.email,
        phone: str(d.phone) ?? fallback?.phone,
        address: str(d.address) ?? fallback?.address,
        // The person's own photo (staff record's `image`) always wins —
        // schoolImage/schoolLogo is only a fallback for accounts with no
        // personal photo uploaded (e.g. a School Admin who never set one).
        // Matches authStore.setUserProfile's precedence for the same fields.
        image: str(d.image) ?? res.schoolImage ?? fallback?.image ?? null,
        status: str(d.status),
        schoolCode: str(d.school_code) ?? fallback?.schoolcode,
        schoolName: str(localStorage.getItem("schoolName") ?? undefined),
        schoolImage: res.schoolImage ?? fallback?.schoolImage ?? null,
        schoolLogo: res.schoolLogo ?? fallback?.schoolLogo ?? null,
        principalName: res.principalName ?? fallback?.principalName,
        roleName: res.role?.name ?? res.userType,
        createdAt: str(d.createdAt),
      });
      // Keep the shared auth store (sidebar avatar, etc.) in sync too.
      setUserProfile(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load profile.");
    } finally {
      setLoading(false);
    }
  }, [userId, setUserProfile]);

  useEffect(() => { load(); }, [load]);

  return { profile, loading, error, reload: load };
}
