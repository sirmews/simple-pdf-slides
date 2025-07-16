import { useState } from "react";
import { pdf } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument';
import PageInput from './components/PageInput';
import { useDarkMode } from './hooks/useDarkMode';
import {
  ArrowDownToLine,
  Loader2,
  Moon,
  PlusCircle,
  Sun,
  Type,
  User,
} from "lucide-react";


// Main App Component
export default function App() {
  // State hooks to store user input
  const [pages, setPages] = useState([
    {
      title: "Welcome!",
      content:
        "Create beautiful, slide-deck style PDFs for your social media posts.",
      backgroundColor: "#e0f2fe",
      image: null,
    },
  ]);
  const [authorName, setAuthorName] = useState("Your Name");
  const [font, setFont] = useState("helvetica");
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleAddPage = () => {
    setPages([...pages, { title: "", content: "", backgroundColor: "#e0f2fe", image: null }]);
  };

  const handleRemovePage = (indexToRemove) => {
    setPages(pages.filter((_, index) => index !== indexToRemove));
  };

  const handlePageContentChange = (index, newContent) => {
    const updatedPages = [...pages];
    updatedPages[index].content = newContent;
    setPages(updatedPages);
  };

  const handlePageTitleChange = (index, newTitle) => {
    const updatedPages = [...pages];
    updatedPages[index].title = newTitle;
    setPages(updatedPages);
  };

  const handlePageBackgroundColorChange = (index, newColor) => {
    const updatedPages = [...pages];
    updatedPages[index].backgroundColor = newColor;
    setPages(updatedPages);
  };

  const handlePageImageChange = (index, imageFile) => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedPages = [...pages];
        updatedPages[index].image = e.target.result; // This will be a data URL
        setPages(updatedPages);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handlePageImageRemove = (index) => {
    const updatedPages = [...pages];
    updatedPages[index].image = null;
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
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div
      className={`${isDarkMode ? "dark bg-gray-900" : "bg-slate-100"} flex items-center justify-center min-h-screen font-sans py-10 transition-colors duration-200`}
    >
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
        <div
          className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-2xl ${isDarkMode ? "shadow-black/60" : "shadow-slate-300/60"} transition-colors duration-200`}
        >
          <div
            className={`p-6 md:p-8 border-b ${isDarkMode ? "border-gray-700" : "border-slate-200"} flex justify-between items-center`}
          >
            <div>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}
              >
                Slide Deck PDF Generator
              </h1>
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-slate-500"} mt-2`}
              >
                Create square, slide-style PDFs perfect for LinkedIn carousels.
              </p>
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-slate-500"} mt-2`}
              >
                Now with emoji support! Express yourself professionally.
              </p>
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
                  onContentChange={handlePageContentChange}
                  onTitleChange={handlePageTitleChange}
                  onBackgroundColorChange={handlePageBackgroundColorChange}
                  onImageChange={handlePageImageChange}
                  onImageRemove={handlePageImageRemove}
                  onRemove={handleRemovePage}
                  canBeRemoved={pages.length > 1}
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
                  className={`w-full p-3 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-slate-50 border-slate-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
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
                  onChange={(e) => setFont(e.target.value)}
                  className={`w-full p-3 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-slate-50 border-slate-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-no-repeat bg-right pr-8`}
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
              className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 ease-in-out shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
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

        <footer
          className={`text-center mt-8 text-sm ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}
        >
          <p>&copy; 2025 PDF Slide Generator. Built with vibes by Nav.</p>
        </footer>
      </div>
    </div>
  );
}