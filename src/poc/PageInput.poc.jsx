import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, XCircle, Palette, Upload, Image as ImageIcon, Layout } from "lucide-react";
import TemplateSelector from "../components/TemplateSelector";

const MAX_CHARS_PER_PAGE = 250;
const MAX_CHARS_TITLE = 50;

export default function PageInputPoc({
  id,
  index,
  title,
  content,
  backgroundColor,
  image,
  template,
  onContentChange,
  onTitleChange,
  onBackgroundColorChange,
  onImageChange,
  onImageRemove,
  onTemplateChange,
  onRemove,
  canBeRemoved,
  isDarkMode,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const charsLeft = MAX_CHARS_PER_PAGE - content.length;

  const handleTextChange = (e) => {
    // Enforce character limit (emojis now supported!)
    const newText = e.target.value.slice(0, MAX_CHARS_PER_PAGE);
    onContentChange(index, newText);
  };

  const handleTitleChange = (e) => {
    // Enforce character limit (emojis now supported!)
    const newTitle = e.target.value.slice(0, MAX_CHARS_TITLE);
    onTitleChange(index, newTitle);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"} border ${isDarkMode ? "border-gray-600" : "border-gray-200"} rounded-lg transition-colors duration-200 space-y-3`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button {...attributes} {...listeners} className={`mr-2 ${isDarkMode ? "text-gray-400" : "text-slate-400"}`}><GripVertical /></button>
          <label
            className={`text-sm font-bold ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}
          >
            Slide {index + 1}
          </label>
        </div>
        {canBeRemoved && (
          <button
            onClick={() => onRemove(index)}
            className={`${isDarkMode ? "text-gray-400 hover:text-red-400" : "text-slate-400 hover:text-red-500"} transition-colors`}
            title={index === 0 ? "Clear Slide Content" : "Remove Slide"}
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
        className={`w-full p-2 ${isDarkMode ? "bg-gray-700 border-gray-500 text-white placeholder-gray-400" : "bg-white border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
        placeholder="Optional Title..."
      />

      {/* Template Selector */}
      <div className="space-y-2">
        <label className={`flex items-center text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}>
          <Layout className="w-4 h-4 mr-2" />
          Template
        </label>
        <TemplateSelector 
          selectedTemplate={template || "simple"}
          onTemplateChange={(templateId) => onTemplateChange(index, templateId)}
          size={64}
        />
      </div>

      {/* Background Color Picker */}
      <div className="space-y-2">
        <label className={`flex items-center text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}>
          <Palette className="w-4 h-4 mr-2" />
          Background Color
        </label>
        <div className="relative">
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => {
              const value = e.target.value;
              // Allow typing and validate hex color format
              if (value.match(/^#[0-9A-Fa-f]{0,6}$/) || value === '') {
                onBackgroundColorChange(index, value);
              }
            }}
            onBlur={(e) => {
              // Ensure valid hex color on blur
              const value = e.target.value;
              if (!value.match(/^#[0-9A-Fa-f]{6}$/)) {
                // If invalid, revert to previous valid color
                onBackgroundColorChange(index, backgroundColor);
              }
            }}
            className={`w-full p-2 pr-12 ${isDarkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-white border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
            placeholder="#e0f2fe"
          />
          <input
            id={`color-picker-${index}`}
            type="color"
            value={backgroundColor}
            onChange={(e) => onBackgroundColorChange(index, e.target.value)}
            className="absolute top-0 right-0 h-full w-12 opacity-0 cursor-pointer"
          />
          <div
            className={`absolute top-1/2 right-3 transform -translate-y-1/2 w-6 h-6 rounded-md border ${isDarkMode ? "border-gray-600" : "border-slate-300"} cursor-pointer`}
            style={{ backgroundColor: backgroundColor }}
            onClick={() => document.getElementById(`color-picker-${index}`).click()}
            title="Click to open color picker"
          ></div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className={`flex items-center text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}>
          <ImageIcon className="w-4 h-4 mr-2" />
          Image (Optional)
        </label>
        
        {image ? (
          <div className="relative">
            <img 
              src={image} 
              alt={`Slide ${index + 1} image`}
              className="w-full max-h-64 object-contain rounded-lg border bg-gray-50"
              style={{ aspectRatio: 'auto' }}
            />
            <button
              onClick={() => onImageRemove(index)}
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
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) onImageChange(index, file);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className={`flex items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${
              isDarkMode 
                ? "border-gray-600 hover:border-gray-500 bg-gray-700/50" 
                : "border-gray-300 hover:border-gray-400 bg-gray-50"
            }`}>
              <div className="text-center">
                <Upload className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Click to upload an image
                </p>
                <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <textarea
        value={content}
        onChange={handleTextChange}
        className={`w-full h-32 p-3 ${isDarkMode ? "bg-gray-700 border-gray-500 text-white placeholder-gray-400" : "bg-white border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none`}
        placeholder={`Write slide ${index + 1} content here...`}
      />
      <div
        className={`text-right text-sm mt-1 ${charsLeft < 25 ? "text-red-500" : isDarkMode ? "text-gray-400" : "text-slate-500"}`}
      >
        {charsLeft} characters remaining
      </div>
    </div>
  );
}
