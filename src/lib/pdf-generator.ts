import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function generatePDF(
  element: HTMLElement,
  fileName: string,
): Promise<void> {
  try {
    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;
    const container = document.createElement("div");
    container.appendChild(clonedElement);
    document.body.appendChild(container);

    // Apply specific styles for PDF generation
    // Set exact 1.27cm margins as specified
    const marginInPx = "48px"; // 1.27cm ≈ 48px at 96 DPI
    clonedElement.style.width = "794px"; // A4 width in pixels at 96 DPI
    clonedElement.style.padding = marginInPx;
    clonedElement.style.boxSizing = "border-box";
    clonedElement.style.backgroundColor = "#ffffff";

    // Apply styles to ensure content doesn't get cut off
    const sections = clonedElement.querySelectorAll(
      'div[style*="break-inside: avoid"]',
    );
    sections.forEach((section) => {
      (section as HTMLElement).style.pageBreakInside = "avoid";
      (section as HTMLElement).style.breakInside = "avoid";
      (section as HTMLElement).style.marginBottom = "15px";
    });

    // Special handling for references/education sections to prevent them from being cut
    const educationSections = clonedElement.querySelectorAll(
      'h2:contains("Education"), h2:contains("References")',
    );
    educationSections.forEach((section) => {
      const parentSection = section.closest("div");
      if (parentSection) {
        (parentSection as HTMLElement).style.pageBreakInside = "avoid";
        (parentSection as HTMLElement).style.breakInside = "avoid";
        (parentSection as HTMLElement).style.pageBreakBefore = "auto";
        (parentSection as HTMLElement).style.pageBreakAfter = "auto";
      }
    });

    // Create a canvas from the cloned element
    const canvas = await html2canvas(clonedElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true,
    });

    // Remove the cloned element from the DOM
    document.body.removeChild(container);

    // Calculate the PDF dimensions (A4 format)
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF document with exact 1.27cm margins
    const marginInMm = 12.7; // 1.27cm = 12.7mm
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // Calculate how many pages we need
    const pagesCount = Math.ceil(imgHeight / pageHeight);

    // For single page documents
    if (pagesCount <= 1) {
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.95),
        "JPEG",
        0,
        0,
        imgWidth,
        imgHeight,
      );
    } else {
      // For multi-page documents
      let position = 0;

      // Add first page
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.95),
        "JPEG",
        0,
        position,
        imgWidth,
        imgHeight,
      );

      // Add additional pages
      for (let i = 1; i < pagesCount; i++) {
        position = -pageHeight * i;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.95),
          "JPEG",
          0,
          position,
          imgWidth,
          imgHeight,
        );
      }
    }

    // Save the PDF
    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
