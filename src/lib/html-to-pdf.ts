
// Import the library directly, not dynamically
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

    // Apply some additional styling for better PDF generation
    element.style.padding = "10mm";
    element.style.maxWidth = "210mm";
    element.style.fontSize = "10pt";

    // Default options with better values for PDF generation
    const defaultOptions = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: fileName || 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      enableLinks: true,
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: true,
        letterRendering: true,
        allowTaint: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait',
        compress: true,
        hotfixes: ["px_scaling"]
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Merge options
    const mergedOptions = { ...defaultOptions, ...options };

    // Use promise-based approach
    return new Promise((resolve, reject) => {
      html2pdf()
        .from(element)
        .set(mergedOptions)
        .save()
        .then(() => {
          console.log('PDF generated successfully');
          resolve(true);
        })
        .catch((error) => {
          console.error('Error in PDF generation:', error);
          reject(error);
        });
    });
  } catch (error) {
    console.error("Error setting up PDF generation:", error);
    throw error;
  } finally {
    // Restore original styling
    element.style.padding = originalPadding;
    
    // Remove class if we added it
    if (!element.classList.contains('pdf-generation')) {
      element.classList.remove('pdf-generation');
    }
  }
};
