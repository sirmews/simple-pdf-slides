interface FooterProps {
  isDarkMode: boolean;
}

export default function Footer({ isDarkMode }: FooterProps) {
  return (
    <footer className="flex flex-col items-center justify-center py-8 px-6">
      {/* Ko-fi Support Button */}
      <div className="flex justify-center mb-4">
        <a href='https://ko-fi.com/A0A01HT0RG' target='_blank' rel='noopener noreferrer'>
          <img 
            height='36' 
            style={{border: '0px', height: '36px'}} 
            src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' 
            alt='Buy Me a Coffee at ko-fi.com' 
          />
        </a>
      </div>

      <div
        className={`text-center text-sm ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}
      >
        <p>&copy; 2025 PDF Slide Generator. Built with vibes by Nav.</p>
      </div>
    </footer>
  );
}