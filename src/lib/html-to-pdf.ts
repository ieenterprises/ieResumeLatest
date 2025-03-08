
import html2pdf from 'html2pdf.js';

interface PDFOptions {
  filename?: string;
  margin?: number | number[];
  imageQuality?: number;
  pageSize?: string;
  orientation?: 'portrait' | 'landscape';
  jsPDF?: any;
}

export const generatePDF = async (element: HTMLElement, fileName: string, options: Partial<PDFOptions> = {}) => {
  if (!element) {
    console.error('No element provided for PDF generation');
    return;
  }

  // Store original styling
  const originalPadding = element.style.padding;

  try {
    // Add PDF generation class if not already present
    if (!element.classList.contains('pdf-generation')) {
      element.classList.add('pdf-generation');
    }

    // Default options with better values for PDF generation
    const defaultOptions = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: fileName || 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      enableLinks: true,
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'in', 
        format: [8.5, 11], // Letter size in inches
        orientation: 'portrait',
        compress: true
      }
    };

    // Apply some specific styling for better PDF generation
    element.style.padding = "10mm";
    element.style.width = "210mm";
    element.style.maxWidth = "210mm";
    element.style.margin = "0 auto";
    element.style.fontSize = "10pt";

    // Return a promise for better handling
    return new Promise((resolve, reject) => {
      html2pdf()
        .from(element)
        .set(defaultOptions)
        .save()
        .then(() => {
          console.log('PDF generated successfully');
          resolve(true);
        })
        .catch((error) => {
          console.error('Error in PDF generation:', error);
          reject(error);
        })
        .finally(() => {
          // Restore original styling
          element.style.padding = originalPadding;
        });
    });
  } catch (error) {
    console.error("Error setting up PDF generation:", error);
    // Restore original styling
    element.style.padding = originalPadding;
    throw error;
  }
};
