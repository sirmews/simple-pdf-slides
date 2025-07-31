import React from 'react';
import { SlideData, FontFamily } from '@/types/slide';
import PageInput from './PageInput';
import { ArrowDownToLine, Loader2, PlusCircle, User, Type } from 'lucide-react';

interface FormViewProps {
  slides: SlideData[];
  font: FontFamily;
  authorName: string;
  showPageNumbers: boolean;
  isDarkMode: boolean;
  isGeneratingPdf: boolean;
  onSlideUpdate: (index: number, slide: SlideData) => void;
  onSlideAdd: () => void;
  onSlideRemove: (index: number) => void;
  onSlideDuplicate: (index: number) => void;
  onAuthorNameChange: (name: string) => void;
  onFontChange: (font: FontFamily) => void;
  onShowPageNumbersChange: (show: boolean) => void;
  onGeneratePdf: () => void;
}

export default function FormView({
  slides,
  font,
  authorName,
  showPageNumbers,
  isDarkMode,
  isGeneratingPdf,
  onSlideUpdate,
  onSlideAdd,
  onSlideRemove,
  onSlideDuplicate,
  onAuthorNameChange,
  onFontChange,
  onShowPageNumbersChange,
  onGeneratePdf
}: FormViewProps) {
  
  // Handler functions for PageInput components
  const handlePageContentChange = (index: number, content: string) => {
    const updatedSlide = { ...slides[index], content };
    onSlideUpdate(index, updatedSlide);
  };

  const handlePageTitleChange = (index: number, title: string) => {
    const updatedSlide = { ...slides[index], title };
    onSlideUpdate(index, updatedSlide);
  };

  const handlePageBackgroundColorChange = (index: number, backgroundColor: string) => {
    const updatedSlide = { ...slides[index], backgroundColor };
    onSlideUpdate(index, updatedSlide);
  };

  const handlePageImageChange = (index: number, image: string) => {
    const updatedSlide = { ...slides[index], image };
    onSlideUpdate(index, updatedSlide);
  };

  const handlePageImageRemove = (index: number) => {
    const updatedSlide = { ...slides[index], image: null };
    onSlideUpdate(index, updatedSlide);
  };

  const handlePageTemplateChange = (index: number, template: 'simple' | 'split') => {
    const updatedSlide = { ...slides[index], template };
    onSlideUpdate(index, updatedSlide);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pb-6">
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"} transition-colors duration-200`}>
        
        {/* Form Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Slides */}
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <PageInput
                key={index}
                index={index}
                title={slide.title}
                content={slide.content}
                backgroundColor={slide.backgroundColor}
                image={slide.image}
                template={slide.template}
                onContentChange={handlePageContentChange}
                onTitleChange={handlePageTitleChange}
                onBackgroundColorChange={handlePageBackgroundColorChange}
                onImageChange={handlePageImageChange}
                onImageRemove={handlePageImageRemove}
                onTemplateChange={handlePageTemplateChange}
                onRemove={onSlideRemove}
                canBeRemoved={slides.length > 1}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>

          {/* Add Slide Button */}
          <div>
            <button
              onClick={onSlideAdd}
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

          {/* Global Settings */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t ${isDarkMode ? "border-gray-700" : "border-slate-200"}`}>
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
                onChange={(e) => onAuthorNameChange(e.target.value)}
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
                onChange={(e) => onFontChange(e.target.value as FontFamily)}
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
                onChange={(e) => onShowPageNumbersChange(e.target.checked)}
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

        {/* Generate PDF Section */}
        <div className={`p-6 md:p-8 ${isDarkMode ? "bg-gray-700/30" : "bg-slate-50/50"} rounded-b-2xl`}>
          <button
            onClick={onGeneratePdf}
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
                Generate & Download PDF ({slides.length}{" "}
                {slides.length === 1 ? "Slide" : "Slides"})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Ko-fi Support Button */}
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

      {/* Footer */}
      <footer className={`text-center mt-4 text-sm ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>
        <p>&copy; 2025 PDF Slide Generator. Built with vibes by Nav.</p>
      </footer>
    </div>
  );
}