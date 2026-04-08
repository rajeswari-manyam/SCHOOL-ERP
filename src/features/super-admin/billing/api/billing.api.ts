import axios from "axios";
import type{ Invoice, PaymentRecord, BillingStats } from "../types/billing.types";

export const fetchInvoices = async (): Promise<Invoice[]> => {
  const { data } = await axios.get("/super-admin/billing/invoices");
  return data;
};

export const fetchPayments = async (): Promise<PaymentRecord[]> => {
  const { data } = await axios.get("/super-admin/billing/payments");
  return data;
};

export const fetchBillingStats = async (): Promise<BillingStats> => {
  const { data } = await axios.get("/super-admin/billing/stats");
  return data;
};

export const createInvoice = async (input: Partial<Invoice>): Promise<Invoice> => {
  const { data } = await axios.post("/super-admin/billing/invoices", input);
  return data;
};

export const recordPayment = async (invoiceId: string, method: string): Promise<PaymentRecord> => {
  const { data } = await axios.post(`/super-admin/billing/invoices/${invoiceId}/pay`, { method });
  return data;
};
