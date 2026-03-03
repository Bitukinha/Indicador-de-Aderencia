import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportToPdf() {
  const sections = document.querySelectorAll<HTMLElement>("[data-pdf-section]");
  if (sections.length === 0) return;

  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const usableWidth = pageWidth - margin * 2;

  for (let i = 0; i < sections.length; i++) {
    if (i > 0) doc.addPage();

    const canvas = await html2canvas(sections[i], {
      scale: 2,
      useCORS: true,
      backgroundColor: "#f5f6f8",
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = usableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // If image is taller than page, scale down to fit
    if (imgHeight > pageHeight - margin * 2) {
      const ratio = (pageHeight - margin * 2) / imgHeight;
      const finalW = imgWidth * ratio;
      const finalH = imgHeight * ratio;
      doc.addImage(imgData, "PNG", margin + (usableWidth - finalW) / 2, margin, finalW, finalH);
    } else {
      doc.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
    }
  }

  doc.save("relatorio-aderencia.pdf");
}
