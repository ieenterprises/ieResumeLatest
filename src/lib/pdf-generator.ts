import html2pdf from "html2pdf.js";

export async function generatePDF(
  element: HTMLElement,
  fileName: string,
): Promise<void> {
  try {
    // Add a class to the element before generating PDF to apply special styles
    element.classList.add("pdf-generation");

    // Configure the PDF options
    const opt = {
      margin: 0.5, // 1.27 cm converted to inches (0.5 inches)
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        removeContainer: true,
      },
      pagebreak: {
        avoid: ".keep-together",
        mode: ["avoid-all"],
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "portrait",
        compress: true,
      },
    };

    // Generate the PDF
    await html2pdf().set(opt).from(element).save();

    // Remove the class after PDF generation
    element.classList.remove("pdf-generation");
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
