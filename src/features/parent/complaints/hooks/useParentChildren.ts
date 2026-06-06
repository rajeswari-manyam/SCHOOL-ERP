import { useState, useEffect } from "react";

export interface ChildOption {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
}

const AVATAR_COLORS = [
  "#3525CD", "#F97316", "#0EA5E9", "#10B981",
  "#8B5CF6", "#EF4444", "#F59E0B", "#06B6D4",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

/**
 * Fetches the children linked to a parent from the tenant API.
 * Endpoint: GET /tenant/parent/:parentId/students  (adjust to your actual route)
 *
 * Returns an empty array and surfaces an error string on failure.
 */
export function useParentChildren(
  parentId: string,
  schoolCode: string,
  token: string
) {
  const [children, setChildren] = useState<ChildOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!parentId || !token) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    // ── Adjust this URL to match your backend route ──────────────────
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/tenant/parent/${parentId}/students?school_code=${schoolCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        // Expected shape: { status: true, data: [{ id, name, ... }] }
        const raw: { id: string; name: string }[] = json?.data ?? [];
        const mapped: ChildOption[] = raw.map((child, idx) => ({
          id: child.id,
          name: child.name,
          initials: getInitials(child.name),
          avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
        }));
        setChildren(mapped);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "Failed to load children.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [parentId, schoolCode, token]);

  return { children, isLoading, error };
}
