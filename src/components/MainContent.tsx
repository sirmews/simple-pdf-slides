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
          className="card"
        >
          <div className="card-header">
            <div>
              <h1 className="heading-primary">
                Kinda professional carousels
              </h1>
              <p className="text-secondary mt-2">
                Y'know those awful carousels we're forced to navigate in LinkedIn?
                <br />
                Be the problem, not the solution. Here's a solution
              </p>
              <p className="text-secondary mt-2">
                Now with emoji support! Express yourself professionally 🚀
              </p>
              
              <FeatureAlert
                isDarkMode={isDarkMode}
                message="New: Full-page background image template and improved template selection!"
                onDismiss={() => {/* Could store in localStorage to persist dismissal */}}
              />
            </div>
          </div>

          <div className="card-content">
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
              className="btn-outline w-full"
            >
              <PlusCircle className="w-5 h-5 mx-auto mb-2" />
              Add New Slide
            </button>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="label-text block mb-2"
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Author Name (optional)
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => updateAuthorName(e.target.value)}
                    placeholder="Your name"
                    className="input-field"
                  />
                </div>

                <div>
                  <label
                    className="label-text block mb-2"
                  >
                    <Type className="w-4 h-4 inline mr-2" />
                    Font Family
                  </label>
                  <select
                    value={font}
                    onChange={(e) => updateFont(e.target.value)}
                    className="input-field"
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
                  className="label-text"
                >
                  Show page numbers
                </label>
              </div>
            </div>

            <button
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf}
              className="btn-primary w-full"
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