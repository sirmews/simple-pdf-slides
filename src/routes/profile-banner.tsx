import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import PageContainer from '../components/PageContainer'
import { Upload, Download, Image as ImageIcon } from 'lucide-react'

export const Route = createFileRoute('/profile-banner')({
  component: ProfileBanner,
})

function ProfileBanner() {
  const { isDarkMode } = Route.useRouteContext()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCircleClick = () => {
    fileInputRef.current?.click()
  }

  const [showSeekingClients, setShowSeekingClients] = useState(false)

  const toggleSeekingClients = () => {
    setShowSeekingClients(!showSeekingClients)
  }

  const handleSaveImage = async () => {
    if (!selectedImage) return

    // Create a canvas element
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match the seeking clients banner resolution for optimal quality
    const size = 1680 // Same as seek-clients.png dimensions (1680x1680)
    canvas.width = size
    canvas.height = size
    
    // Enable high-quality image rendering
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Create image object from selected image
    const img = new Image()
    
    return new Promise<void>((resolve) => {
      img.onload = async () => {
        // Clear canvas with transparent background
        ctx.clearRect(0, 0, size, size)
        
        // Create circular clipping path
        ctx.save()
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
        ctx.clip()
        
        // Draw the main image, scaled to fit circle
        ctx.drawImage(img, 0, 0, size, size)
        ctx.restore()
        
        // Add seeking clients overlay if enabled
        if (showSeekingClients) {
          const overlayImg = new Image()
          overlayImg.crossOrigin = 'anonymous'
          
          await new Promise<void>((overlayResolve) => {
            overlayImg.onload = () => {
              // Draw the seeking clients overlay on top
              ctx.save()
              ctx.beginPath()
              ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
              ctx.clip()
              ctx.drawImage(overlayImg, 0, 0, size, size)
              ctx.restore()
              overlayResolve()
            }
            overlayImg.onerror = () => overlayResolve() // Continue even if overlay fails to load
            overlayImg.src = '/assets/seek-clients.png'
          })
        }
        
        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'profile-banner.png'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }
          resolve()
        }, 'image/png')
      }
      
      img.src = selectedImage
    })
  }
  
  return (
    <PageContainer isDarkMode={isDarkMode}>
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="heading-primary">
              Profile Banner Creator
            </h1>
            <p className="text-secondary mt-2">
              Make your LinkedIn profile image stand out and be a little bit different from the rest. Not too different and still professional.
            </p>
          </div>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image Upload and Preview */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <div
                  onClick={handleCircleClick}
                  className="relative w-64 h-64 cursor-pointer"
                >
                  <div
                    className={`w-full h-full rounded-full transition-all duration-200 overflow-hidden ${
                      selectedImage 
                        ? '' 
                        : isDarkMode 
                          ? 'bg-gray-700 border-2 border-dashed border-gray-600 hover:border-gray-500' 
                          : 'bg-gray-50 border-2 border-dashed border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {selectedImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={selectedImage}
                          alt="Profile preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                        
                        {/* Seeking Clients overlay */}
                        {showSeekingClients && (
                          <img
                            src="/assets/seek-clients.png"
                            alt="Seeking Clients"
                            className="absolute inset-0 w-full h-full object-cover rounded-full pointer-events-none"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <Upload className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-gray-400' : 'text-slate-400'}`} />
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                          Click to upload image
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Banner Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Banner Options</h3>
              
              <button
                onClick={toggleSeekingClients}
                className={`w-full p-4 border-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  showSeekingClients 
                    ? 'border-blue-500 bg-blue-50' 
                    : isDarkMode 
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                  #
                </div>
                <div className="text-left">
                  <div className={`font-semibold ${
                    showSeekingClients 
                      ? 'text-blue-700' 
                      : 'text-primary'
                  }`}>
                    Seeking Clients Banner
                  </div>
                  <div className={`text-sm ${
                    showSeekingClients 
                      ? 'text-blue-600' 
                      : 'text-secondary'
                  }`}>
                    Add "#SEEKINGCLIENTS" overlay to your profile
                  </div>
                </div>
              </button>
              
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-secondary">
            <button
              onClick={handleSaveImage}
              disabled={!selectedImage}
              className="btn-primary w-full"
            >
              <Download className="w-5 h-5 mr-3" />
              Save Profile Banner
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}