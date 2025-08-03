import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import PDFDocument from '../PDFDocument';
import { Page } from '../types';

/**
 * Hook for managing PDF generation functionality
 */
export function usePDFGeneration() {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  /**
   * Generate a filename based on the first page content
   */
  const generateFilename = (pages: Page[]): string => {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
    const firstSlide = pages[0];
    
    if (!firstSlide) return `slides_${timestamp}.pdf`;

    // Use title if available and not empty
    if (firstSlide.title && firstSlide.title.trim() !== "") {
      const titlePart = firstSlide.title
        .trim()
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      return `slides_${timestamp}_${titlePart}.pdf`;
    }

    // Fallback to first few words of content
    const words = firstSlide.content.trim().split(/\s+/).slice(0, 4);
    if (words.length > 0) {
      const contentPart = words
        .join("_")
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      return `slides_${timestamp}_${contentPart}.pdf`;
    }

    return `slides_${timestamp}.pdf`;
  };

  /**
   * Generate and download PDF
   */
  const generatePdf = async (
    pages: Page[],
    authorName: string,
    font: string,
    showPageNumbers: boolean,
    onComplete?: () => void
  ) => {
    setIsGeneratingPdf(true);
    
    try {
      const blob = await pdf(
        <PDFDocument
          pages={pages}
          authorName={authorName}
          font={font}
          showPageNumbers={showPageNumbers}
        />
      ).toBlob();

      const filename = generateFilename(pages);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Call completion callback (e.g., to clear saved data)
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error; // Re-throw so caller can handle if needed
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return {
    // State
    isGeneratingPdf,
    
    // Actions
    generatePdf,
    generateFilename,
    
    // Utilities
    setIsGeneratingPdf, // In case manual control is needed
  };
}