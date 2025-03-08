
import html2pdf from 'html2pdf.js';

export const generatePDF = async (element: HTMLElement, fileName: string, options: any = {}) => {
  try {
    // Create a clone of the element to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement;
    document.body.appendChild(clone);
    
    // Add PDF generation class to the clone
    clone.classList.add('pdf-generation');
    clone.style.width = '210mm'; // A4 width
    clone.style.minHeight = '297mm'; // A4 height
    clone.style.padding = '15mm';
    clone.style.backgroundColor = 'white';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    
    // Default options
    const defaultOptions = {
      margin: [10, 10, 10, 10], // [top, right, bottom, left] in mm
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true,
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

    // Generate PDF from the clone
    await html2pdf()
      .from(clone)
      .set(mergedOptions)
      .save();

    // Clean up - remove the clone after generation
    document.body.removeChild(clone);
    
    console.log('PDF generated successfully');
    return true;
  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw error;
  }
};
