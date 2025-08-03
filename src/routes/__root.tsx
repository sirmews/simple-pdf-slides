import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useDarkMode } from '../hooks/useDarkMode'

export const Route = createRootRoute({
  component: () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode()

    return (
      <div
        className={`${isDarkMode ? "dark bg-gray-900" : "bg-slate-100"} min-h-screen font-sans transition-colors duration-200`}
      >
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <Outlet context={{ isDarkMode }} />
        <Footer isDarkMode={isDarkMode} />
        <TanStackRouterDevtools />
      </div>
    )
  },
})