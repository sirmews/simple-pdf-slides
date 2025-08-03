import { useDarkMode } from './hooks/useDarkMode';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

export default function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      className={`${isDarkMode ? "dark bg-gray-900" : "bg-slate-200"} min-h-screen font-sans transition-colors duration-200`}
    >
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <MainContent isDarkMode={isDarkMode} />
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}