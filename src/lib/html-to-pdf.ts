import html2pdf from 'html2pdf.js';

interface PDFOptions {
  filename?: string;
  margin?: number;
  imageQuality?: number;
  pageSize?: string;
  orientation?: 'portrait' | 'landscape';
  jsPDF?: any; // Added to accommodate jsPDF options
}

export async function generatePDF(element: HTMLElement, filename: string = 'document.pdf', options: Partial<PDFOptions> = {}) {
  // Add a class to the element before generating PDF to apply special styles
  element.classList.add('pdf-generation');
  
  const opt = {
    margin: options.margin || 0.5,
    filename: filename,
    image: { type: 'jpeg', quality: options.imageQuality || 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      removeContainer: true,
      backgroundColor: null
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    jsPDF: { 
      unit: 'in', 
      format: options.pageSize || 'letter', 
      orientation: options.orientation || 'portrait',
      ...options.jsPDF // Apply additional jsPDF options if provided
    }
  };

  return html2pdf().set(opt).from(element).save();
}