/**
 * useReceiptPDF.ts
 *
 * Generates a downloadable PDF receipt using jsPDF.
 * Install: npm install jspdf
 *
 * Usage:
 *   const { generateReceiptPDF } = useReceiptPDF();
 *   await generateReceiptPDF(receiptData);
 */

export interface ReceiptData {
  receiptNo: string;
  date: string;
  time?: string;
  // Student
  studentName: string;
  admissionNo: string;
  className: string;
  section?: string;
  fatherName?: string;
  // Fee breakdown
  feeItems: {
    feeHead: string;
    amount: number;
    paidAmount: number;
    remainingAmount: number;
    lateFee?: number;
  }[];
  // Payment
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMode: string;
  transactionId?: string;
  paymentStatus: "PAID" | "PARTIAL" | "PENDING";
  // School
  schoolName?: string;
  schoolAddress?: string;
  collectedBy?: string;
}

export function useReceiptPDF() {
  const generateReceiptPDF = async (data: ReceiptData): Promise<void> => {
    // Dynamic import to keep bundle lean
    const { default: jsPDF } = await import("jspdf");

    const doc = new jsPDF({ unit: "mm", format: "a5" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 12;
    const col2 = pageW / 2;

    // ── Helpers ──────────────────────────────────────────────────────

    const line = (y: number) =>
      doc.line(margin, y, pageW - margin, y);

    const cell = (
      label: string,
      value: string,
      x: number,
      y: number,
      labelW = 32
    ) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(100);
      doc.text(label, x, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30);
      doc.text(value, x + labelW, y);
    };

    let y = margin;

    // ── Header ────────────────────────────────────────────────────────
    doc.setFillColor(53, 37, 205); // brand blue
    doc.rect(0, 0, pageW, 18, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255);
    doc.text(data.schoolName ?? "School Management System", pageW / 2, 8, {
      align: "center",
    });
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(data.schoolAddress ?? "", pageW / 2, 13, { align: "center" });

    y = 22;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30);
    doc.text("FEE RECEIPT", pageW / 2, y, { align: "center" });

    y += 5;

    // Receipt meta
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    doc.text(`Receipt No: ${data.receiptNo}`, margin, y);
    doc.text(
      `Date: ${data.date}${data.time ? "  " + data.time : ""}`,
      pageW - margin,
      y,
      { align: "right" }
    );

    y += 4;
    line(y);

    // ── Student info ──────────────────────────────────────────────────
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30);
    doc.text("Student Information", margin, y);
    y += 4;

    cell("Name", data.studentName, margin, y);
    cell("Admission No", data.admissionNo, col2, y);
    y += 5;
    cell(
      "Class",
      `${data.className}${data.section ? " – " + data.section : ""}`,
      margin,
      y
    );
    if (data.fatherName) {
      cell("Father", data.fatherName, col2, y);
    }

    y += 5;
    line(y);

    // ── Fee breakdown ─────────────────────────────────────────────────
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30);
    doc.text("Fee Breakdown", margin, y);
    y += 4;

    // Table header
    doc.setFillColor(238, 240, 255);
    doc.rect(margin, y - 3, pageW - 2 * margin, 6, "F");
    doc.setFontSize(7);
    doc.setTextColor(60);
    doc.text("Fee Head", margin + 1, y + 1);
    doc.text("Amount", col2 - 10, y + 1, { align: "right" });
    doc.text("Paid", col2 + 10, y + 1, { align: "right" });
    doc.text("Balance", pageW - margin - 1, y + 1, { align: "right" });
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30);
    for (const item of data.feeItems) {
      doc.text(item.feeHead, margin + 1, y);
      doc.text(`₹${item.amount.toLocaleString("en-IN")}`, col2 - 10, y, {
        align: "right",
      });
      doc.text(`₹${item.paidAmount.toLocaleString("en-IN")}`, col2 + 10, y, {
        align: "right",
      });
      doc.text(
        `₹${item.remainingAmount.toLocaleString("en-IN")}`,
        pageW - margin - 1,
        y,
        { align: "right" }
      );
      y += 5;

      if ((item.lateFee ?? 0) > 0) {
        doc.setTextColor(200, 0, 0);
        doc.text(
          `Late fee`,
          margin + 3,
          y
        );
        doc.text(
          `₹${(item.lateFee ?? 0).toLocaleString("en-IN")}`,
          col2 - 10,
          y,
          { align: "right" }
        );
        doc.setTextColor(30);
        y += 5;
      }
    }

    line(y);
    y += 5;

    // ── Payment summary ───────────────────────────────────────────────
    const statusColor: Record<string, [number, number, number]> = {
      PAID: [22, 163, 74],
      PARTIAL: [217, 119, 6],
      PENDING: [220, 38, 38],
    };
    const [r, g, b] = statusColor[data.paymentStatus] ?? [100, 100, 100];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30);
    doc.text("Total Amount Due:", margin, y);
    doc.text(
      `₹${data.totalAmount.toLocaleString("en-IN")}`,
      pageW - margin,
      y,
      { align: "right" }
    );
    y += 5;

    doc.setTextColor(r, g, b);
    doc.text("Amount Paid:", margin, y);
    doc.text(
      `₹${data.paidAmount.toLocaleString("en-IN")}`,
      pageW - margin,
      y,
      { align: "right" }
    );
    y += 5;

    if (data.remainingAmount > 0) {
      doc.setTextColor(220, 38, 38);
      doc.text("Balance Due:", margin, y);
      doc.text(
        `₹${data.remainingAmount.toLocaleString("en-IN")}`,
        pageW - margin,
        y,
        { align: "right" }
      );
      y += 5;
    }

    // Status badge
    doc.setFillColor(r, g, b);
    doc.roundedRect(pageW / 2 - 15, y - 3, 30, 7, 2, 2, "F");
    doc.setTextColor(255);
    doc.setFontSize(8);
    doc.text(data.paymentStatus, pageW / 2, y + 1.5, { align: "center" });
    y += 10;

    line(y);
    y += 5;

    // ── Payment details ───────────────────────────────────────────────
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(60);
    cell("Payment Mode", data.paymentMode, margin, y);
    if (data.transactionId) {
      cell("Txn ID", data.transactionId, col2, y);
    }
    y += 5;
    if (data.collectedBy) {
      cell("Collected By", data.collectedBy, margin, y);
    }

    y += 8;

    // ── Footer ────────────────────────────────────────────────────────
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(
      "This is a computer-generated receipt and does not require a signature.",
      pageW / 2,
      y,
      { align: "center" }
    );

    // ── Save ──────────────────────────────────────────────────────────
    doc.save(`Receipt_${data.receiptNo}.pdf`);
  };

  return { generateReceiptPDF };
}
