import { useState, useEffect } from "react";
import { pdf } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument';
import AppHeader from './components/AppHeader';
import FormView from './components/FormView';
import GridView from './components/GridView';
import { useDarkMode } from './hooks/useDarkMode';
import { SlideData, FontFamily, PDFConfig } from '@/types/slide';
import { ViewMode } from '@/types/canvas';
import { GridSlideData } from '@/types/grid';


// Main App Component
export default function App() {
  // Load saved data from localStorage or use defaults
  const loadSavedData = () => {
    try {
      const savedData = localStorage.getItem('pdf-slides-data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        return {
          pages: parsed.pages || [{
            title: "Welcome!",
            content: "Create beautiful, slide-deck style PDFs for your social media posts.",
            backgroundColor: "#e0f2fe",
            image: null,
            template: "simple" as const,
          }],
          authorName: parsed.authorName || "Your Name",
          font: parsed.font || "helvetica" as FontFamily,
          showPageNumbers: parsed.showPageNumbers !== undefined ? parsed.showPageNumbers : true,
          viewMode: parsed.viewMode || "grid" as ViewMode,
        };
      }
    } catch (error) {
      console.log('Error loading saved data:', error);
    }
    
    // Return defaults if no saved data or error
    return {
      pages: [{
        title: "Welcome!",
        content: "Create beautiful, slide-deck style PDFs for your social media posts.",
        backgroundColor: "#e0f2fe",
        image: null,
        template: "simple" as const,
      }] as SlideData[],
      authorName: "Your Name",
      font: "helvetica" as FontFamily,
      showPageNumbers: true,
      viewMode: "grid" as ViewMode,
    };
  };

  const savedData = loadSavedData();
  
  // State hooks to store user input
  const [pages, setPages] = useState<SlideData[]>(savedData.pages);
  const [authorName, setAuthorName] = useState<string>(savedData.authorName);
  const [font, setFont] = useState<FontFamily>(savedData.font);
  const [showPageNumbers, setShowPageNumbers] = useState<boolean>(savedData.showPageNumbers);
  const [viewMode, setViewMode] = useState<ViewMode>(savedData.viewMode);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [gridSlides, setGridSlides] = useState<GridSlideData[]>([]);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    const dataToSave = {
      pages,
      authorName,
      font,
      showPageNumbers,
      viewMode,
    };
    
    try {
      localStorage.setItem('pdf-slides-data', JSON.stringify(dataToSave));
    } catch (error) {
      console.log('Error saving data:', error);
    }
  }, [pages, authorName, font, showPageNumbers, viewMode]);

  // Clear saved data from localStorage
  const clearSavedData = () => {
    try {
      localStorage.removeItem('pdf-slides-data');
    } catch (error) {
      console.log('Error clearing saved data:', error);
    }
  };


  const handleAddPage = () => {
    setPages([...pages, { title: "", content: "", backgroundColor: "#e0f2fe", image: null, template: "simple" as const }]);
  };

  const handleRemovePage = (indexToRemove: number) => {
    if (indexToRemove === 0) {
      // For the first slide, clear its content instead of removing it
      const updatedPages = [...pages];
      updatedPages[0] = {
        title: "",
        content: "",
        backgroundColor: "#e0f2fe",
        image: null,
        template: "simple" as const,
      };
      setPages(updatedPages);
    } else {
      // For other slides, remove them completely
      setPages(pages.filter((_, index) => index !== indexToRemove));
    }
  };

  const handlePageContentChange = (index: number, newContent: string) => {
    const updatedPages = [...pages];
    updatedPages[index].content = newContent;
    setPages(updatedPages);
  };

  const handlePageTitleChange = (index: number, newTitle: string) => {
    const updatedPages = [...pages];
    updatedPages[index].title = newTitle;
    setPages(updatedPages);
  };

  const handlePageBackgroundColorChange = (index: number, newColor: string) => {
    const updatedPages = [...pages];
    updatedPages[index].backgroundColor = newColor;
    setPages(updatedPages);
  };

  const handlePageImageChange = (index: number, imageFile: File) => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedPages = [...pages];
        updatedPages[index].image = e.target?.result as string; // This will be a data URL
        setPages(updatedPages);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handlePageImageRemove = (index: number) => {
    const updatedPages = [...pages];
    updatedPages[index].image = null;
    setPages(updatedPages);
  };

  const handlePageTemplateChange = (index: number, newTemplate: string) => {
    const updatedPages = [...pages];
    updatedPages[index].template = newTemplate as any;
    setPages(updatedPages);
  };

  const handleSlideUpdate = (index: number, slide: SlideData) => {
    const updatedPages = [...pages];
    updatedPages[index] = slide;
    setPages(updatedPages);
  };

  const handleSlideDuplicate = (index: number) => {
    const slideToClone = pages[index];
    const newSlide = { ...slideToClone };
    const updatedPages = [...pages];
    updatedPages.splice(index + 1, 0, newSlide);
    setPages(updatedPages);
  };


  const generateFilename = () => {
    const firstSlide = pages[0];
    if (!firstSlide) return "slidedeck.pdf";

    // Use title if available and not empty
    if (firstSlide.title && firstSlide.title.trim() !== "") {
      return `${firstSlide.title
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase()}.pdf`;
    }

    // Fallback to first few words of content
    const words = firstSlide.content.trim().split(/\s+/).slice(0, 4);
    if (words.length > 0) {
      return `${words
        .join("-")
        .replace(/[^\w\s-]/g, "")
        .toLowerCase()}.pdf`;
    }

    return "slidedeck.pdf";
  };

  const handleGeneratePdf = async () => {
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

      const filename = generateFilename();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Clear saved data after successful download
      clearSavedData();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Render the appropriate view
  return (
    <div className={`${isDarkMode ? "dark bg-gray-900" : "bg-slate-100"} min-h-screen font-sans transition-colors duration-200`}>
      {/* Unified Header */}
      <AppHeader
        viewMode={viewMode}
        isDarkMode={isDarkMode}
        onViewModeChange={setViewMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content */}
      {viewMode === 'form' ? (
        <FormView
          slides={pages}
          font={font}
          authorName={authorName}
          showPageNumbers={showPageNumbers}
          isDarkMode={isDarkMode}
          isGeneratingPdf={isGeneratingPdf}
          onSlideUpdate={handleSlideUpdate}
          onSlideAdd={handleAddPage}
          onSlideRemove={handleRemovePage}
          onSlideDuplicate={handleSlideDuplicate}
          onAuthorNameChange={setAuthorName}
          onFontChange={setFont}
          onShowPageNumbersChange={setShowPageNumbers}
          onGeneratePdf={handleGeneratePdf}
        />
      ) : (
        <GridView
          slides={pages}
          gridSlides={gridSlides}
          isDarkMode={isDarkMode}
          isGeneratingPdf={isGeneratingPdf}
          onSlideAdd={handleAddPage}
          onGeneratePdf={handleGeneratePdf}
          onGridSlidesUpdate={setGridSlides}
          onSlidesUpdate={setPages}
        />
      )}
    </div>
  );
}