import { useState, useEffect } from "react";
import { pdf } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument';
import PageInput from './components/PageInput';
import CanvasView from './components/CanvasView';
import { useDarkMode } from './hooks/useDarkMode';
import { SlideData, FontFamily, PDFConfig } from '@/types/slide';
import { ViewMode } from '@/types/canvas';
import {
  ArrowDownToLine,
  Loader2,
  Moon,
  PlusCircle,
  Sun,
  Type,
  User,
  Layout,
  Edit3,
} from "lucide-react";


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
          viewMode: parsed.viewMode || "form" as ViewMode,
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
      viewMode: "form" as ViewMode,
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

  if (viewMode === 'canvas') {
    return (
      <div className={`${isDarkMode ? "dark bg-gray-900" : "bg-slate-100"} min-h-screen font-sans transition-colors duration-200`}>
        {/* Top Bar with Hero and Controls */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-start mb-8">
            
            {/* Hero Section - Left */}
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"} p-6 max-w-md`}>
              <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                Kinda professional carousels
              </h1>
              <p className={`${isDarkMode ? "text-gray-400" : "text-slate-500"} mt-2`}>
                Y'know those awful carousels we're forced to navigate in LinkedIn?
                <br />
                Be the problem, not the solution. Here's a solution
              </p>
              <p className={`${isDarkMode ? "text-gray-400" : "text-slate-500"} mt-2`}>
                Now with emoji support! Express yourself professionally 🚀
              </p>
            </div>

            {/* Controls - Right */}
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className={`flex rounded-lg border ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'
              }`}>
                <button
                  onClick={() => setViewMode('form')}
                  className={`px-3 py-2 rounded-l-lg transition-colors duration-200 flex items-center space-x-2 ${
                    viewMode === 'form'
                      ? isDarkMode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-500 text-white'
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-600' 
                        : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Form View"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Form</span>
                </button>
                <button
                  onClick={() => setViewMode('canvas')}
                  className={`px-3 py-2 rounded-r-lg transition-colors duration-200 flex items-center space-x-2 ${
                    viewMode === 'canvas'
                      ? isDarkMode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-500 text-white'
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-600' 
                        : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Canvas View - WYSIWYG"
                >
                  <Layout className="w-4 h-4" />
                  <span className="text-sm font-medium">Canvas</span>
                </button>
              </div>

              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
                title={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Canvas View Content */}
        <CanvasView
          slides={pages}
          font={font}
          authorName={authorName}
          showPageNumbers={showPageNumbers}
          onSlideUpdate={handleSlideUpdate}
          onSlideAdd={handleAddPage}
          onSlideRemove={handleRemovePage}
          onSlideDuplicate={handleSlideDuplicate}
          onAuthorNameChange={setAuthorName}
          onFontChange={setFont}
          onShowPageNumbersChange={setShowPageNumbers}
          onGeneratePdf={handleGeneratePdf}
          isGeneratingPdf={isGeneratingPdf}
          isDarkMode={isDarkMode}
        />
      </div>
    );
  }

  return (
    <div
      className={`${isDarkMode ? "dark bg-gray-900" : "bg-slate-100"} flex items-center justify-center min-h-screen font-sans py-10 transition-colors duration-200`}
    >
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
        <div
          className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"} transition-colors duration-200`}
        >
          <div
            className={`p-6 md:p-8 border-b ${isDarkMode ? "border-gray-700" : "border-slate-200"} flex justify-between items-center`}
          >
            <div>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}
              >
                Kinda professional carousels
              </h1>
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-slate-500"} mt-2`}
              >
                Y'know those awful carousels we're forced to navigate in LinkedIn?
                <br />
                Be the problem, not the solution. Here's a solution
              </p>
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-slate-500"} mt-2`}
              >
                Now with emoji support! Express yourself professionally 🚀
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className={`flex rounded-lg border ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'
              }`}>
                <button
                  onClick={() => setViewMode('form')}
                  className={`px-3 py-2 rounded-l-lg transition-colors duration-200 flex items-center space-x-2 ${
                    viewMode === 'form'
                      ? isDarkMode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-500 text-white'
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-600' 
                        : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Form View"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Form</span>
                </button>
                <button
                  onClick={() => setViewMode('canvas')}
                  className={`px-3 py-2 rounded-r-lg transition-colors duration-200 flex items-center space-x-2 ${
                    viewMode === 'canvas'
                      ? isDarkMode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-500 text-white'
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-600' 
                        : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Canvas View - WYSIWYG"
                >
                  <Layout className="w-4 h-4" />
                  <span className="text-sm font-medium">Canvas</span>
                </button>
              </div>

              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
                title={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Conditional Content Based on View Mode */}
          {viewMode === 'form' && (
            <>
              <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-4">
                {pages.map((page, index) => (
                  <PageInput
                    key={index}
                    index={index}
                    title={page.title}
                    content={page.content}
                    backgroundColor={page.backgroundColor}
                    image={page.image}
                    template={page.template}
                    onContentChange={handlePageContentChange}
                    onTitleChange={handlePageTitleChange}
                    onBackgroundColorChange={handlePageBackgroundColorChange}
                    onImageChange={handlePageImageChange}
                    onImageRemove={handlePageImageRemove}
                    onTemplateChange={handlePageTemplateChange}
                    onRemove={handleRemovePage}
                    canBeRemoved={true}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>

              <div>
                <button
                  onClick={handleAddPage}
                  className={`w-full flex items-center justify-center font-semibold py-2 px-4 rounded-lg border-2 border-dashed transition-all duration-200 ${
                    isDarkMode
                      ? "text-blue-400 border-blue-400 hover:bg-blue-900/20 hover:border-solid"
                      : "text-blue-600 border-blue-400 hover:bg-blue-50 hover:border-solid"
                  }`}
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Add Slide
                </button>
              </div>

              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t ${isDarkMode ? "border-gray-700" : "border-slate-200"}`}
              >
                <div className="space-y-2">
                  <label
                    htmlFor="authorName"
                    className={`flex items-center text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Author Name
                  </label>
                  <input
                    type="text"
                    id="authorName"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className={`w-full p-3 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                    placeholder="e.g., Alex Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="font"
                    className={`flex items-center text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Font Style
                  </label>
                  <select
                    id="font"
                    value={font}
                    onChange={(e) => setFont(e.target.value as FontFamily)}
                    className={`w-full p-3 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none bg-no-repeat bg-right pr-8`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23${isDarkMode ? "ffffff" : "6b7280"}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.5rem center",
                      backgroundSize: "1.5em 1.5em",
                    }}
                  >
                    <option value="helvetica">Helvetica (Sans-Serif)</option>
                    <option value="times">Times (Serif)</option>
                    <option value="courier">Courier (Monospace)</option>
                  </select>
                </div>

                <div className="flex items-center justify-start sm:justify-center sm:mt-6">
                  <input
                    type="checkbox"
                    id="showPageNumbers"
                    checked={showPageNumbers}
                    onChange={(e) => setShowPageNumbers(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="showPageNumbers"
                    className={`ml-2 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}
                  >
                    Show Page Numbers
                  </label>
                </div>
              </div>
            </div>

            <div
              className={`p-6 md:p-8 ${isDarkMode ? "bg-gray-700/30" : "bg-slate-50/50"} rounded-b-2xl`}
            >
              <button
                onClick={handleGeneratePdf}
                disabled={isGeneratingPdf}
                className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <ArrowDownToLine className="w-5 h-5 mr-3" />
                    Generate & Download PDF ({pages.length}{" "}
                    {pages.length === 1 ? "Slide" : "Slides"})
                  </>
                )}
              </button>
            </div>
            </>
          )}
        </div>


        {/* Ko-fi Support Button - Only in Form View */}
        {viewMode === 'form' && (
          <div className="flex justify-center mt-6">
            <a href='https://ko-fi.com/A0A01HT0RG' target='_blank' rel='noopener noreferrer'>
              <img 
                height='36' 
                style={{border: '0px', height: '36px'}} 
                src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' 
                alt='Buy Me a Coffee at ko-fi.com' 
              />
            </a>
          </div>
        )}

        {/* Footer - Only in Form View */}
        {viewMode === 'form' && (
          <footer
            className={`text-center mt-4 text-sm ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}
          >
            <p>&copy; 2025 PDF Slide Generator. Built with vibes by Nav.</p>
          </footer>
        )}
      </div>
    </div>
  );
}