import { Moon, Sun } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ isDarkMode, toggleDarkMode }: HeaderProps) {
  return (
    <header className="bg-transparent">
      <div className="flex justify-between items-center p-4">
        <nav className="flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors duration-200 hover:opacity-80 [&.active]:opacity-100 [&.active]:underline ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Simple PDF Slides
          </Link>
          <Link
            to="/profile-banner"
            className={`text-sm transition-colors duration-200 hover:opacity-80 [&.active]:opacity-100 [&.active]:underline ${
              isDarkMode ? "text-gray-300" : "text-slate-600"
            }`}
          >
            Profile Banner
          </Link>
          <Link
            to="/help"
            className={`text-sm transition-colors duration-200 hover:opacity-80 [&.active]:opacity-100 [&.active]:underline ${
              isDarkMode ? "text-gray-300" : "text-slate-600"
            }`}
          >
            Help
          </Link>
        </nav>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg transition-colors duration-200 backdrop-blur-sm ${
            isDarkMode
              ? "bg-gray-800/80 hover:bg-gray-700/80 text-yellow-400 border border-gray-600/50"
              : "bg-white/80 hover:bg-slate-100/80 text-slate-600 border border-slate-200/50"
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
    </header>
  );
}