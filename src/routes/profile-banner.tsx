import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile-banner')({
  component: ProfileBanner,
})

function ProfileBanner() {
  const { isDarkMode } = Route.useRouteContext()
  
  return (
    <main className="flex items-center justify-center min-h-screen pt-16 pb-20">
      <div className="w-full max-w-2xl mx-auto md:px-8">
        <div
          className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"} transition-colors duration-200`}
        >
          <div className={`p-6 md:p-8`}>
            <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              Profile Banner Creator
            </h1>
            <p className={`${isDarkMode ? "text-gray-400" : "text-slate-500"} mb-6`}>
              Coming soon! Create professional profile banners for your social media and professional networks.
            </p>
            <div className={`p-8 border-2 border-dashed rounded-lg ${isDarkMode ? "border-gray-600" : "border-slate-300"}`}>
              <div className="text-center">
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>
                  🚧 Under Construction
                </h3>
                <p className={`${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>
                  We're working on bringing you an amazing profile banner creation tool. Stay tuned!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}