import { createFileRoute } from '@tanstack/react-router'
import MainContent from '../components/MainContent'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { isDarkMode } = Route.useRouteContext()
  
  return <MainContent isDarkMode={isDarkMode} />
}