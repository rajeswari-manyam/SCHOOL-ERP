import { useState } from "react";
import { parentsApi } from "@/services/school-parents.api";
import type { CreateParentPayload } from "../types/parent.types";

export const useParents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createParent = async (payload: CreateParentPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await parentsApi.createParent(payload);
      return data;
    } catch (err: any) {
      setError(err?.message || "Failed to create parent");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createParent, loading, error };
};
