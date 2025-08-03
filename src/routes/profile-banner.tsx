import { createFileRoute } from '@tanstack/react-router'
import PageContainer from '../components/PageContainer'

export const Route = createFileRoute('/profile-banner')({
  component: ProfileBanner,
})

function ProfileBanner() {
  const { isDarkMode } = Route.useRouteContext()
  
  return (
    <PageContainer isDarkMode={isDarkMode}>
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="heading-primary">
              Profile Banner Creator
            </h1>
            <p className="text-secondary mt-2">
              Coming soon! Create professional profile banners for your social media and professional networks.
            </p>
          </div>
        </div>
        <div className="card-content">
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
    </PageContainer>
  )
}