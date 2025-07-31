import React from 'react';
import { SlideData } from '@/types/slide';
import { GridSlideData } from '@/types/grid';
import { convertSlideToGridSlide, convertGridSlideToSlide } from '@/utils/gridUtils';
import GridSlideEditor from './GridSlideEditor';
import { ArrowDownToLine, Loader2, PlusCircle } from 'lucide-react';

interface GridViewProps {
  slides: SlideData[];
  gridSlides: GridSlideData[];
  isDarkMode: boolean;
  isGeneratingPdf: boolean;
  onSlideAdd: () => void;
  onGeneratePdf: () => void;
  onGridSlidesUpdate: (gridSlides: GridSlideData[]) => void;
  onSlidesUpdate: (slides: SlideData[]) => void;
}

export default function GridView({
  slides,
  gridSlides,
  isDarkMode,
  isGeneratingPdf,
  onSlideAdd,
  onGeneratePdf,
  onGridSlidesUpdate,
  onSlidesUpdate
}: GridViewProps) {
  // Convert regular slides to grid slides if needed
  const currentGridSlides = gridSlides.length === slides.length 
    ? gridSlides 
    : slides.map(slide => convertSlideToGridSlide(slide));

  const handleGridSlideUpdate = (index: number, gridSlide: GridSlideData) => {
    const updatedGridSlides = [...currentGridSlides];
    updatedGridSlides[index] = gridSlide;
    onGridSlidesUpdate(updatedGridSlides);
    
    // Also update the regular slides for PDF generation
    const updatedPages = [...slides];
    updatedPages[index] = convertGridSlideToSlide(gridSlide);
    onSlidesUpdate(updatedPages);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pb-6">
      {/* Grid Slides */}
      <div className="space-y-8">
        {currentGridSlides.map((gridSlide, index) => (
          <div key={gridSlide.id} className="flex justify-center">
            <GridSlideEditor
              slide={gridSlide}
              index={index}
              isSelected={true}
              onSlideClick={() => {}}
              onSlideUpdate={(updatedSlide) => handleGridSlideUpdate(index, updatedSlide)}
              scale={0.8}
            />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={onSlideAdd}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Slide</span>
        </button>
        
        <button
          onClick={onGeneratePdf}
          disabled={isGeneratingPdf}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <ArrowDownToLine className="w-5 h-5" />
              <span>Generate PDF ({slides.length} slides)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}