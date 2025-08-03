import { useLocalStorage } from './useLocalStorage';
import { AppData } from '../types';

/**
 * Default app data
 */
const DEFAULT_APP_DATA: AppData = {
  pages: [{ 
    title: "", 
    content: "", 
    backgroundColor: "#ffffff", 
    image: null, 
    template: "title-content" 
  }],
  authorName: "",
  font: "Inter",
  showPageNumbers: true,
};

/**
 * Hook for managing app-specific data in localStorage
 */
export function useAppData() {
  const [appData, setAppData, clearAppData] = useLocalStorage<AppData>('pdf-slides-data', DEFAULT_APP_DATA);

  // Helper functions for updating specific parts of the data
  const updatePages = (pages: AppData['pages']) => {
    setAppData(prev => ({ ...prev, pages }));
  };

  const updateAuthorName = (authorName: string) => {
    setAppData(prev => ({ ...prev, authorName }));
  };

  const updateFont = (font: string) => {
    setAppData(prev => ({ ...prev, font }));
  };

  const updateShowPageNumbers = (showPageNumbers: boolean) => {
    setAppData(prev => ({ ...prev, showPageNumbers }));
  };

  return {
    // Data
    pages: appData.pages,
    authorName: appData.authorName,
    font: appData.font,
    showPageNumbers: appData.showPageNumbers,
    
    // Update functions
    updatePages,
    updateAuthorName,
    updateFont,
    updateShowPageNumbers,
    
    // Full data operations
    setAppData,
    clearAppData,
  };
}