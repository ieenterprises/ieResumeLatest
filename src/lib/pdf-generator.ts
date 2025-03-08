import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function generatePDF(
  element: HTMLElement,
  fileName: string,
): Promise<void> {
  // Create a canvas from the element
  const canvas = await html2canvas(element, {
    scale: 2, // Higher scale for better quality
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  // Calculate the PDF dimensions (A4 format)
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  // Create PDF document
  const pdf = new jsPDF("p", "mm", "a4");
  const imgData = canvas.toDataURL("image/png");

  // Add image to PDF
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Add new pages if content is longer than one page
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Save the PDF
  pdf.save(fileName);
}
