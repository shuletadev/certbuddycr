import { jsPDF } from "jspdf";
import type { ChatThread } from "./chatThreads";

// Generated entirely client-side, matching the real product's own approach —
// no transcript is sent to a third-party PDF service.
export function exportChatToPdf(thread: ChatThread) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - marginX * 2;
  let y = 56;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(thread.title, marginX, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`${thread.examCode} · Exported from CertBuddyCR`, marginX, y);
  y += 28;
  doc.setTextColor(20);

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 48) {
      doc.addPage();
      y = 56;
    }
  };

  for (const m of thread.messages) {
    let label: string;
    let text: string;
    if (m.role === "user") {
      label = "You";
      text = m.text;
    } else if (m.role === "assistant") {
      label = "CertBuddyCR";
      text = m.content;
    } else {
      label = "CertBuddyCR";
      text = "[Interactive quiz — see the app for the live version]";
    }

    ensureSpace(18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(label, marginX, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    const lines: string[] = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      ensureSpace(14);
      doc.text(line, marginX, y);
      y += 14;
    }
    y += 14;
  }

  const filename = `${thread.examCode}-${thread.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
  doc.save(filename);
}
