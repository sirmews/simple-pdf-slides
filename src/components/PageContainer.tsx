import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  isDarkMode: boolean
}

export default function PageContainer({ children, isDarkMode }: PageContainerProps) {
  return (
    <main className="min-h-screen pt-6 pb-20">
      <div className="w-full max-w-2xl mx-auto md:px-8">
        {children}
      </div>
    </main>
  )
}