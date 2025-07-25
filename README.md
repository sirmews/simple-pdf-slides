# Kinda Professional Carousels - LinkedIn Carousel Generator

> Y'know those awful carousels we're forced to navigate in LinkedIn? Be the problem, not the solution. 

A React-based web application for creating square, slide-style PDFs perfect for LinkedIn carousels and other social media content.

## 🚀 Features

- **Multiple Design Templates**: Choose from various professional templates
- **Customizable Content**: Add titles, content, and images to each slide
- **Color Customization**: Pick background colors for each slide
- **Font Options**: Select from different font families
- **Dark/Light Mode**: Toggle between themes for comfortable editing
- **Page Numbers**: Optional page numbering
- **Local Storage**: Automatically saves your work
- **PDF Export**: Generate high-quality PDF files ready for upload

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **@react-pdf/renderer** - PDF generation
- **Lucide React** - Beautiful icons
- **PostCSS & Autoprefixer** - CSS processing

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- Bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd simple-pdf-slides
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the development server**
   ```bash
   bun run dev
   ```

4. **Open your browser**
   
   The application will automatically open at `http://localhost:3000`

## 📝 Development Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally

## 🎨 How to Use

1. **Add Content**: Click the "+" button to add new slides
2. **Edit Slides**: Click on any slide to edit its title, content, and styling
3. **Choose Templates**: Select from available design templates
4. **Customize Colors**: Pick background colors for each slide
5. **Add Images**: Upload images to enhance your slides
6. **Configure Settings**: Set author name, font, and page number preferences
7. **Export PDF**: Click the download button to generate your PDF

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── DesignTemplateIcons.jsx
│   ├── PageInput.jsx
│   └── TemplateSelector.jsx
├── hooks/               # Custom React hooks
│   └── useDarkMode.js
├── utils/               # Utility functions
│   └── colorUtils.js
├── App.jsx              # Main application component
├── PDFDocument.jsx      # PDF generation logic
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## 🎯 Key Components

- **App.jsx**: Main application logic and state management
- **PDFDocument.jsx**: PDF generation using @react-pdf/renderer
- **PageInput.jsx**: Individual slide editor component
- **TemplateSelector.jsx**: Template selection interface
- **useDarkMode.js**: Dark/light mode toggle hook

## 🔧 Configuration

The application uses Vite for development and building. Key configurations:

- **Port**: Development server runs on port 3000
- **Auto-open**: Browser automatically opens on dev server start
- **PDF Optimization**: @react-pdf/renderer is pre-optimized for faster builds

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Dark Mode**: Built-in dark/light theme support
- **Responsive**: Mobile-friendly design
- **Custom Colors**: Dynamic background color selection

## 💾 Data Persistence

The application automatically saves your work to browser localStorage, including:
- Slide content and styling
- Author information
- Font preferences
- Page number settings

## 🚀 Deployment

To deploy the application:

1. **Build for production**
   ```bash
   bun run build
   ```

2. **Deploy the `dist` folder** to your hosting platform of choice (Netlify, Vercel, GitHub Pages, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

If you encounter any issues or have questions, please open an issue on the repository.

