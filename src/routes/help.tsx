import { createFileRoute } from '@tanstack/react-router'
import { HelpCircle, FileText, Download, Palette } from 'lucide-react'

export const Route = createFileRoute('/help')({
  component: Help,
})

function Help() {
  const { isDarkMode } = Route.useRouteContext()
  
  return (
    <main className="flex items-center justify-center min-h-screen pt-16 pb-20">
      <div className="w-full max-w-4xl mx-auto md:px-8">
        <div
          className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"} transition-colors duration-200`}
        >
          <div className={`p-6 md:p-8`}>
            <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              Help & Guide
            </h1>
            <p className={`${isDarkMode ? "text-gray-400" : "text-slate-500"} mb-8`}>
              Learn how to create professional carousels with Simple PDF Slides
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-lg border ${isDarkMode ? "border-gray-700 bg-gray-700/30" : "border-slate-200 bg-slate-50"}`}>
                <div className="flex items-center mb-4">
                  <FileText className={`w-6 h-6 mr-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                  <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                    Getting Started
                  </h3>
                </div>
                <ul className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>
                  <li>• Add your slide content (max 250 characters per slide)</li>
                  <li>• Add optional titles (max 50 characters)</li>
                  <li>• Choose background colors for each slide</li>
                  <li>• Select your preferred font style</li>
                </ul>
              </div>

              <div className={`p-6 rounded-lg border ${isDarkMode ? "border-gray-700 bg-gray-700/30" : "border-slate-200 bg-slate-50"}`}>
                <div className="flex items-center mb-4">
                  <Palette className={`w-6 h-6 mr-3 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
                  <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                    Design Tips
                  </h3>
                </div>
                <ul className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>
                  <li>• Use high contrast colors for better readability</li>
                  <li>• Keep text concise and impactful</li>
                  <li>• Emojis are fully supported! 🎨</li>
                  <li>• Square format (595x595) perfect for social media</li>
                </ul>
              </div>

              <div className={`p-6 rounded-lg border ${isDarkMode ? "border-gray-700 bg-gray-700/30" : "border-slate-200 bg-slate-50"}`}>
                <div className="flex items-center mb-4">
                  <Download className={`w-6 h-6 mr-3 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                  <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                    Export & Download
                  </h3>
                </div>
                <ul className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>
                  <li>• Click "Generate & Download PDF" when ready</li>
                  <li>• PDF filename auto-generated from first slide</li>
                  <li>• High-quality output suitable for printing</li>
                  <li>• Optional page numbers and author name</li>
                </ul>
              </div>

              <div className={`p-6 rounded-lg border ${isDarkMode ? "border-gray-700 bg-gray-700/30" : "border-slate-200 bg-slate-50"}`}>
                <div className="flex items-center mb-4">
                  <HelpCircle className={`w-6 h-6 mr-3 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`} />
                  <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                    Troubleshooting
                  </h3>
                </div>
                <ul className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>
                  <li>• Character limits enforced for optimal display</li>
                  <li>• Text color automatically adjusts for contrast</li>
                  <li>• Dark/light mode persists across sessions</li>
                  <li>• All data stored locally in your browser</li>
                </ul>
              </div>
            </div>

            <div className={`mt-8 p-6 rounded-lg ${isDarkMode ? "bg-blue-900/30 border border-blue-700" : "bg-blue-50 border border-blue-200"}`}>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}>
                💡 Pro Tip
              </h3>
              <p className={`${isDarkMode ? "text-blue-200" : "text-blue-700"}`}>
                For LinkedIn carousels, aim for 5-10 slides with a clear narrative flow. Start with a hook, provide value in the middle slides, and end with a call-to-action or summary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}