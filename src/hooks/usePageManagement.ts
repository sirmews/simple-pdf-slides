import { useAppData } from './useAppData';
import { Page } from '../types';

/**
 * Hook for managing page operations (CRUD operations on pages)
 */
export function usePageManagement() {
  const { pages, updatePages } = useAppData();

  /**
   * Create a new empty page with default values
   */
  const createNewPage = (): Page => ({
    title: "",
    content: "",
    backgroundColor: "#ffffff",
    image: null,
    template: "title-content"
  });

  /**
   * Update a page at a specific index with partial updates
   */
  const updatePageAtIndex = (index: number, updates: Partial<Page>) => {
    const newPages = [...pages];
    newPages[index] = { ...newPages[index], ...updates };
    updatePages(newPages);
  };

  /**
   * Check if a page can be removed (must have at least one page)
   */
  const canRemovePage = (index: number): boolean => {
    return pages.length > 1;
  };

  // Page content handlers
  const handlePageContentChange = (index: number, content: string) => {
    updatePageAtIndex(index, { content });
  };

  const handlePageTitleChange = (index: number, title: string) => {
    updatePageAtIndex(index, { title });
  };

  const handlePageBackgroundColorChange = (index: number, backgroundColor: string) => {
    updatePageAtIndex(index, { backgroundColor });
  };

  const handlePageImageChange = (index: number, imageFile: File) => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const image = e.target?.result as string;
        updatePageAtIndex(index, { image });
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handlePageImageRemove = (index: number) => {
    updatePageAtIndex(index, { image: null });
  };

  const handlePageTemplateChange = (index: number, template: string) => {
    updatePageAtIndex(index, { template });
  };

  const handleAddPage = () => {
    const newPage = createNewPage();
    updatePages([...pages, newPage]);
  };

  const handleRemovePage = (index: number) => {
    if (canRemovePage(index)) {
      const newPages = pages.filter((_, i) => i !== index);
      updatePages(newPages);
    }
  };

  return {
    // Data
    pages,
    pageCount: pages.length,
    
    // Actions
    handlePageContentChange,
    handlePageTitleChange,
    handlePageBackgroundColorChange,
    handlePageImageChange,
    handlePageImageRemove,
    handlePageTemplateChange,
    handleAddPage,
    handleRemovePage,
    
    // Utilities
    canRemovePage,
    createNewPage,
  };
}