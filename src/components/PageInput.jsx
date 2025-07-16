import { XCircle, Palette } from "lucide-react";

const MAX_CHARS_PER_PAGE = 250;
const MAX_CHARS_TITLE = 50;

export default function PageInput({
  index,
  title,
  content,
  backgroundColor,
  onContentChange,
  onTitleChange,
  onBackgroundColorChange,
  onRemove,
  canBeRemoved,
  isDarkMode,
}) {
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
      className={`relative p-4 ${isDarkMode ? "bg-gray-700" : "bg-slate-50"} border ${isDarkMode ? "border-gray-600" : "border-slate-200"} rounded-lg transition-all duration-300 space-y-3`}
    >
      <div className="flex justify-between items-center">
        <label
          className={`text-sm font-bold ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}
        >
          Slide {index + 1}
        </label>
        {canBeRemoved && (
          <button
            onClick={() => onRemove(index)}
            className={`${isDarkMode ? "text-gray-400 hover:text-red-400" : "text-slate-400 hover:text-red-500"} transition-colors`}
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
        className={`w-full p-2 ${isDarkMode ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" : "bg-white border-slate-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
        placeholder="Optional Title..."
      />

      {/* Background Color Picker */}
      <div className="space-y-2">
        <label className={`flex items-center text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}>
          <Palette className="w-4 h-4 mr-2" />
          Background Color
        </label>
        <div className="relative">
          <input
            type="text"
            readOnly
            value={backgroundColor}
            className={`w-full p-2 ${isDarkMode ? "bg-gray-600 border-gray-500 text-white" : "bg-white border-slate-300"} rounded-lg`}
          />
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => onBackgroundColorChange(index, e.target.value)}
            className="absolute top-0 right-0 h-full w-12 opacity-0 cursor-pointer"
          />
          <div
            className={`absolute top-1/2 right-3 transform -translate-y-1/2 w-6 h-6 rounded-md border ${isDarkMode ? "border-gray-600" : "border-slate-300"}`}
            style={{ backgroundColor: backgroundColor }}
          ></div>
        </div>
      </div>

      <textarea
        value={content}
        onChange={handleTextChange}
        className={`w-full h-32 p-3 ${isDarkMode ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" : "bg-white border-slate-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none`}
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