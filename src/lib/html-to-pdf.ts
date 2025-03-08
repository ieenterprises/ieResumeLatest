
import html2pdf from 'html2pdf.js';

interface PDFOptions {
  filename?: string;
  margin?: number;
  imageQuality?: number;
  pageSize?: string;
  orientation?: 'portrait' | 'landscape';
  jsPDF?: any; 
}

export const generatePDF = async (element: HTMLElement, fileName: string, options: any = {}) => {
  try {
    // Ensure element has a class for PDF-specific styling
    element.classList.add('pdf-generation');

    // Default options
    const defaultOptions = {
      margin: [15, 15, 15, 15], // [top, right, bottom, left] in mm
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Merge with custom options
    const mergedOptions = {
      ...defaultOptions,
      ...options,
    };

    // Generate PDF
    const pdf = await html2pdf()
      .set(mergedOptions)
      .from(element)
      .save();

    // Remove PDF generation class
    element.classList.remove('pdf-generation');

    console.log('PDF generated successfully');
    return pdf;
  } catch (error) {
    console.error('Error in PDF generation:', error);
    element.classList.remove('pdf-generation');
    throw error;
  }
};
