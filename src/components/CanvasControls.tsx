import React from 'react';
import { Palette, Upload, Image as ImageIcon, Layout, XCircle } from 'lucide-react';
import { SlideData, SlideTemplate } from '@/types/slide';
import TemplateSelector from './TemplateSelector';

interface CanvasControlsProps {
  slide: SlideData;
  slideIndex: number;
  onBackgroundColorChange: (color: string) => void;
  onTemplateChange: (template: SlideTemplate) => void;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
  isDarkMode: boolean;
}

export default function CanvasControls({
  slide,
  slideIndex,
  onBackgroundColorChange,
  onTemplateChange,
  onImageChange,
  onImageRemove,
  isDarkMode
}: CanvasControlsProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className={`p-4 rounded-lg border space-y-4 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <h3 className={`font-bold text-lg ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Slide {slideIndex + 1} Controls
      </h3>

      {/* Template Selector */}
      <div className="space-y-2">
        <label className={`flex items-center text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-slate-700'
        }`}>
          <Layout className="w-4 h-4 mr-2" />
          Template
        </label>
        <TemplateSelector
          selectedTemplate={slide.template}
          onTemplateChange={onTemplateChange}
          size={64}
        />
      </div>

      {/* Background Color Picker */}
      <div className="space-y-2">
        <label className={`flex items-center text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-slate-700'
        }`}>
          <Palette className="w-4 h-4 mr-2" />
          Background Color
        </label>
        <div className="relative">
          <input
            type="text"
            value={slide.backgroundColor}
            onChange={(e) => {
              const value = e.target.value;
              if (value.match(/^#[0-9A-Fa-f]{0,6}$/) || value === '') {
                onBackgroundColorChange(value);
              }
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (!value.match(/^#[0-9A-Fa-f]{6}$/)) {
                onBackgroundColorChange(slide.backgroundColor);
              }
            }}
            className={`w-full p-2 pr-12 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-500 text-white' 
                : 'bg-white border-gray-300'
            }`}
            placeholder="#e0f2fe"
          />
          <input
            id={`canvas-color-picker-${slideIndex}`}
            type="color"
            value={slide.backgroundColor}
            onChange={(e) => onBackgroundColorChange(e.target.value)}
            className="absolute top-0 right-0 h-full w-12 opacity-0 cursor-pointer"
          />
          <div
            className={`absolute top-1/2 right-3 transform -translate-y-1/2 w-6 h-6 rounded-md border cursor-pointer ${
              isDarkMode ? 'border-gray-600' : 'border-slate-300'
            }`}
            style={{ backgroundColor: slide.backgroundColor }}
            onClick={() => document.getElementById(`canvas-color-picker-${slideIndex}`)?.click()}
            title="Click to open color picker"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className={`flex items-center text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-slate-700'
        }`}>
          <ImageIcon className="w-4 h-4 mr-2" />
          Image (Optional)
        </label>
        
        {slide.image ? (
          <div className="relative">
            <img 
              src={slide.image} 
              alt={`Slide ${slideIndex + 1} image`}
              className="w-full max-h-32 object-contain rounded-lg border bg-gray-50"
            />
            <button
              onClick={onImageRemove}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              title="Remove image"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className={`flex items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors ${
              isDarkMode 
                ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50' 
                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }`}>
              <div className="text-center">
                <Upload className={`w-6 h-6 mx-auto mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Click to upload
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Help */}
      <div className={`text-xs p-3 rounded-md ${
        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'
      }`}>
        <p><strong>Tips:</strong></p>
        <ul className="mt-1 space-y-1">
          <li>• Click on text to edit directly</li>
          <li>• Press Enter to save, Escape to cancel</li>
          <li>• Character limits are enforced automatically</li>
        </ul>
      </div>
    </div>
  );
}