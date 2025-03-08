import html2pdf from 'html2pdf.js';

interface PDFOptions {
  filename?: string;
  margin?: number | number[];
  imageQuality?: number;
  pageSize?: string;
  orientation?: 'portrait' | 'landscape';
  jsPDF?: any; 
}

export const generatePDF = async (element: HTMLElement, fileName: string, options: any = {}) => {
  const html2pdf = (await import('html2pdf.js')).default;

  const defaultOptions = {
    margin: [0.5, 0.5, 0.5, 0.5], 
    filename: fileName,
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
      format: 'letter', 
      orientation: 'portrait',
      compress: true,
      hotfixes: ["px_scaling"]
    }
  };

  const originalStyles = window.getComputedStyle(element);
  const originalPadding = element.style.padding;

  element.style.padding = "10mm";
  element.style.maxWidth = "210mm";
  element.style.fontSize = "10pt";

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    await html2pdf().from(element).set(mergedOptions).save();
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Handle the error appropriately, e.g., display an error message to the user.
  } finally {
    element.style.padding = originalPadding;
  }
};