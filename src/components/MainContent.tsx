import PageInput from './PageInput';
import FeatureAlert from './FeatureAlert';
import { useAppData } from '../hooks/useAppData';
import { usePageManagement } from '../hooks/usePageManagement';
import { usePDFGeneration } from '../hooks/usePDFGeneration';
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
    authorName,
    font,
    showPageNumbers,
    updateAuthorName,
    updateFont,
    updateShowPageNumbers,
    clearAppData,
  } = useAppData();

  // Use page management hook
  const {
    pages,
    pageCount,
    handlePageContentChange,
    handlePageTitleChange,
    handlePageBackgroundColorChange,
    handlePageImageChange,
    handlePageImageRemove,
    handlePageTemplateChange,
    handleAddPage,
    handleRemovePage,
  } = usePageManagement();

  // Use PDF generation hook
  const { isGeneratingPdf, generatePdf } = usePDFGeneration();

  const handleGeneratePdf = async () => {
    await generatePdf(pages, authorName, font, showPageNumbers, clearAppData);
  };

  return (
    <main className="flex items-center justify-center min-h-screen pt-16 pb-20">
      <div className="w-full max-w-2xl mx-auto md:px-8">
        <div
          id="pdf-slides-main-card"
          data-component="PDFSlidesMainCard"
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
              
              <FeatureAlert
                isDarkMode={isDarkMode}
                message="New: Full-page background image template and improved template selection!"
                onDismiss={() => {/* Could store in localStorage to persist dismissal */}}
              />
            </div>
          </div>

          <div className="p-4 md:p-8 space-y-6">
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
                  Generate & Download PDF ({pageCount}{" "}
                  {pageCount === 1 ? "Slide" : "Slides"})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}