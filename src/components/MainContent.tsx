import { useState } from "react";
import { pdf } from '@react-pdf/renderer';
import PDFDocument from '../PDFDocument';
import PageInput from './PageInput';
import { useAppData } from '../hooks/useAppData';
// Remove unused import - Page type is used in useAppData hook
import {
  ArrowDownToLine,
  Loader2,
  PlusCircle,
  Type,
  User,
} from "lucide-react";

interface MainContentProps {
  isDarkMode: boolean;
}

export default function MainContent({ isDarkMode }: MainContentProps) {
  // Use our custom hooks for data management
  const {
    pages,
    authorName,
    font,
    showPageNumbers,
    updatePages,
    updateAuthorName,
    updateFont,
    updateShowPageNumbers,
    clearAppData,
  } = useAppData();

  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const handlePageContentChange = (index: number, content: string) => {
    const newPages = [...pages];
    newPages[index].content = content;
    updatePages(newPages);
  };

  const handlePageTitleChange = (index: number, title: string) => {
    const newPages = [...pages];
    newPages[index].title = title;
    updatePages(newPages);
  };

  const handlePageBackgroundColorChange = (index: number, color: string) => {
    const newPages = [...pages];
    newPages[index].backgroundColor = color;
    updatePages(newPages);
  };

  const handlePageImageChange = (index: number, imageFile: File) => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const newPages = [...pages];
        newPages[index].image = e.target?.result as string;
        updatePages(newPages);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handlePageImageRemove = (index: number) => {
    const newPages = [...pages];
    newPages[index].image = null;
    updatePages(newPages);
  };

  const handlePageTemplateChange = (index: number, template: string) => {
    const newPages = [...pages];
    newPages[index].template = template;
    updatePages(newPages);
  };

  const handleAddPage = () => {
    updatePages([...pages, { title: "", content: "", backgroundColor: "#ffffff", image: null, template: "title-content" }]);
  };

  const handleRemovePage = (index: number) => {
    if (pages.length > 1) {
      const newPages = pages.filter((_, i) => i !== index);
      updatePages(newPages);
    }
  };

  const generateFilename = () => {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
    const authorPart = authorName ? `_${authorName.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
    return `slides_${timestamp}${authorPart}.pdf`;
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
      clearAppData();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen pt-16 pb-20">
      <div className="w-full max-w-2xl mx-auto px-6 md:px-8">
        <div
          className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"} transition-colors duration-200`}
        >
          <div
            className={`p-6 md:p-8 border-b ${isDarkMode ? "border-gray-700" : "border-slate-200"}`}
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
          </div>

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

            <button
              onClick={handleAddPage}
              className={`w-full p-4 border-2 border-dashed rounded-lg transition-colors duration-200 ${
                isDarkMode
                  ? "border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300"
                  : "border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-600"
              }`}
            >
              <PlusCircle className="w-5 h-5 mx-auto mb-2" />
              Add New Slide
            </button>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Author Name (optional)
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => updateAuthorName(e.target.value)}
                    placeholder="Your name"
                    className={`w-full p-3 border rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}
                  >
                    <Type className="w-4 h-4 inline mr-2" />
                    Font Family
                  </label>
                  <select
                    value={font}
                    onChange={(e) => updateFont(e.target.value)}
                    className={`w-full p-3 border rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    <option value="Inter">Inter</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times-Roman">Times New Roman</option>
                    <option value="Courier">Courier</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showPageNumbers"
                  checked={showPageNumbers}
                  onChange={(e) => updateShowPageNumbers(e.target.checked)}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="showPageNumbers"
                  className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}
                >
                  Show page numbers
                </label>
              </div>
            </div>

            <button
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf}
              className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
                isGeneratingPdf
                  ? isDarkMode
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
              }`}
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
        </div>
      </div>
    </main>
  );
}