import React, { useState, useEffect } from 'react';
// The 'jspdf' import is removed as it causes a resolution error in this environment.
// We will access it from the global window object instead.
import { ArrowDownToLine, FileText, Palette, User, Loader2, PlusCircle, XCircle, Type, Hash, Heading2 } from 'lucide-react';

const MAX_CHARS_PER_PAGE = 250;
const MAX_CHARS_TITLE = 50;

// A new component to handle the input for a single page.
function PageInput({ index, title, content, onContentChange, onTitleChange, onRemove, canBeRemoved }) {
  const charsLeft = MAX_CHARS_PER_PAGE - content.length;

  const handleTextChange = (e) => {
    // Enforce the character limit
    const newText = e.target.value.slice(0, MAX_CHARS_PER_PAGE);
    onContentChange(index, newText);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value.slice(0, MAX_CHARS_TITLE);
    onTitleChange(index, newTitle);
  }

  return (
    <div className="relative p-4 bg-slate-50 border border-slate-200 rounded-lg transition-all duration-300 space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-slate-600">Slide {index + 1}</label>
        {canBeRemoved && (
          <button
            onClick={() => onRemove(index)}
            className="text-slate-400 hover:text-red-500 transition-colors"
            title="Remove Slide"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Optional Title Input */}
      <input 
        type="text"
        value={title}
        onChange={handleTitleChange}
        className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        placeholder="Optional Title..."
      />

      <textarea
        value={content}
        onChange={handleTextChange}
        className="w-full h-32 p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none"
        placeholder={`Write slide ${index + 1} content here...`}
      />
      <div className={`text-right text-sm mt-1 ${charsLeft < 25 ? 'text-red-500' : 'text-slate-500'}`}>
        {charsLeft} characters remaining
      </div>
    </div>
  );
}


// Main App Component
export default function App() {
  // State hooks to store user input
  const [pages, setPages] = useState([{ title: 'Welcome!', content: 'Create beautiful, slide-deck style PDFs for your social media posts.' }]);
  const [authorName, setAuthorName] = useState('Your Name');
  const [backgroundColor, setBackgroundColor] = useState('#e0f2fe');
  const [font, setFont] = useState('helvetica');
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [isPdfLibReady, setIsPdfLibReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.async = true;
    script.onload = () => setIsPdfLibReady(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAddPage = () => {
    setPages([...pages, { title: '', content: '' }]);
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
  }

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const getContrastTextColor = (backgroundColor) => {
    const rgb = hexToRgb(backgroundColor);
    if (!rgb) return '#1e293b';
    
    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
    return luminance > 0.5 ? '#1e293b' : '#ffffff';
  };

  const generateFilename = () => {
    const firstSlide = pages[0];
    if (!firstSlide) return 'slidedeck.pdf';
    
    // Use title if available and not empty
    if (firstSlide.title && firstSlide.title.trim() !== '') {
      return `${firstSlide.title.trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase()}.pdf`;
    }
    
    // Fallback to first few words of content
    const words = firstSlide.content.trim().split(/\s+/).slice(0, 4);
    if (words.length > 0) {
      return `${words.join('-').replace(/[^\w\s-]/g, '').toLowerCase()}.pdf`;
    }
    
    return 'slidedeck.pdf';
  };

  const handleGeneratePdf = () => {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
      console.error("PDF generation library (jsPDF) not found.");
      return;
    }

    const doc = new jsPDF('l', 'mm', [200, 200]);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    const textColor = getContrastTextColor(backgroundColor);
    const secondaryTextColor = textColor === '#ffffff' ? '#e2e8f0' : '#64748b';

    pages.forEach((page, index) => {
      if (index > 0) doc.addPage();

      doc.setFillColor(backgroundColor);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      const hasTitle = page.title && page.title.trim() !== '';

      if (hasTitle) {
        // Layout WITH a title
        doc.setFont(font, 'bold');
        doc.setFontSize(34);
        doc.setTextColor(textColor);
        const titleLines = doc.splitTextToSize(page.title, pageWidth - margin * 2);
        doc.text(titleLines, pageWidth / 2, pageHeight / 2 - 20, { align: 'center', baseline: 'middle' });

        doc.setFont(font, 'normal');
        doc.setFontSize(22);
        doc.setTextColor(textColor);
        const contentLines = doc.splitTextToSize(page.content, pageWidth - margin * 2);
        doc.text(contentLines, pageWidth / 2, pageHeight / 2 + 20, { align: 'center', baseline: 'middle' });

      } else {
        // Layout WITHOUT a title (original layout)
        doc.setFont(font, 'bold');
        doc.setFontSize(28);
        doc.setTextColor(textColor);
        const textLines = doc.splitTextToSize(page.content, pageWidth - margin * 2);
        doc.text(textLines, pageWidth / 2, pageHeight / 2, { align: 'center', baseline: 'middle' });
      }

      doc.setFont(font, 'normal');
      doc.setFontSize(10);
      doc.setTextColor(secondaryTextColor);
      const bottomMargin = 10;
      doc.text(authorName, pageWidth - 15, pageHeight - bottomMargin, { align: 'right' });

      if (showPageNumbers) {
          doc.setFont(font, 'normal');
          doc.setFontSize(10);
          doc.setTextColor(secondaryTextColor);
          const pageNumberText = `${index + 1} / ${pages.length}`;
          doc.text(pageNumberText, 15, pageHeight - bottomMargin, { align: 'left' });
      }
    });

    const filename = generateFilename();
    doc.save(filename);
  };

  return (
    <div className="bg-slate-100 flex items-center justify-center min-h-screen font-sans py-10">
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-300/60">
          
          <div className="p-6 md:p-8 border-b border-slate-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Slide Deck PDF Generator
            </h1>
            <p className="text-slate-500 mt-2">
              Create square, slide-style PDFs perfect for LinkedIn carousels.
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              {pages.map((page, index) => (
                <PageInput
                  key={index}
                  index={index}
                  title={page.title}
                  content={page.content}
                  onContentChange={handlePageContentChange}
                  onTitleChange={handlePageTitleChange}
                  onRemove={handleRemovePage}
                  canBeRemoved={pages.length > 1}
                />
              ))}
            </div>

            <div>
              <button
                onClick={handleAddPage}
                className="w-full flex items-center justify-center text-blue-600 font-semibold py-2 px-4 rounded-lg border-2 border-dashed border-blue-400 hover:bg-blue-50 hover:border-solid transition-all duration-200"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Slide
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              <div className="space-y-2">
                <label htmlFor="authorName" className="flex items-center text-sm font-medium text-slate-700">
                  <User className="w-4 h-4 mr-2" />
                  Author Name
                </label>
                <input
                  type="text"
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="e.g., Alex Doe"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="backgroundColor" className="flex items-center text-sm font-medium text-slate-700">
                  <Palette className="w-4 h-4 mr-2" />
                  Background Color
                </label>
                <div className="relative">
                   <input
                    type="text"
                    readOnly
                    value={backgroundColor}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                  <input
                    type="color"
                    id="backgroundColor"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="absolute top-0 right-0 h-full w-12 opacity-0 cursor-pointer"
                  />
                   <div 
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 w-6 h-6 rounded-md border border-slate-300"
                    style={{ backgroundColor: backgroundColor }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="font" className="flex items-center text-sm font-medium text-slate-700">
                  <Type className="w-4 h-4 mr-2" />
                  Font Style
                </label>
                <select
                  id="font"
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-no-repeat bg-right pr-8"
                  style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}
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
                <label htmlFor="showPageNumbers" className="ml-2 text-sm font-medium text-slate-700">
                  Show Page Numbers
                </label>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-slate-50/50 rounded-b-2xl">
            <button
              onClick={handleGeneratePdf}
              disabled={!isPdfLibReady}
              className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 ease-in-out shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {isPdfLibReady ? (
                <>
                  <ArrowDownToLine className="w-5 h-5 mr-3" />
                  Generate & Download PDF ({pages.length} {pages.length === 1 ? 'Slide' : 'Slides'})
                </>
              ) : (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Loading Library...
                </>
              )}
            </button>
          </div>
        </div>
        
        <footer className="text-center mt-8 text-sm text-slate-500">
            <p>&copy; 2025 PDF Slide Generator. Built with vibes by Nav.</p>
        </footer>
      </div>
    </div>
  );
}