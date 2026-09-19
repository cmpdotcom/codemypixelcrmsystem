import { jsPDF } from "jspdf";

export interface InvoicePayment {
  invoiceNumber: string;
  label: string;
  description: string | null;
  clientName: string;
  dealTitle: string | null;
  amount: number;
  status: string;
  method: string | null;
  dueDate: string;
  paidAt: string | null;
  createdAt?: string;
}

export interface InvoiceBranding {
  companyName: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  logoUrl?: string;
}

const STATUS_RGB: Record<string, [number, number, number]> = {
  Paid: [16, 185, 129],
  Pending: [37, 99, 235],
  Partial: [245, 158, 11],
  Overdue: [244, 63, 94],
  Refunded: [100, 116, 139],
};

const fmtMoney = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

async function loadImageDataUrl(url: string): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const dims = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = dataUrl;
    });
    return { dataUrl, ...dims };
  } catch {
    return null;
  }
}

export async function downloadInvoicePdf(payment: InvoicePayment, branding: InvoiceBranding) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth(); // 210
  const pageH = doc.internal.pageSize.getHeight(); // 297
  const margin = 18;
  const right = pageW - margin;

  // ---------- Header band ----------
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageW, 42, "F");
  doc.setFillColor(37, 99, 235); // blue-600 accent strip
  doc.rect(0, 42, pageW, 1.6, "F");

  // Logo (fallback to text wordmark)
  let logoDrawn = false;
  const candidates = [branding.logoUrl, "/logo.png"].filter(Boolean) as string[];
  for (const url of candidates) {
    const img = await loadImageDataUrl(url);
    if (img) {
      const maxH = 16;
      const maxW = 52;
      const ratio = Math.min(maxH / img.height, maxW / img.width);
      const w = img.width * ratio;
      const h = img.height * ratio;
      try {
        doc.addImage(img.dataUrl, "PNG", margin, 13, w, h);
        logoDrawn = true;
        break;
      } catch {
        // try next candidate
      }
    }
  }
  if (!logoDrawn) {
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(branding.companyName || "CMP", margin, 25);
  }

  // Company block under logo
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const companyLines = [
    branding.companyEmail,
    branding.companyPhone,
    branding.companyAddress,
  ].filter(Boolean) as string[];
  companyLines.slice(0, 2).forEach((line, i) => {
    doc.text(line, margin, 33 + i * 4.5);
  });

  // INVOICE title, right aligned
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("INVOICE", right, 22, { align: "right" });
  doc.setFontSize(10);
  doc.setTextColor(191, 219, 254); // blue-200
  doc.text(payment.invoiceNumber, right, 29, { align: "right" });

  // Status pill, right aligned
  const [r, g, b] = STATUS_RGB[payment.status] || STATUS_RGB.Pending;
  doc.setFillColor(r, g, b);
  const statusText = payment.status.toUpperCase();
  const pillW = doc.getTextWidth(statusText) + 10;
  doc.roundedRect(right - pillW, 32.5, pillW, 6.5, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(statusText, right - pillW / 2, 36.8, { align: "center" });

  // ---------- Meta row ----------
  let y = 56;
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text("ISSUE DATE", margin, y);
  doc.text("DUE DATE", margin + 55, y);
  doc.text("PAYMENT METHOD", margin + 110, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.text(fmtDate(payment.paidAt || payment.createdAt || payment.dueDate), margin, y + 6);
  doc.text(fmtDate(payment.dueDate), margin + 55, y + 6);
  doc.text(payment.method || "—", margin + 110, y + 6);

  // ---------- Bill To ----------
  y += 22;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(margin, y, pageW - margin * 2, 30, 3, 3, "F");
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("BILL TO", margin + 6, y + 8);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.text(payment.clientName, margin + 6, y + 16);
  if (payment.dealTitle) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text(`Deal: ${payment.dealTitle}`, margin + 6, y + 23);
  }

  // ---------- Line items table ----------
  y += 44;
  const colX = { desc: margin, qty: right - 70, rate: right - 45, amount: right };

  // Table header
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, pageW - margin * 2, 9, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("DESCRIPTION", colX.desc + 3, y + 6);
  doc.text("QTY", colX.qty, y + 6, { align: "right" });
  doc.text("RATE", colX.rate, y + 6, { align: "right" });
  doc.text("AMOUNT", colX.amount - 3, y + 6, { align: "right" });

  // Table row
  y += 9;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, pageW - margin * 2, 14, "F");
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y + 14, right, y + 14);
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(payment.label, colX.desc + 3, y + 6);
  if (payment.description) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text(doc.splitTextToSize(payment.description, 90), colX.desc + 3, y + 11);
  }
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("1", colX.qty, y + 8, { align: "right" });
  doc.text(fmtMoney(payment.amount), colX.rate, y + 8, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.text(fmtMoney(payment.amount), colX.amount - 3, y + 8, { align: "right" });

  // ---------- Totals ----------
  y += 26;
  const totLabelX = right - 60;
  const totValX = right - 3;
  const rows: [string, string][] = [
    ["Subtotal", fmtMoney(payment.amount)],
    ["Tax (0%)", "$0.00"],
  ];
  doc.setFontSize(9.5);
  rows.forEach(([label, val]) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(label, totLabelX, y, { align: "left" });
    doc.setTextColor(30, 41, 59);
    doc.text(val, totValX, y, { align: "right" });
    y += 5.5;
  });

  // Total bar
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(totLabelX - 4, y - 3.5, right - totLabelX + 4, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TOTAL DUE", totLabelX, y + 3, { align: "left" });
  doc.text(fmtMoney(payment.amount), totValX, y + 3, { align: "right" });

  // ---------- Notes / terms ----------
  y += 22;
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("NOTES", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const notes = payment.description
    ? `${payment.description}. Thank you for your business.`
    : "Thank you for your business.";
  doc.text(doc.splitTextToSize(notes, pageW - margin * 2), margin, y + 5.5);

  // ---------- Footer ----------
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageH - 22, right, pageH - 22);
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text(
    `${branding.companyName || "Code My Pixel"} · Invoice ${payment.invoiceNumber} · Generated ${fmtDate(new Date().toISOString())}`,
    pageW / 2,
    pageH - 15,
    { align: "center" }
  );
  doc.text("This is a system-generated invoice.", pageW / 2, pageH - 10.5, { align: "center" });

  doc.save(`${payment.invoiceNumber}.pdf`);
}
