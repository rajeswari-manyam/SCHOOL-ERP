import api from "@/config/axios";

export interface UpdateLeavePayload {
  reason?: string;
  status?: string;
}

export interface UpdateLeaveResponse {
  status: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export interface DeleteLeaveResponse {
  status: boolean;
  message: string;
}

/** PUT /tenant/updateleaveById/:id — update leave reason/details */
export const updateLeave = async (
  id: string,
  payload: UpdateLeavePayload,
): Promise<UpdateLeaveResponse> => {
  try {
    const { data } = await api.put<UpdateLeaveResponse>(
      `/tenant/updateleaveById/${id}`,
      payload,
    );
    console.log(`[leaves] updateLeave OK (${id})`, data);
    return data;
  } catch (err: any) {
    const status = err?.response?.status;
    const body = err?.response?.data;
    const bodyStr = typeof body === 'object' ? JSON.stringify(body) : String(body ?? '');
    console.error(`[leaves] PUT /tenant/updateleaveById/${id} FAILED (${status ?? 'network'})`, bodyStr || err?.message || '');
    throw new Error(
      err?.response?.data?.message ?? err?.message ?? 'Failed to update leave',
    );
  }
};

/** DELETE /tenant/deleteleaveById/:id — delete a leave record */
export const deleteLeave = async (id: string): Promise<DeleteLeaveResponse> => {
  try {
    const { data } = await api.delete<DeleteLeaveResponse>(
      `/tenant/deleteleaveById/${id}`,
    );
    console.log(`[leaves] deleteLeave OK (${id})`, data);
    return data;
  } catch (err: any) {
    const status = err?.response?.status;
    const body = err?.response?.data;
    const bodyStr = typeof body === 'object' ? JSON.stringify(body) : String(body ?? '');
    console.error(`[leaves] DELETE /tenant/deleteleaveById/${id} FAILED (${status ?? 'network'})`, bodyStr || err?.message || '');
    throw new Error(
      err?.response?.data?.message ?? err?.message ?? 'Failed to delete leave',
    );
  }
};
