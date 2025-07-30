import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PlusCircle, Copy, Trash2, ArrowDownToLine, Loader2, User, Type, Image as ImageIcon, XCircle } from 'lucide-react';
import { SlideData, FontFamily } from '@/types/slide';
import CanvasSlideEditor from './CanvasSlideEditor';
import TemplateSelector from './TemplateSelector';

interface CanvasViewProps {
  slides: SlideData[];
  font: FontFamily;
  authorName: string;
  showPageNumbers: boolean;
  onSlideUpdate: (index: number, slide: SlideData) => void;
  onSlideAdd: () => void;
  onSlideRemove: (index: number) => void;
  onSlideDuplicate?: (index: number) => void;
  onAuthorNameChange: (name: string) => void;
  onFontChange: (font: FontFamily) => void;
  onShowPageNumbersChange: (show: boolean) => void;
  onGeneratePdf: () => void;
  isGeneratingPdf: boolean;
  isDarkMode: boolean;
}

export default function CanvasView({
  slides,
  font,
  authorName,
  showPageNumbers,
  onSlideUpdate,
  onSlideAdd,
  onSlideRemove,
  onSlideDuplicate,
  onAuthorNameChange,
  onFontChange,
  onShowPageNumbersChange,
  onGeneratePdf,
  isGeneratingPdf,
  isDarkMode
}: CanvasViewProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentSlide = slides[currentSlideIndex];
  
  // Calculate optimal scale based on viewport
  const calculateOptimalScale = () => {
    if (typeof window !== 'undefined') {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Reserve space for navigation and controls
      const availableWidth = Math.min(viewportWidth - 400, 800); // Reserve 400px for controls
      const availableHeight = viewportHeight - 200; // Reserve 200px for navigation
      
      const scaleForWidth = availableWidth / 595;
      const scaleForHeight = availableHeight / 595;
      
      return Math.min(scaleForWidth, scaleForHeight, 1.2); // Cap at 120%
    }
    return 0.8;
  };

  const [canvasScale] = useState(calculateOptimalScale());

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts if no input/textarea is focused
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToSlide(currentSlideIndex - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToSlide(currentSlideIndex + 1);
          break;
        case 'n':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onSlideAdd();
          }
          break;
        case 'd':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            duplicateSlide();
          }
          break;
        case 'Delete':
        case 'Backspace':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            deleteSlide();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, slides.length]);

  const handleSlideUpdate = (field: keyof SlideData, value: any) => {
    if (currentSlide) {
      const updatedSlide = { ...currentSlide, [field]: value };
      onSlideUpdate(currentSlideIndex, updatedSlide);
    }
  };

  const handleImageChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        handleSlideUpdate('image', e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlideIndex(index);
    }
  };

  const duplicateSlide = () => {
    if (onSlideDuplicate) {
      onSlideDuplicate(currentSlideIndex);
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const deleteSlide = () => {
    if (slides.length > 1) {
      onSlideRemove(currentSlideIndex);
      if (currentSlideIndex >= slides.length - 1) {
        setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
      }
    }
  };

  return (
    <div className={`min-h-screen ${
      isDarkMode ? 'bg-gray-900' : 'bg-slate-100'
    } transition-colors duration-200`}>
      
      {/* Wide Container */}
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* Slide Content Area - Centered */}
        <div className="flex justify-center">
          <div className="space-y-6">
            
            {/* Template Selector Above Slide */}
            {currentSlide && (
              <div className="flex justify-center">
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Template:
                    </span>
                    <TemplateSelector
                      selectedTemplate={currentSlide.template}
                      onTemplateChange={(template) => handleSlideUpdate('template', template)}
                      size={48}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Slide with Hover Controls - Center */}
            <div className="flex justify-center">
              {currentSlide && (
                <div className="relative group">
                  <CanvasSlideEditor
                    slide={currentSlide}
                    index={currentSlideIndex}
                    font={font}
                    isSelected={true}
                    onSlideClick={() => {}} // No-op for single slide view
                    onTitleChange={(value) => handleSlideUpdate('title', value)}
                    onContentChange={(value) => handleSlideUpdate('content', value)}
                    scale={canvasScale}
                  />
                  
                  {/* Hover Overlay Controls */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {/* Top-right controls */}
                    <div className="absolute top-4 right-4 flex space-x-2 pointer-events-auto">
                      {/* Background Color Picker */}
                      <div className="relative">
                        <input
                          id={`hover-color-picker-${currentSlideIndex}`}
                          type="color"
                          value={currentSlide.backgroundColor}
                          onChange={(e) => handleSlideUpdate('backgroundColor', e.target.value)}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer opacity-0 absolute"
                          title="Change background color"
                        />
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer"
                          style={{ backgroundColor: currentSlide.backgroundColor }}
                          onClick={() => document.getElementById(`hover-color-picker-${currentSlideIndex}`)?.click()}
                          title="Change background color"
                        />
                      </div>
                      
                      {/* Image Upload */}
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer ${
                          currentSlide.image 
                            ? 'bg-green-500 text-white' 
                            : isDarkMode 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      </div>
                      
                      {/* Remove Image Button (only show if image exists) */}
                      {currentSlide.image && (
                        <button
                          onClick={() => handleSlideUpdate('image', null)}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-lg bg-red-500 text-white flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Slide Actions - Below Slide */}
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={duplicateSlide}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' 
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                  }`}
                  title="Duplicate slide (Cmd/Ctrl + D)"
                >
                  <Copy className="w-4 h-4" />
                  <span>Duplicate</span>
                </button>
                
                <button
                  onClick={deleteSlide}
                  disabled={slides.length <= 1}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    slides.length <= 1
                      ? 'opacity-50 cursor-not-allowed'
                      : isDarkMode 
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                  title="Delete slide (Cmd/Ctrl + Delete)"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Below Slide */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => goToSlide(currentSlideIndex - 1)}
              disabled={currentSlideIndex === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentSlideIndex === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                    : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Slide Thumbnails */}
            <div className="flex items-center space-x-2">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 transition-all ${
                    index === currentSlideIndex
                      ? isDarkMode 
                        ? 'border-blue-500 bg-blue-600/20' 
                        : 'border-blue-500 bg-blue-50'
                      : isDarkMode 
                        ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                        : 'border-gray-300 bg-gray-100 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: index === currentSlideIndex ? slide.backgroundColor + '40' : undefined }}
                  title={slide.title || `Slide ${index + 1}`}
                >
                  <div className="w-full h-full rounded-md flex items-center justify-center text-xs font-medium"
                       style={{ backgroundColor: slide.backgroundColor + '60' }}>
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>

            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
            }`}>
              <span className="text-sm font-medium">
                {currentSlideIndex + 1} of {slides.length}
              </span>
            </div>

            <button
              onClick={() => goToSlide(currentSlideIndex + 1)}
              disabled={currentSlideIndex === slides.length - 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentSlideIndex === slides.length - 1
                  ? 'opacity-50 cursor-not-allowed'
                  : isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                    : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onSlideAdd}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Slide</span>
            </button>
          </div>
        </div>

        {/* Global Settings - Below Navigation */}
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-lg border p-6 space-y-6 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Global Settings
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label
                  className={`flex items-center text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}
                >
                  <User className="w-4 h-4 mr-2" />
                  Author Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => onAuthorNameChange(e.target.value)}
                  className={`w-full p-3 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                  placeholder="e.g., Alex Doe"
                />
              </div>

              <div className="space-y-2">
                <label
                  className={`flex items-center text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}
                >
                  <Type className="w-4 h-4 mr-2" />
                  Font Style
                </label>
                <select
                  value={font}
                  onChange={(e) => onFontChange(e.target.value as FontFamily)}
                  className={`w-full p-3 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                >
                  <option value="helvetica">Helvetica (Sans-Serif)</option>
                  <option value="times">Times (Serif)</option>
                  <option value="courier">Courier (Monospace)</option>
                </select>
              </div>

              <div className="flex items-center justify-start">
                <input
                  type="checkbox"
                  checked={showPageNumbers}
                  onChange={(e) => onShowPageNumbersChange(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  className={`ml-2 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}
                >
                  Show Page Numbers
                </label>
              </div>
            </div>

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
      </div>
    </div>
  );
}